---
sidebar_position: 3
---

# CMS explained in 5 mins

[source](https://hygraph.com/academy/headless-cms)

A backend-only content management system, making content accessible via an API for display on any device, without a built-in front-end or presentation layer.

What is a Headless CMS (Headless Content Management System)
Table of contents
Key Takeaways
Why Headless CMS?
Headless CMS vs. Traditional CMS
What is Managed Content as a Service (MCaaS)?
What is API-First Content Management?
Why use a Headless CMS and do you need one?

Deliver content as data to any platform or device via API, rather than having it tightly coupled to a specific website or mobile app.

In practice, this means that teams are able to use a single content repository, or CMS, to deliver content from a single source to endless frontend platforms via API, such as websites, mobile apps, TVs, etc.

Makes content accessible to any platform via an API

A Headless CMS enables teams to deliver omnichannel experiences at scale, globally, without restrictions like templates, devices, or pre-defined technologies.

Headless CMS provides better ROI since they are cloud-based, security and backups are handled by the vendor, and they are easily scalable all while reducing time-to-market when delivering projects.

A Headless CMS is a type of content management system where the content repository, referred to as the “body”, is separated or decoupled from the "head", i.e. the presentation layer or the frontend. The term "headless" arises from decoupling the backend, or the "body", from the frontend, or the "head". The intended consumption of this content is by devices in a raw structured format, such as HTML or JSON, and isn't meant for human consumption until rendered on the end device.

To elaborate, a Headless CMS is, at its core, a content repository that makes content accessible via an API to any platform. The term "Headless" comes from the concept of detaching the "Head," i.e. the front end (Website, App, etc.), from the "body," i.e. the back end (content repository, database, etc.). Instead of delivering compiled HTML, a headless CMS only delivers the content by means of an API. An API driven approach offers many advantages over traditional CMS paradigms.

By removing the presentation layer, or the head, from the CMS, there are theoretically no restrictions on how and where content can be delivered. Marketing and editorial teams can create content within the editor interface of a Headless CMS (similar to how they would with WordPress or Joomla) should there be one, and the engineering team can define how and where this content is delivered. A common misconception is that a Headless CMS follows the path of more traditional CMS like WordPress, where "content" is restricted to a landing page or a blog post. The reality is more flexible with the limitations of what "content" is, which can include anything from blog posts and landing pages to banners, alerts, flight inventory, news feeds, etc. Similarly, there are no restrictions on platforms where this content is delivered, which can extend from websites and mobile apps to watches, dishwashers, fridges, etc.

While the idea of a Headless CMS has been around for a while, they have only recently become the popular approach to handling content due to the spreading diversity of platforms that need content, the improved developer experience, and overall faster app load times. The headless approach to content management allows for your teams to publish content faster and iterate their digital presence with greater efficiency, making content delivery flexible via APIs rather than web page rendering.

There are many terms thrown around to describe what a Headless CMS is - commonly ranging between Content Hubs, Content Infrastructure, and Managed Content as a Service - all of which are valid since Headless CMS essentially offers a repository for storing content that's ready to be delivered somewhere.

To better understand the value proposition of a Headless CMS, it's important to visualize how content is delivered in this case, and what the advantages of using an API-first approach are.

Headless CMS vs. Traditional CMS
Traditional CMS vs Headless CMS.png

Traditional CMS keep teams highly dependent on a vendor's preferred frameworks, databases, and technologies - whilst only being able to render on one frontend, i.e. a single website or a single mobile app. In the long term, once overheads like training, maintenance, and security updates are accounted for, the ROI of traditional CMS begins to come into question, and teams are left with unmanageable content silos across several CMS and services.

In contrast, a Headless CMS houses all the content that teams need to produce for all digital entities - text, images, videos, files, etc. - that are stored as structured content within the CMS. Development teams are able to query this content via API, whilst working with modern and preferred technologies, and distribute them to any digital frontend from a single source. In the long run, the ROI of this approach leads to a more scalable architecture and removes content silos.

Traditionally, a CMS is a software used to manage content across websites, a popular option being WordPress, which we'll use as an example to illustrate the differences. They have graphical user interfaces (GUIs) that allow content creators to simply create content and publish them to styled "templates", choosing from endless themes and plugins. The content created is stored within a database, and displayed to the end-user or reader based on this pre-defined template.

Everything is packaged together, and the architecture of the CMS causes heavy codependency between the front end and the back end. For example, when downloading WordPress, what you're actually getting out of the box and building upon is:

A predefined theme (like Twenty Nineteen by WordPress) with HTML, CSS, and Javascript.
An optional further customization of that theme with a page builder like Elementor or WPBakery.
A predefined MySQL database with a predefined schema, changes to which require manually modifying the database itself.
PHP that powers the usability of your site and links your theme to the database, constantly pulling entries (posts, media, etc.) from the database into your front end where the placement is defined by the theme.
Further enrichments and customization via plugins.
To visualize this content, the raw data for a blog post is pulled from the MySQL database by Wordpress's PHP application and pushed to the theme. The theme then converts the content into HTML and styles is based on the theme's CSS to let the reader consume it.

Managing, creating, publishing, and designing your content is therefore completely within WordPress itself, where content is stored in the database and pulled whenever the site needs to be rendered for a new reader.

On the flip side, a Headless CMS completely defies this logic by fragmenting the flow and decoupling the front end from the back end, keeping its focus on the content creation and storage, with little to no control on the front end rendition.

In this scenario, a typical setup might look something like this:

You create your content based on self-defined schemas in a Headless CMS like Hygraph.
You connect your API endpoint from Hygraph to your website through a data-fetching library like Axios or even the native Fetch methods supported across server and browser environments.
You query your content to your website, app, or another platform with GraphQL in the case of Hygraph.
You render the returned data in a way that makes sense for your application.
Therefore, when creating content in a Headless CMS, like Hygraph, you're simply focusing on the content itself, and not the layout or design. This is then delivered anywhere through the API, so a developer and a content creator can define how and where the content shows - regardless of the platform, design, style, or format.

What is Managed Content as a Service (MCaaS)?
Content as a Service is essentially the evolution of how content is managed, stored, and delivered. It is a service-oriented model where the "Service Provider" delivers the content on-demand to the "Service Consumer" via licensed cloud-based subscription services.

With the traditional CMS, the content had the option of being stored physically on a local, dedicated, or shared server, as well as in the cloud. Furthermore, security upgrades and database backups would be the responsibility of the entities to maintain their CMS. With the emergence of global distribution, Content Delivery Networks (CDN), and caching, cloud-based solutions are preferred for security, reliability, and speed.

A Headless CMS fundamentally offers content "as a service", allowing content to be created and stored within the CMS, and then channeled to any platform via APIs. Since it isn't dictating the content to be "for human consumption" directly, it allows a way to provide raw content to other systems that further refine the content to be rendered on the end platform. This way, your content is always hosted in a centralized "content repository" on the cloud - allowing you to create, manage, and edit your content whenever you wish, and accordingly distribute it to any systems and channels as and when required.

To learn more about Content as a Service, refer to our Academy article covering this concept in depth.

What is API-First Content Management?
What is API Content Management.png

Simply put, an API-First CMS is a Headless CMS. The concept it's built upon is the maintenance of content within a content repository where APIs (like REST and GraphQL) distribute the content to multiple front ends based on how they request what content.

An API-First CMS allows brands and companies to reach out to consumers on any device, which is especially important with the emergence of IoT and smart products - that have drastically transformed the way in which consumers interact and engage with brands. Traditional CMS like WordPress would make it near impossible to natively power voice assistants when used as a CMS for Alexa or Google Home since traditional platforms are not built to deliver experiences to these kinds of devices.

A Headless CMS, however, is.

In the case of voice assistants, brands can just create content using a CMS for voice and deliver structured data as answers to voice commands, responses to questions, or as snippets for feeds.

On a higher and more pragmatic level, this also gives organizations the freedom to dictate their MarTech stack and define their own digital experiences. Legacy CMS would have teams fall prey to a vendor lock-in since the CMS would dictate the authoring experience, the visualization of the content, and the interdependence of its own plugin ecosystem, whereas a Headless CMS gives brands the flexibility to freely integrate their preferred tools, software, and analytics to create their own digital experience platforms.

Why use a Headless CMS and do you need one?
Traditional CMS has the benefit of comfort - since we're all familiar with them. A CMS like WordPress is often a default solution when you want a simple website, don't have technical resources to create a custom experience, and are ok with working on templates that resemble generic websites.

However, for organizations that depend on delivering cross-platform experiences across multiple channels, especially on a global scale, a Headless CMS grows in importance. Since you have complete control over how and where content is delivered, a Headless CMS is usually a preferred option for forward-thinking teams, especially in fast-paced industries.

Because a Headless CMS doesn't restrict you to a specific technology (PHP and MySQL in the case of WordPress), you and your team are free to build projects with preferred options like having a CMS for React, Angular, Vue, and so on.

If you don't want to be restricted to a specific tech stack, don't want to be constricted to pre-defined templates and themes, and need added functionality that lets you push content to multiple platforms, then investing in a Headless CMS would be worth looking into.

You may not need a Headless CMS if:
Your content doesn't need to be updated often.
Your team doesn't have sufficient development resources internally.
Speed and scalability are not important factors for your projects.
You should use a Headless CMS if:
You have a diverse set of platforms and need a central content hub to pull the data from.
You have front-end development resources available.
You want to use your preferred languages and frameworks.
You want to deliver projects on JAMStack principles and remain agile in your processes.
A unique design is needed to display your content.
Your project is multi-device and multilingual.
Content is regularly added or updated.
Benefits of Headless CMS

1. Front end freedom
   Bring content to any platform (native apps, VR, IoT, etc). Hygraph allows you to develop with any technology for any platform making your product scalable when your users need you to be.

2. Well structured data
   Working with clearly defined data allows for your development team to know where to pick up, instantly. Hygraph content infrastructure clearly defines the operations (queries, and mutations) supported by the API.

3. Future-proof content
   A headless CMS allows for your content to be modified immediately and as-needed by your content creators. Minimize the impact of redesigns, product changes, and migrations with a decoupled content solution.

4. Security and Scalability
   With one point of connection, your headless CMS allows for only one access point of vulnerability. Hygraph offers many robust features for protecting your endpoint including permanent auth tokens, DDOS mitigation strategies, and more.

5. Team flexibility
   You want to hire the most talented developers possible. No need to teach a prehistoric web template language just to manage your content. Work with any modern language stack your team pleases.

6. Consolidated content repository
   It's counterintuitive to copy, paste & recreate content for your app across different platforms! Consolidating all of your content within one API minimizes your overhead cost, time, and development resources.

To get started with using Hygraph as your Headless CMS, sign up for a free-forever developer account, or reach out to our team to discuss custom needs for your scaling business goals.

Frequently Asked Questions
What is a Headless CMS?
A headless CMS is a content management system that provides a way to create, edit, and deliver content to one or several frontends. Instead of having your content tightly coupled to a particular frontend (like a website or mobile app), it provides your content as data over an API to be served to any frontend.

What is a Headless Website?
A headless website is one built using a Headless CMS, where the content is served via API from a content backend, rather than from a classical “Web CMS”. The same content can be distributed to multiple websites, apps, and other digital platforms when needed.

How do you use a Headless CMS?
To use a headless CMS, you have to build a website or an application first, then use the CMS's API to query and serve your content into it. This is in contrast to “creating your content on the website” as in the case of page builders and classic Web CMS.

Should I use a Headless CMS?
If you are creating a simple corporate website or portfolio, perhaps not. If you have development resources and are building multiple or complex websites, applications, and other digital products, then it may be worth exploring Headless CMS. The same applies to whether you require stronger flexibility and performance with your digital projects.

What does Headless mean?
Headless means that the application is running without a graphical user interface (GUI) and sometimes without a user interface at all. The frontend (head) is detached from the backend (body), allowing both to be developed independently.

What are some other terms for Headless CMS?
Headless CMS may commonly be referred to as Content Database, Content Backend, Content Repository, or Content API. It is essentially a backend-only content management system that acts as a content repository, and makes content accessible via an API for display on any device, without controlling the presentation layer(s).
