export async function up(queryInterface) {
  console.log("=== Vérification de l'intégrité des données ===");

  // 1. Vérifier les campagnes sans arbres
  const [emptyCampaigns] = await queryInterface.sequelize.query(
    `SELECT c.id, c.name FROM campaign c 
     LEFT JOIN tree t ON c.id = t."campaignId" 
     WHERE t.id IS NULL`
  );

  // 2. Vérifier la cohérence des totaux (version sécurisée)
  const [inconsistentOrders] = await queryInterface.sequelize.query(
    `SELECT o.id, o.total, SUM(ol."commandlineTotal") as calculated_total
     FROM orders o
     JOIN orderline ol ON o.id = ol."orderId"
     GROUP BY o.id
     HAVING ABS(o.total - SUM(ol."commandlineTotal")) > 0.01` // Tolérance pour les arrondis
  );

  // 3. Vérifier les stocks négatifs
  const [negativeStocks] = await queryInterface.sequelize.query(
    `SELECT id, name, quantity FROM stocktree WHERE quantity < 0`
  );

  // 4. Vérifier les statuts incohérents
  const [inconsistentStatus] = await queryInterface.sequelize.query(
    `SELECT o.id, o.paid, t.status 
     FROM orders o
     JOIN orderline ol ON o.id = ol."orderId"
     JOIN tree t ON ol."treeId" = t.id
     WHERE (o.paid = true AND t.status != 'en attente plantation')
     OR (o.paid = false AND o.status = 'completed')`
  );

  if (emptyCampaigns.length > 0) {
    console.error("⚠️ Campagnes sans arbres:", emptyCampaigns);
  }
  if (inconsistentOrders.length > 0) {
    console.error("⚠️ Commandes avec totaux incohérents:", inconsistentOrders);
  }
  if (negativeStocks.length > 0) {
    console.error("⚠️ Stocks négatifs:", negativeStocks);
  }
  if (inconsistentStatus.length > 0) {
    console.error("⚠️ Statuts incohérents:", inconsistentStatus);
  }

  if (
    emptyCampaigns.length === 0 &&
    inconsistentOrders.length === 0 &&
    negativeStocks.length === 0 &&
    inconsistentStatus.length === 0
  ) {
    console.log("✅ Toutes les vérifications ont passé avec succès");
  }
}

export async function down(queryInterface) {}
