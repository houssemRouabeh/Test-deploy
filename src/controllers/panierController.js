import db from "../../models/index.js";
const { Tree } = db;
export const confirmOrder = async (req, res) => {
  // 1. Vérification de l'authentification (normalement géré par jwtAuth middleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentification requise",
      redirectTo: "/login",
    });
  }

  const userId = req.user.id;
  const { reservations } = req.body;

  // 2. Validation des données
  if (
    !reservations ||
    !Array.isArray(reservations) ||
    reservations.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Le panier est vide ou les données sont invalides",
    });
  }

  // 3. Traitement transactionnel
  const t = await db.sequelize.transaction(); // Début de transaction

  try {
    const results = [];

    for (const item of reservations) {
      // 4. Validation de chaque item
      if (
        !item.treeId ||
        !item.campaignId ||
        !item.quantity ||
        item.quantity < 1
      ) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Données invalides pour l'article ${item.treeName || ""}`,
        });
      }

      // 5. Vérification du stock
      const availableTrees = await Tree.findAll({
        where: {
          stockTreeId: item.treeId,
          campaignId: item.campaignId,
          userId: null,
          status: "disponible",
        },
        limit: item.quantity,
        transaction: t,
        lock: t.LOCK.UPDATE, // Verrouillage pour éviter les conflits
      });

      if (availableTrees.length < item.quantity) {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: `Stock insuffisant pour ${item.treeName || "cet arbre"} (${
            availableTrees.length
          } disponible(s))`,
        });
      }

      // 6. Mise à jour des arbres
      const updateResult = await Promise.all(
        availableTrees.map((tree) =>
          tree.update(
            {
              userId,
              status: "réservé",
              dateOfPurchase: new Date(),
            },
            { transaction: t }
          )
        )
      );

      results.push({
        treeId: item.treeId,
        updatedCount: updateResult.length,
        campaignId: item.campaignId,
      });
    }

    // 7. Validation finale
    await t.commit();

    return res.json({
      success: true,
      message: `${reservations.length} réservation(s) confirmée(s)`,
      details: results,
    });
  } catch (error) {
    // 8. Gestion des erreurs
    await t.rollback();

    console.error("Erreur de confirmation:", {
      error: error.message,
      userId,
      reservations,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la confirmation de la commande",
      technical:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
