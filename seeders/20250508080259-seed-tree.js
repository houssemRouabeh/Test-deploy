import { fakerFR as faker } from "@faker-js/faker";

export async function up(queryInterface) {
  const campaigns = await queryInterface.sequelize.query(
    "SELECT id FROM campaign",
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const stockTrees = await queryInterface.sequelize.query(
    "SELECT id, name FROM stocktree",
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const trees = [];

  for (const campaign of campaigns) {
    // Sélectionne 2 espèces aléatoires par campagne
    const selectedSpecies = faker.helpers.arrayElements(
      stockTrees.filter(
        (st) => st.name.includes("Chêne") || st.name.includes("Sapin")
      ),
      2
    );

    for (const specie of selectedSpecies) {
      const quantity = specie.name.includes("Chêne") ? 20 : 30;

      for (let i = 0; i < quantity; i++) {
        trees.push({
          campaignId: campaign.id,
          stockTreeId: specie.id,
          status: "disponible",
          plantingDate: faker.date.future({ years: 1 }),
          gpsCoordinates: `${faker.location.latitude()}, ${faker.location.longitude()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await queryInterface.sequelize.query(
        `UPDATE stocktree SET quantity = quantity - ${quantity} 
         WHERE id = ${specie.id}`
      );
    }
  }

  await queryInterface.bulkInsert("tree", trees, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("tree", null, {});
}
