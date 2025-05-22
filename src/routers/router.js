import express from "express";
import { login, logout, registerUser } from "../controllers/auth.controller.js";
import { jwtAuth } from "../middleware/auth.js";
import {
  createUser,
  deleteUserById,
  listUsers,
  updateUser,
} from "../controllers/users.controller.js";
import isAdmin from "../middleware/isAdmin.js";
import isUser from "../middleware/isUser.js";
import isManager from "../middleware/isManager.js";
import isPartner from "../middleware/isPartner.js";
import { updateProfile } from "../controllers/profileController.js";
import { deleteOrder, listOrders } from "../controllers/orders.controller.js";
import {
  createCampaign,
  getAvailableTrees,
  getCampaignManagementPage,
  getCampaignTrees,
  showCreateCampaignForm,
} from "../controllers/campaignController.js";
import upload from "../middleware/upload.js";
import {
  updateTree,
  createTree,
  getTreeStockPage,
} from "../controllers/treeStock.controller.js";
import db from "../../models/index.js";
import {
  getCampaignsForTree,
  getCatalogue,
  reserveTrees,
} from "../controllers/catalogueController.js";
import { confirmOrder } from "../controllers/panierController.js";

const { User, Tree, StockTree } = db;
const router = express.Router();

// ==============================================
// ROUTES PUBLIQUES (accessibles sans authentification)
// ==============================================

// Pages statiques
router.get("/", (req, res) => res.render("index"));

router.get("/campagnes", (req, res) => res.render("campagnes"));
router.get("/apropos", (req, res) => res.render("apropos"));

// Authentification
router.get("/login", (req, res) => {
  res.render("./auth/login", {
    messages: req.flash(),
    formData: {},
    fieldErrors: {},
  });
});
router.post("/login", login);

router.get("/register", (req, res) => {
  res.render("./auth/register", {
    errors: [],
    success: "",
  });
});
router.post("/register", registerUser);

router.get("/catalogue", getCatalogue);
router.get("/campaigns/:stockTreeId", getCampaignsForTree);
router.post("/reserve-trees", reserveTrees);

router.get("/panier", (req, res) => {
  res.render("panier");
});

router.post("/confirm-order", jwtAuth, express.json(), confirmOrder);
router.get("/api/me", jwtAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "firstname", "avatar", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (err) {
    console.error("Erreur dans /api/me :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// ==============================================
// ROUTES UTILISATEUR (jwtAuth + isUser)
// ==============================================

router.get("/user/dashboard", jwtAuth, isUser, (req, res) => {
  if (!req.user) return res.redirect("/login");
  res.render("./user/dashboard", {
    currentPage: "myTrees",
    user: { id: req.user.id, user: req.user },
  });
});

router.get("/user/dashboard/profile", jwtAuth, (req, res) => {
  const userData = req.user;
  res.render("user/dashboard", { currentPage: "profile", user: userData });
});

router.get("/user/dashboard/sell-history", jwtAuth, isUser, (req, res) => {
  res.render("user/dashboard", {
    currentPage: "sellHistory",
    user: { id: req.user.id, user: req.user },
  });
});

router.get("/user/dashboard/campaigns", jwtAuth, isUser, (req, res) => {
  res.render("user/dashboard", {
    currentPage: "campaigns",
    user: { id: req.user.id, user: req.user },
  });
});

router.post("/user/profile/update", jwtAuth, updateProfile);
router.post("/logout", jwtAuth, logout);

// ==============================================
// ROUTES PARTENAIRE (jwtAuth + isPartner)
// ==============================================

router.get("/partner", jwtAuth, isPartner, (req, res) => {
  res.render("./profile/partner");
});

// ==============================================
// ROUTES CHEF DE PROJET (jwtAuth + isChef)
// ==============================================

router.get("/manager/dashboard", jwtAuth, isManager, async (req, res) => {
  const campagnes = await getCampaignManagementPage(req, res);
  res.render("project-manager/dashboard", {
    currentPage: "campaign-management",
    user: req.user,
    campagnes,
  });
});

router.get(
  "/manager/dashboard/gestion-campagnes/create",
  jwtAuth,
  isManager,

  (req, res) => {
    showCreateCampaignForm(req, res);
  }
);
router.post(
  "/manager/campaigns/create",
  jwtAuth,
  isManager,
  upload.single("image"),
  (req, res) => {
    createCampaign(req, res);
  }
);
router.get("/api/trees/available", (req, res) => {
  getAvailableTrees(req, res);
});
router.get("/manager/dashboard/profile", jwtAuth, isManager, (req, res) => {
  const userData = req.user.get({ plain: true });
  res.render("project-manager/dashboard", {
    currentPage: "profile",
    user: userData,
  });
});

router.get("/gestion-campagnes", getCampaignManagementPage);
router.get("/gestion-campagnes/create", showCreateCampaignForm);
router.post("/create-campaign", upload.single("image"), createCampaign);
router.get("/api/campaigns/:id/trees", jwtAuth, isManager, getCampaignTrees);

// ==============================================
// ROUTES ADMIN (jwtAuth + isAdmin)
// ==============================================

// Gestion des utilisateurs
router.get("/list-users", jwtAuth, isAdmin, listUsers);
router.post("/create-new-account", createUser);
router.post("/admin/users/update", updateUser);
router.post("/admin/users/:id/delete", deleteUserById);

// Dashboard admin
router.get("/admin/dashboard", jwtAuth, isAdmin, async (req, res) => {
  try {
    const users = await listUsers();
    res.render("../views/admin/dashboard", {
      currentPage: "accounts-management",
      user: req.user,
      users: users,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return res.status(500).send("Erreur du serveur");
  }
});

router.get("/admin/dashboard/profile", jwtAuth, isAdmin, (req, res) => {
  const userData = req.user; // 👈 pas besoin de .get()
  console.log(userData);
  res.render("admin/dashboard", { currentPage: "profile", user: userData });
});

// Gestion des commandes
router.get("/admin/dashboard/orders", jwtAuth, isAdmin, async (req, res) => {
  const data = await listOrders();
  res.render("admin/dashboard", {
    currentPage: "orders-management",
    orders: data.orders,
    orderlines: data.orderlines,
  });
});
router.get("/admin-orders-management", listOrders);
router.post("/delete-order", deleteOrder);

// Gestion du stock
router.get(
  "/admin/dashboard/stock-tree",
  jwtAuth,
  isAdmin,
  async (req, res) => {
    const data = await getTreeStockPage();
    res.render("admin/dashboard", {
      currentPage: "stock-management",
      stockTrees: data.stockTrees,
    });
  }
);
router.post("/create-tree", upload.single("image"), createTree);
router.post("/update-tree/:id", upload.single("image"), updateTree);

router.get("*", (req, res) => {
  res.status(404).render("404", {
    title: "Page non trouvée",
    message: "Désolé, la page que vous recherchez n'existe pas.",
  });
});

router.get("500", (req, res) => {
  res.status(500).render("500", {
    title: "Erreur interne du serveur",
    message: "Désolé, une erreur est survenue sur le serveur.",
  });
});

export default router;
