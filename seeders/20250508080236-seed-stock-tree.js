import { fakerFR as faker } from "@faker-js/faker";

export async function up(queryInterface) {
  const species = [
    { name: "Chêne", basePrice: 50 },
    { name: "Sapin", basePrice: 40 },
    { name: "Érable", basePrice: 45 },
    { name: "Bouleau", basePrice: 35 },
    { name: "Pommier", basePrice: 60 },
    { name: "Cerisier", basePrice: 55 },
    { name: "Saule", basePrice: 30 },
    { name: "Cèdre", basePrice: 70 },
    { name: "Hêtre", basePrice: 40 },
    { name: "Pin", basePrice: 35 },
  ];

  const stockTrees = species.map((specie) => ({
    name: `${specie.name} ${faker.location.city()}`,
    description: faker.lorem.paragraph(),
    quantity: faker.number.int({ min: 100, max: 500 }),
    image: `tree_${specie.name.toLowerCase()}.jpg`,
    price: specie.basePrice + faker.number.int({ min: -10, max: 20 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await queryInterface.bulkInsert("stocktree", stockTrees, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("stocktree", null, {});
}
