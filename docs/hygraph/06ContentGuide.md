---
sidebar_position: 7
---

# Customizing content dashboard

### Configuring columns

1. Click the Configure Columns button

2. Select which columns you like to show in Dashboard

3. Rearrange the columns

### Searching for content

- Narrow down the search by selecting a field in the Filter bar.

- Don't support searching rich text and JSON fields.

- Don't support references (content relations), multi-value fields, colors and coordinates.

```text
{
  posts(where: { _search: "Test" }) {
    id
  }
}
```

...

### Using filters

- Is exact

- Is not | null

- Is not

- Does not | contain string

- Does not | start with starting string

- Does not | end with ending string

- Less | greater than number, date and dateTime

- Less | greater than or equal to number, date and dateTime

[YouTube](https://hygraph.com/docs/guides/content/using-filters)

...

### Working with content views

Content Views are divided into default views and custom views.

[Video 01](https://youtu.be/zluFSbLhtes), [Video 02](https://youtu.be/M1kRQfa6OfQ),

When making changes to the content view, by configuring columns, or adding filters (as shown below), these can be saved as the default view for all users of the project.

Default views are also reflected inside of connection models when linking other content models.

### Update a default view

The default content views are the system views which list all content entries that have been created based on the respective content models. Custom content views are filtered for specific content entries.

After you customize your content dashboard using the three features mentioned above, you can save these customizations using the Content View. This can be a helpful way of organizing your content and making it easier to find.

For example, as a content editor if you are only editing Blog posts written by Annie, you can create a content view called “Annie’s Blog Posts.” This will give you quicker access and let you avoid scrolling through content to find what you are looking for.

### Create a custom view

1. Navigate to the content for one of your models.

2. Create a change to the view by either filtering the content in the search bar at the top, or showing/hiding the columns.

3. At the top of the content window, press "Create Content View".

4. Provide a name and description and press Create.

Create a custom view group
Create a custom view group

### Edit a custom view

1. Navigate to a custom view in the contextual sidebar of the content tab.

2. Next to the title of the content view, press the three disclosure dots and choose "Edit Content View".

3. Apply your changes and press save.

### Delete a custom view

Navigate to a custom view in the contextual sidebar of the content tab.
Next to the title of the content view, press the three disclosure dots and choose "Delete Content View".
Confirm you want to delete.

### Organising custom views

Hover your mouse next to a custom view.
Grab the six-dot handle to the left of the label.
Change the order of where view groups appear.
View groups

...

[Working with content views](https://hygraph.com/docs/guides/content/content-views), [YouTube](https://youtu.be/zluFSbLhtes)
