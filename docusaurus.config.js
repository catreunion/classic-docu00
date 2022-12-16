// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

/** @type {import('@docusaurus/types').Config} */

const config = {
  // title: "Easier to learn by practice",
  // title: "Go to sleep and come back with a cup of coffee.",
  title: "Come back with a cup of coffee.",
  tagline: "A documentation by Isaac Li",
  url: "https://isaac-ds.vercel.app/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config
  organizationName: "catreunion",
  projectName: "isaac-ds",

  // for Chinese site, replace "en" with "zh-Hans"
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
          alt: "a black cat",
          src: "img/black_cat.svg"
        },
        items: [
          {
            type: "doc",
            label: "Essential Tools",
            docId: "intro",
            position: "left"
          },
          { label: "Next.js", to: "/docs/nextjs/00React", position: "left" },
          { label: "Tailwind", to: "/docs/tailwind/get-started", position: "left" },
          { label: "Hygraph", to: "/docs/hygraph/00Intro", position: "left" },
          { label: "Supabase", to: "/docs/supabase/00JWT", position: "left" },
          { label: "Blog", to: "/blog", position: "left" },
          { label: " ", to: "/", position: "left" },
          {
            label: "YouTube",
            href: "https://www.youtube.com/@catreunion/videos",
            position: "right"
          },
          {
            label: "GitHub",
            href: "https://github.com/catreunion",
            position: "right"
          }
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
                label: "Essential Tools for Coding",
                to: "/docs/intro"
              },
              {
                label: "Next.js",
                to: "/docs/nextjs/00React"
              },
              {
                label: "Tailwind CSS",
                to: "/docs/tailwind/get-started"
              },
              {
                label: "Hygraph",
                to: "/docs/hygraph/00Intro"
              },
              {
                label: "Supabase",
                to: "/docs/supabase/00JWT"
              },
              {
                label: "Blog",
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
