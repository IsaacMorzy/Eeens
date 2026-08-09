import type { Collection } from "tinacms";

export const GlobalConfigCollection: Collection = {
  name: "config",
  label: "Global Config",
  path: "src/content/config",
  format: "json",
  ui: {
    global: true,
  },
  fields: [
    {
      name: "seo",
      label: "Site Identity & SEO",
      description:
        "Site-wide identity. These values appear on every page. The Site Name is shown in the header navigation and used as the default browser title; the Description is the default for search results and social shares. The Email and Office fields are the single source of truth for contact links and appointment requests.",
      type: "object",
      fields: [
        {
          name: "title",
          label: "Site Name",
          type: "string",
          required: true,
          description:
            "Shown in the header navigation on every page. Lives in Global Config because it is the same site-wide. Each page sets its own browser title through the Meta Title field.",
        },
        {
          name: "description",
          label: "Default Meta Description (SEO)",
          type: "string",
          required: true,
          description:
            "Default description shown in search results and social-sharing previews when a page does not provide its own.",
        },
        {
          name: "siteOwner",
          label: "Site Owner (shown in footer)",
          required: true,
          type: "string",
          description: "Your name or company name. Displayed in the site footer.",
          ui: {
            defaultValue: "Eens Limited"
          },
        },
        {
          name: 'logo',
          label: 'Logo',
          type: 'image',
          description: 'Shown next to the Site Name in the header navigation.',
        },
        {
          name: 'email',
          label: 'Email (single source of truth)',
          type: 'string',
          required: true,
          description: "Primary inbox used by viewing requests, document requests, and fallback contact copy.",
          ui: {
            defaultValue: 'hello@eens.co.ke'
          }
        },
        {
          name: 'office',
          label: 'Office address (single source of truth)',
          type: 'string',
          required: true,
          description: "Operator office location. Referenced in the footer + about page contact section.",
          ui: {
            defaultValue: 'Mlolongo, Mombasa Road, KM 14'
          }
        }
        //Add more site settings here...
      ],
    },
    {
      name: "nav",
      label: "Navigation Menu",
      description:
        "Short header links for the Eens Business Park site. Keep each link tied to a live route or real contact action.",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item.title
          };
        },
      },
      fields: [
        {
          name: "title",
          label: "Link Label",
          description: "The short label shown in the header, such as Listings or Leasing.",
          type: "string",
          required: true
        },
        {
          name: "link",
          label: "Link URL",
          description: "A live internal route or a real contact URL. Keep this aligned with the public Eens Business Park sitemap.",
          type: "string",
          required: true

        }
      ]
    },
    {
      name: "contactLinks",
      label: "Contact Links",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item.title
          }
        },
      },
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string"
        },
        {
          name: "link",
          label: "Link",
          type: "string"
        },
        {
          name: "icon",
          label: "Icon",
          description: "Any Tabler icon name, e.g. tabler:brand-x, tabler:book-2, tabler:brand-github. Browse at https://icones.js.org/collection/tabler",
          type: "string"
        }
      ],
    },
    // Add other config fields here...
  ]
}
