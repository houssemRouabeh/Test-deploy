import db from "../../models/index.js";
import { Op } from "sequelize";
const { Campaign, User, StockTree, Tree, sequelize } = db;

export async function getCampaignManagementPage(req, res) {
  try {
    const campagnes = await Campaign.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: "projectLeader",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Tree,
          as: "trees",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Ajoutez ce log pour vérifier les données
    console.log(
      "Campagnes récupérées:",
      campagnes.map((c) => c.toJSON())
    );

    res.render("project-manager/dashboard", {
      currentPage: "campaign-management",
      user: req.user,
      campagnes: campagnes || [], // Garantit un tableau même si undefined
    });
  } catch (error) {
    console.error("Erreur chargement campagnes:", error);
    res.status(500).render("project-manager/dashboard", {
      currentPage: "campaign-management",
      user: req.user,
      campagnes: [], // Tableau vide en cas d'erreur
    });
  }
}

export async function showCreateCampaignForm(req, res) {
  try {
    // Récupérer les arbres disponibles depuis StockTree
    const availableTrees = await StockTree.findAll({
      where: { quantity: { [Op.gt]: 0 } },
      attributes: ["id", "name", "price", "quantity"],
    });

    res.render("project-manager/dashboard", {
      currentPage: "create-campaign",
      user: req.user,
      availableTrees: JSON.stringify(availableTrees), // Envoyez les données au template
    });
  } catch (error) {
    console.error("Erreur chargement formulaire :", error);
    res.status(500).send("Erreur serveur");
  }
}

export async function createCampaign(req, res) {
  const transaction = await sequelize.transaction();

  try {
    // Debug: Afficher les données reçues
    console.log("Données reçues:", {
      body: req.body,
      file: req.file,
      files: req.files,
    });

    // Validation des données
    if (!req.body.name || !req.body.description) {
      await transaction.rollback();
      return res.status(400).json({
        error: "Nom et description sont requis",
        received: req.body,
      });
    }

    // Vérification des arbres sélectionnés
    if (!req.body.selectedTrees) {
      await transaction.rollback();
      return res.status(400).json({
        error: "Veuillez sélectionner au moins un arbre",
      });
    }

    let selectedTrees;
    try {
      selectedTrees = JSON.parse(req.body.selectedTrees);
    } catch (e) {
      await transaction.rollback();
      return res.status(400).json({
        error: "Format des arbres invalide",
        details: e.message,
      });
    }

    // Création de la campagne
    const newCampaign = await Campaign.create(
      {
        name: req.body.name,
        description: req.body.description,
        image: req.file?.filename || null,
        userId: req.user.id,
      },
      { transaction }
    );

    // Traitement des arbres
    await processSelectedTrees(selectedTrees, newCampaign.id, transaction);

    await transaction.commit();
    return res.json({
      success: true,
      campaignId: newCampaign.id,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Erreur complète:", error);
    return res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

async function processSelectedTrees(treesData, campaignId, transaction) {
  try {
    for (const tree of treesData) {
      // 1. Vérifier le stock
      const stockTree = await StockTree.findByPk(tree.id, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!stockTree || stockTree.quantity < tree.quantity) {
        throw new Error(`Stock insuffisant pour l'arbre ID ${tree.id}`);
      }

      // 2. Créer les entrées d'arbres
      await Tree.bulkCreate(
        Array(tree.quantity)
          .fill()
          .map(() => ({
            campaignId,
            stockTreeId: tree.id,
            status: "disponible",
          })),
        { transaction }
      );

      // 3. Mettre à jour le stock
      await stockTree.decrement("quantity", {
        by: tree.quantity,
        transaction,
      });
    }
  } catch (error) {
    console.error("Erreur dans processSelectedTrees:", error);
    throw error; // Important pour remonter l'erreur
  }
}
export async function getAvailableTrees(req, res) {
  try {
    const trees = await StockTree.findAll({
      where: { quantity: { [db.Sequelize.Op.gt]: 0 } },
      attributes: ["id", "name", "price", "quantity"],
    });

    res.json(trees);
  } catch (error) {
    console.error("Erreur récupération arbres :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function getCampaignTrees(req, res) {
  try {
    const trees = await Tree.findAll({
      where: { campaignId: req.params.id },
      include: [
        {
          model: StockTree,
          as: "stocktree",
          attributes: ["id", "name", "price"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!trees.length) {
      return res.status(404).json({
        success: false,
        message: "Aucun arbre trouvé pour cette campagne",
      });
    }

    // Grouper les arbres par nom et calculer les quantités
    const groupedTrees = trees.reduce((acc, tree) => {
      const treeName = tree.stocktree?.name || "Inconnu";
      if (!acc[treeName]) {
        acc[treeName] = {
          name: treeName,
          price: tree.stocktree?.price || 0,
          quantity: 0,
          statuses: {},
        };
      }
      acc[treeName].quantity++;
      acc[treeName].statuses[tree.status] =
        (acc[treeName].statuses[tree.status] || 0) + 1;
      return acc;
    }, {});

    // Formater les données pour le frontend
    const formattedTrees = Object.values(groupedTrees).map((tree) => ({
      name: tree.name,
      price: tree.price,
      quantity: tree.quantity,
      statuses: Object.entries(tree.statuses)
        .map(([status, count]) => `${status}: ${count}`)
        .join(", "),
    }));

    res.json({
      success: true,
      data: formattedTrees,
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
