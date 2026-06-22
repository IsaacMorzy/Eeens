import { defineConfig } from "tinacms";
import { BlogCollection } from "./collections/blog";
import { GlobalConfigCollection } from "./collections/global-config";
import { PageCollection } from "./collections/page";
import { PropertyCollection } from "./collections/property";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // Search-index token consumed by `tinacms build:search`. Tina's
  // zod schema for `search.tina` rejects unknown keys, so do NOT
  // re-add `clientId` here even though it looks redundant with the
  // top-level `clientId` — a prior attempt to add it produced a
  // `ZodError: unrecognized_keys` failure on the live Vercel deploy.
  // The top-level `clientId` covers auth; `indexerToken` is all that's
  // required under `search.tina`.
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
    },
  },
  // Schema registry: properties are loaded alongside pages, blog, and
  // global-config so the editor toolbar surfaces every collection at the
  // same priority.
  schema: {
    collections: [
      BlogCollection,
      PageCollection,
      PropertyCollection,
      GlobalConfigCollection,
    ],
  },
});
