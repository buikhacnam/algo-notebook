## Algonotebook

A notebook for quick algorithms and data structures revision.

Visit: https://algonotebook.vercel.app/dashboard

The project also powers the [Leetcode Assistant Chrome Extension](https://chrome.google.com/webstore/detail/leetcode-assistant/nbeehcepchjjlajedbfbjcfdmgcoioja).

## Features

- Quickly browse algorithms and data structures by category.
- Take notes with fully fledged markdown editor and save them to your account.
- Update problem status or save them to favorite list to keep track of your progress.
- Solution includes most of the main programming languages.
- Dark mode support.

## Technologies

- Next.js 13 using /app directory and server components
- Authentication with NextAuth.js
- MySQL database using Prisma ORM
- Tailwind CSS and Shadcn UI for styling and components
- Static data generation with Contentlayer and MDX
- Markdown editor with Editor.js

## Pre-requisites

- Node.js
- Yarn
- MySQL database

## Run locally

1. Clone the repository
2. Install dependencies.

```sh
yarn install
```

3. Copy content of `.env.example` file to `.env.local` and fill the environment variables.

4. Generate content to static data (optional):

```sh
yarn contentlayer build
```

5. Run the development server:

```sh
yarn dev
```

## Add new content

Run the following script to add new content:

```sh
yarn leetcode [leetcode link / problem slug] [category]
```

For example:

```sh
yarn leetcode https://leetcode.com/problems/reverse-linked-list/ linked-list
```

or

```sh
yarn leetcode reverse-linked-list linked-list
```

This will create a new markdown file in the `content/problems/[category]` folder.

Now you can visit `http://localhost:3000/problems/[category]/[problem-slug]` to see the new problem.

For example: https://algonotebook.vercel.app/problems/linked-list/reverse-linked-list

## Add new content manually

1. In folder `content/problems` there are folders for each category. Inside each category folder there are markdown files for each problem. To add a new problem, create a new markdown file (named as the problem separated by `dashes` and with the extension `.mdx`)
   inside the category folder and add the following frontmatter, for example:

   ```mdx
   ---
    title: Reverse Linked List
    category: Linked List
    difficulty: Easy
   ---
   ```

   Or you can use our [snippet](#snippet) to generate the markdown template.

2. Run `yarn contentlayer build` to generate the static data.

## Snippet

To generate a new problem markdown template, you can use our snippet by following steps:

1. Copy the content of `mdx-snippet.json` file in the root directory.

2. Open the command palette (Ctrl + Shift + P) and type `Configure User Snippets`.

3. Find the `mdx.json` file and paste the content of `mdx-snippet.json` file from step 1.

4. Now you can use the snippet by typing `algonotebook` and pressing `Tab` key.

## Roadmap

### Categories (problems count)

- Arrays and Hashing `(8)`
- Two Pointers `(3)`
- Sliding Window `(4)`
- Stack `(1)`
- Binary Search `(2)`
- Linked List `(6)`
- Trees `(11)`
- Tries `(3)`
- Heap and Priority Queue `(1)`
- Backtracking `(2)`
- Graphs `(6)`
- Advanced Graphs `(1)`
- 1-D Dynamic Programming `(10)`
- 2-D Dynamic Programming `(2)`
- Greedy `(2)`
- Intervals `(5)`
- Math and Geometry `(3)`
- Bit Manipulation `(5)`

## References

The following resources were used as reference for the content of this notebook:

- https://leetcode.com/problemset/all
- https://github.com/neetcode-gh/leetcode

## License

MIT
