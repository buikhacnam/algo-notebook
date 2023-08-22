## Algonotebook

A notebook for quick algorithms and data structures revision.

Visit: https://algonotebook.vercel.app/dashboard

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

## Add new content (problem)

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

2. Add new problem to `config/problem.ts`.

3. Run `yarn contentlayer build` to generate the static data.

## Snippet

To generate a new problem markdown template, you can use our snippet by following steps:

1. Copy the content of `mdx-snippet.json` file in the root directory.

2. Open the command palette (Ctrl + Shift + P) and type `Configure User Snippets`.

3. Find the `mdx.json` file and paste the content of `mdx-snippet.json` file from step 1.

4. Now you can use the snippet by typing `algonotebook` and pressing `Tab` key.

## Roadmap

### Categories (problems count)

- Arrays and Hashing `(1)`
- Two Pointers `(1)`
- Sliding Window `(1)`
- Stack `(1)`
- Binary Search (0)
- Linked List `(1)`
- Trees (0)
- Tries (0)
- Heap and Priority Queue (0)
- Backtracking (0)
- Graphs (0)
- Advanced Graphs (0)
- 1-D Dynamic Programming (0)
- 2-D Dynamic Programming (0)
- Greedy (0)
- Intervals (0)
- Math and Geometry (0)
- Bit Manipulation (0)

## References

The following resources were used as reference for the content of this notebook:

- https://leetcode.com/problemset/all
- https://github.com/neetcode-gh/leetcode

## License

MIT
