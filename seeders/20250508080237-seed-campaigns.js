import { fakerFR as faker } from "@faker-js/faker";

export async function up(queryInterface) {
  const managers = await queryInterface.sequelize.query(
    "SELECT id FROM users WHERE role = 'manager'",
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  const campaignTypes = [
    "Reforestation",
    "Urban",
    "Fruit",
    "Mangrove",
    "Protection",
  ];
  const campaigns = [];

  for (let i = 0; i < 5; i++) {
    campaigns.push({
      name: `Campagne ${campaignTypes[i]} ${faker.location.city()}`,
      description: faker.lorem.paragraph().substring(0, 255), // Limité à 255 caractères
      image: `campaign_${i + 1}.jpg`,
      userId: managers[i % managers.length].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await queryInterface.bulkInsert("campaign", campaigns, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("campaign", null, {});
}
