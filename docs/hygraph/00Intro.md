---
sidebar_position: 1
---

# A GraphQL Headless CMS

- Source : [CMS explained in 5 mins](https://hygraph.com/academy/headless-cms), [Video 01](https://youtu.be/s-47dgkrQns), [Video 02](https://youtu.be/SdyK5k4HXaQ)

## Create a project

- Source : [Video](https://youtu.be/SdyK5k4HXaQ)

## Define schema

1. Create a model

2. Keep the default suggested values for **API ID** and **Plural API ID**

3. Add fields to the model created

- Hygraph handles **system fields** such as the `id`, `createdAt`, `publishedAt`, and more.

- Source : [Video 01](https://youtu.be/gDlWGrg8nxw), [Video 02](https://youtu.be/W1x2OOFt7Ro)

## Create & manage content

- text editors, workflows, advanced roles

- DRAFT : content in staging/preview

- PUBLISHED : content in production/live

- filtering, pagination, ordering

- Source : [Video](https://youtu.be/FOhtCIUgsvw)

## Programmatically deliver content

- Hygraph automatically generates GraphQL [queries](https://hygraph.com/docs/api-reference/content-api/queries#fetching-with-relay) to fetch content entries, as well as GraphQL **mutations** so you can create, update, delete, publish, and unpublish content entries.

- [API Playground](https://hygraph.com/docs/api-reference/basics/api-playground)

- Enable public access to your API : Click the **Yes, initialize defaults** button in the Content API Permissions section.

- Copy your project's content API endpoint and paste it on the URL bar of web browser.

```text title='content API endpoint'
https://api-us-east-1.hygraph.com/v2/clbq4ju4z13gl01uuf7xi0ulm/master
```

```text title='make a query'
{
  activities {
    title
    slug
    activityDate
    coverPhoto {
      url
    }
    desc {
      raw
    }
  }
}
```

```text title='content on the Published stage is shown in web browser'
{
  "data": {
    "activities": [
      {
        "title": "2022-Dec-15 Kowloon Peak | Running",
        "slug": "2022-dec-15-kowloon-peak-running",
        "activityDate": "2022-12-15",
        "coverPhoto": {
          "url": "https://media.graphassets.com/nAwIwIMnQRGvb32xhSuj"
        },
        "desc": {
          "raw": {
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "text": "天氣寒冷有毛雨。一顆 GoPro 電池可拍一小時影片。"
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}
```

```text title='mutation'
mutation {
  updateProduct(where: { id: "..." }, data: { price: 2000 }) {
    id
    name
    price
  }
}
```

- Source : [Video 01](https://youtu.be/gVMlC3_WEsA), [Video 02](https://youtu.be/KarkIAAx0s8)

## wordings

Navigate between the different sections of the project using the sidebar

After completing all necessary information, click on the Create project button to finalize the process.
