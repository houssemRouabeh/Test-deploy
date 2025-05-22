import db from "../../models/index.js";
const { Order, OrderLine, User, Tree, Campaign, StockTree } = db;

export const listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: [
        "id",
        "userId",
        "orderDate",
        "status",
        "total",
        "paid",
        "createdAt",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const orderlines = await OrderLine.findAll({
      attributes: [
        "id",
        "orderId",
        "treeId",
        "quantity",
        "commandlineTotal",
        "createdAt",
      ],
      include: [
        {
          model: Tree,
          as: "tree",
          attributes: ["status"],
          include: [
            {
              model: Campaign,
              as: "campaign",
              attributes: ["name"],
            },
            {
              model: StockTree,
              as: "stocktree", // 👈 Assure-toi que l’alias est bien défini dans le modèle
              attributes: ["name", "price", "image", "description"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return { orderlines, orders };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes ou lignes de commande:",
      error
    );
    res.status(500).send("Erreur du serveur");
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    await OrderLine.destroy({ where: { orderId } });
    const deleted = await Order.destroy({ where: { id: orderId } });

    if (deleted) {
      res.redirect("/admin/orders");
    } else {
      res.status(404).send("Commande non trouvée");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande :", error);
    res.status(500).send("Erreur du serveur");
  }
};
