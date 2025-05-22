import { fakerFR as faker } from "@faker-js/faker";

export async function up(queryInterface) {
  const users = await queryInterface.sequelize.query(
    "SELECT id FROM users WHERE role = 'user'",
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  // Création de 15 commandes
  for (let i = 0; i < 15; i++) {
    const user = users[i % users.length];
    const orderStatus = faker.helpers.arrayElement([
      "pending",
      "paid",
      "completed",
    ]);
    const isPaid = orderStatus !== "pending";

    // Création de la commande
    const [order] = await queryInterface.bulkInsert(
      "orders",
      [
        {
          userId: user.id,
          orderDate: faker.date.recent({ days: 30 }),
          status: orderStatus,
          total: 0,
          paid: isPaid,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    // Sélection d'arbres disponibles
    const treesToOrder = await queryInterface.sequelize.query(
      `SELECT t.id, s.price 
       FROM tree t
       JOIN stocktree s ON t."stockTreeId" = s.id
       WHERE t.status = 'disponible'
       LIMIT ${faker.number.int({ min: 1, max: 3 })}`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Création des orderlines
    let orderTotal = 0;
    const orderLines = treesToOrder.map((tree) => {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const lineTotal = tree.price * quantity;
      orderTotal += lineTotal;

      return {
        orderId: order.id,
        treeId: tree.id,
        quantity,
        commandlineTotal: lineTotal,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("orderline", orderLines);

    // Mise à jour du total de la commande
    await queryInterface.sequelize.query(
      `UPDATE orders SET total = ${orderTotal} WHERE id = ${order.id}`
    );

    // Mise à jour du statut des arbres ET de l'utilisateur (version corrigée)
    const newStatus = isPaid ? "en attente plantation" : "réservé";
    await queryInterface.sequelize.query(
      `UPDATE "tree" 
       SET status = '${newStatus}', 
           "userId" = ${user.id}
       WHERE id IN (${treesToOrder.map((t) => t.id).join(",")})`
    );
  }
}

export async function down(queryInterface) {
  await queryInterface.sequelize.query(
    `UPDATE "tree" 
     SET status = 'disponible', 
         "userId" = NULL 
     WHERE status IN ('réservé', 'en attente plantation')`
  );
  await queryInterface.bulkDelete("orderline", null, {});
  await queryInterface.bulkDelete("orders", null, {});
}
