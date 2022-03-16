import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("users").insert([
        { username: "Doris Stone", avatar: "https://randomuser.me/api/portraits/women/62.jpg" },
        { username: "Brenda Cox", avatar: "https://randomuser.me/api/portraits/women/9.jpg" },
        { username: "Elva Murphy", avatar: "https://randomuser.me/api/portraits/women/50.jpg" },
        { username: "Randy Clements", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        { username: "Jody Green", avatar: "https://randomuser.me/api/portraits/men/80.jpg" },
    ]);
};
