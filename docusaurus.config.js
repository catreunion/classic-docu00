// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Easier to learn by practice",
  tagline: "A documentation by Isaac Li",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"]
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js")
          // editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/"
        },
        blog: {
          showReadingTime: true
          // editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "",
        logo: {
          alt: "Logo of Docusaurus",
          src: "img/black_cat.svg"
        },
        items: [
          {
            type: "doc",
            label: "Coding",
            docId: "intro",
            position: "left"
          },
          { label: "Next.js", to: "/docs/nextjs/00get-started", position: "left" },
          { label: "Tailwind", to: "/docs/tailwind/00get-started", position: "left" },
          { label: "Supabase", to: "/docs/supabase/get-started", position: "left" },
          { label: "My Blog", to: "/blog", position: "left" },
          { label: " ", to: "/", position: "left" }
          // {
          //   label: "YouTube",
          //   href: "https://www.youtube.com/@catreunion/videos",
          //   position: "right"
          // },
          // {
          //   label: "GitHub",
          //   href: "https://github.com/catreunion",
          //   position: "right"
          // }
        ]
      },
      footer: {
        style: "dark",
        links: [
          // to
          {
            title: "Site Navigation",
            items: [
              {
                label: "Coding",
                to: "/docs/intro"
              },
              {
                label: "Next.js",
                to: "/docs/intro"
              },
              {
                label: "Tailwind",
                to: "/docs/tailwind/00get-started"
              },
              {
                label: "Supabase",
                to: "/docs/supabase/get-started"
              },
              {
                label: "Outdoor Activities",
                to: "/blog"
              }
            ]
          },
          // href
          {
            title: "About me",
            items: [
              {
                label: "YouTube",
                href: "https://www.youtube.com/@catreunion/videos"
              },
              {
                label: "GitHub",
                href: "https://github.com/facebook/docusaurus"
              },
              {
                label: "Facebook",
                href: "https://www.facebook.com/catreunion2/"
              },
              {
                label: "Twitter",
                href: "https://twitter.com/catreunion2"
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Isaac Li Computer Services, Inc.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
}

module.exports = config
