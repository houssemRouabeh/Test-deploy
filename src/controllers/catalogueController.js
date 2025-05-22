import db from "../../models/index.js";

const { Tree, StockTree, Campaign } = db;

export const getCatalogue = async (req, res) => {
  try {
    let trees = await StockTree.findAll();

    // Conversion des prix en nombres si nécessaire
    trees = trees.map((tree) => {
      return {
        ...tree.get({ plain: true }),
        price: parseFloat(tree.price) || 0,
      };
    });

    res.render("catalogue", { trees });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};

export const getCampaignsForTree = async (req, res) => {
  try {
    const { stockTreeId } = req.params;
    const campaigns = await Campaign.findAll({
      include: [
        {
          association: "trees",
          where: { stockTreeId, userId: null },
          required: true,
        },
      ],
    });
    res.json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const reserveTrees = async (req, res) => {
  try {
    const { stockTreeId, campaignId, quantity, price } = req.body;
    const userId = req.user.id;

    // Trouver des arbres non réservés pour cette campagne et ce type d'arbre
    const availableTrees = await Tree.findAll({
      where: {
        stockTreeId,
        campaignId,
        userId: null,
        status: null,
      },
      limit: quantity,
    });

    if (availableTrees.length < quantity) {
      return res.json({
        success: false,
        message: `Seulement ${availableTrees.length} arbres disponibles sur les ${quantity} demandés.`,
      });
    }

    // Mettre à jour les arbres sélectionnés
    await Promise.all(
      availableTrees.map((tree) =>
        tree.update({
          userId,
          status: "reserved",
          dateOfPurchase: new Date(),
        })
      )
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
