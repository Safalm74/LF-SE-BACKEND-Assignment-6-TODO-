import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function seed(knex: Knex): Promise<void> {
  await knex.raw(`TRUNCATE TABLE ${TABLE_NAME} RESTART IDENTITY CASCADE`);
  
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          name: "admin",
          email: "admin@admin.com",
          password:
            "$2b$10$8bnVy6XkAPndk9.XZEv2qOHHpiqLKfQJVVMFkkrb0Ef96hj09qjli",
          role_id: 1,
        },
      ]);
    });
}
