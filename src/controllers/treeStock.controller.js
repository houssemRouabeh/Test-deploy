import db from "../../models/index.js";
const { StockTree } = db;

export const getTreeStockPage = async (req, res) => {
  try {
    const stockTrees = await StockTree.findAll({
      order: [["createdAt", "DESC"]],
    });

    return { stockTrees };
  } catch (error) {
    console.error("Erreur lors du chargement du stock d'arbres :", error);
    res.status(500).send("Erreur serveur");
  }
};

export const createTree = async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    const image = req.file?.filename || null;

    if (!name || isNaN(quantity) || isNaN(price)) {
      req.flash("error", "Données invalides");
      return res.redirect("/admin/dashboard/stock-tree");
    }

    // Vérifier si l'arbre existe déjà
    const existingTree = await StockTree.findOne({ where: { name } });
    if (existingTree) {
      req.flash("error", "Un arbre avec ce nom existe déjà");
      return res.redirect("/admin/dashboard/stock-tree");
    }

    await StockTree.create({
      name,
      description,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
      image,
    });

    req.flash("success", "Arbre ajouté avec succès");
    res.redirect("/admin/dashboard/stock-tree");
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'arbre :", error);
    req.flash("error", "Erreur lors de la création");
    res.redirect("/admin/dashboard/stock-tree");
  }
};

export const updateTree = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price } = req.body;
    const image = req.file?.filename || null;

    if (!name || isNaN(quantity) || isNaN(price)) {
      req.flash("error", "Données invalides");
      return res.redirect("/admin/dashboard/stock-tree");
    }

    const tree = await StockTree.findByPk(id);
    if (!tree) {
      req.flash("error", "Arbre non trouvé");
      return res.redirect("/admin/dashboard/stock-tree");
    }

    // Vérifier si le nouveau nom existe déjà pour un autre arbre
    if (name !== tree.name) {
      const existingTree = await StockTree.findOne({
        where: { name },
        where: { id: { [db.Sequelize.Op.ne]: id } },
      });
      if (existingTree) {
        req.flash("error", "Un arbre avec ce nom existe déjà");
        return res.redirect("/admin/dashboard/stock-tree");
      }
    }

    tree.name = name;
    tree.description = description;
    tree.quantity = parseInt(quantity, 10);
    tree.price = parseFloat(price);

    if (image) {
      tree.image = image;
    }

    await tree.save();
    req.flash("success", "Arbre mis à jour avec succès");
    res.redirect("/admin/dashboard/stock-tree");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'arbre :", error);
    req.flash("error", "Erreur lors de la modification");
    res.redirect("/admin/dashboard/stock-tree");
  }
};
