import bcrypt from "bcrypt";
import { fakerFR as faker } from "@faker-js/faker";

export async function up(queryInterface, Sequelize) {
  const roles = [
    { type: "user", count: 15 },
    { type: "manager", count: 5 },
    { type: "admin", count: 3 },
    { type: "partner", count: 2 },
  ];

  const users = [];
  let roleIndex = 0;
  let countInRole = 0;

  for (let i = 1; i <= 25; i++) {
    const currentRole = roles[roleIndex];
    const password = await bcrypt.hash("password123", 10);

    users.push({
      email: `${currentRole.type}${countInRole + 1}@example.com`,
      password,
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      telephone: faker.phone.number("06########"),
      birthday: faker.date.birthdate({ min: 18, max: 90, mode: "age" }),
      locality: faker.location.city(),
      avatar: `avatar${Math.floor(Math.random() * 10) + 1}.jpg`,
      role: currentRole.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    countInRole++;
    if (countInRole >= currentRole.count) {
      roleIndex++;
      countInRole = 0;
    }
  }

  await queryInterface.bulkInsert("users", users, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("users", null, {});
}
