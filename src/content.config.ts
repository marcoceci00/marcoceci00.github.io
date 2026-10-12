// Gli articoli del blog: un file Markdown per articolo in src/content/blog.
// Lo schema controlla i dati in cima a ogni file: se ne manca uno, la build si ferma con un errore chiaro
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false), // true = visibile solo con "npm run dev", non nel sito pubblicato
  }),
});

export const collections = { blog };
