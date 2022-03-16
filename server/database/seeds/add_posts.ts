import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("posts").insert([
        {
            title: "Quartz Movement: What Is a Quartz Watch, and How Does It Work?",
            content: "",
            slug: "quartz-movement-what-is-a-quartz-watch-and-how-does-it-work"
        },
        {
            title: "What Are Watch Movements and How to Choose the Best One",
            content: "",
            slug: "what-are-watch-movements-and-how-to-choose-the-best-one"
        },
        {
            title: "What Is an Automatic Watch, and How Do They Work?",
            content: "",
            slug: "what-is-an-automatic-watch-and-how-do-they-work"
        },
    ]);
};
