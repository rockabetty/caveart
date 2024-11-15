# Caveart Comics

A web platform for hosting and reading comics, built with Next.js and PostgreSQL.

## TOC 

- [Overview](#overview)
- [Features](#features)
- [How To Contribute](#contributing)
- [Design](#design)
- [Documentation](#documentation)

## Overview
Caveart is an invite-only comics hosting platform that allows users to create an account, host their webcomics, and engage with other creators. The repo also is intended to serve as a learning resource for aspiring developers.

Caveart is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) because I'm lame and didn't realize Vite existed at the time.  Anyway, the backend uses PostgreSQL and raw SQL queries, no Prisma, no Sequelize, in preference of keeping it simple and fast. 

## Features

### Available Now
- **User Accounts:** Sign up, log in, and log out, with comic ownership (you can C.R.U.D. your own comics)
- **Comic Profiles:** Comics have editable descriptions, genres (e.g. sci-fi), content warnings (e.g. violence).
- **Comic Pages:** Basic support for uploading comic pages.
- **Internationalization:** Initial support for multiple languages using `react-i18next`.  Actual translations not yet provided, only English. MURCA. 

### Planned Features

- **User Account Management:** Users can manage their profiles with customizable avatars and other profile information. 
- **Comic Chapters and Pages:** Creators can organize their comics into chapters and edit and delete existing pages.
- **Comments:** If allowed in a comic's profile settings, users can send comments and reply to comments, which themselves may be moderated by the comic owner. 
- **Comic Search:** Users can search for comics by typing in whatever they're interested in and receive results whose relevance is determined by tags, comic profile info, and author comments. 
- **Content Warnings, Ratings System:**  Comics which are rated 18+ require sign-in and age verification to read; content warnings display themselves before reading a comic if any such are present, such as gore/violence.

## Contributing

You're welcome to contribute. Hell, I would prefer it so I don't have to code everything.  Check out the issues tracker and grab something. 

- [First-Time Setup](#setup)
- [Design Principles](#design)
- [Documentation](#documentation)

### Setup
Advanced users may find the following instructions sufficient, but if you're a total newbie, check out the documentation folder and read 'SETUP.md'. 

- Pre-requisites: git, Node.js (16.14.0 or higher), NPM, a PostgreSQL database (ideally with pgAdmin 4, Stack Builder, and Command Line Utilities). 
- Schema files are currently disparate and in each domain folder (see `/server/domains` and you will see schema files) as a singular script for installing the database does not yet exist.  The order should be first the schema file for `users`, then `comics`, then `comicpages`.
- Don't forget to check out `.env.example` and copy over the variables into your own .env while providing appropriate data.
- Type `npm run dev` to start the server.
- Type `npm run storybook` to start the Storybook instance.

### Design
We're using domain driven design and attempting to be as framework agnostic as possible without over-engineering just for the sake of agnosticism.

### Directory Structure
Here’s a brief overview of the key folders:
```
├── component_library/ # UI components which will be later turned into a standalone npm package
├── src/ # The actual web application
│ ├── documentation/ # Guess. No, go on, guess
│ ├── app/ # Client-side code (React components, hooks) 
│ │ ├── services/ # Client-side services (like the image uploader which hits up S3) 
│ │ ├── themes/ # A bunch of CSS files that make the website yoru custom shade of purty
│ │ ├── user_interface/ # Molecules & custom react hooks specific to Caveart 
│ │ │ ├── comic/ # UI for Caveart's "comic" feature (CRUD functionality UI) for profiles, pages
│ │ │ ├── users/ # UI for Caveart's user management (e.g. login, password reset)
│ │ │ ├── navigation/ # Components specific to, well, navigation - site footers, headers, nav bars
│ ├── i18n/ # Translation "tables" (JSON objects, really)
│ ├── pages/ # NextJS tomfoolery for actual website pages and client-side routing 
│ │ ├── api/ # NextJS tomfoolery for API route creation
│ │ ├── comic/ # App web pages for viewing a specific comic
│ │ ├── comics/ # App web pages for managing/viewing multiple comics
│ ├── server/ # Backend code (API routes, services)
│ │ ├── domains/ # Backend logic where handlers, server-side logic, etc. lives
│ │ │ ├── comicpages/ # Representing a physical singular comic book page
│ │ │ ├── comics/ # Representing a comic series with reference to its chapters, pages
│ │ │ ├── users/ # Representing user accounts and authorization
│ │ ├── services/ # Server-side logic not belonging exclusively to one domain, e.g. encryption
│ │ ├── sql-helpers/ # Helper functions for query building 
```
#### Atomic Design
We follow the atomic design methodology to structure our UI components. To learn more about this methodology, visit [Atomic Design By Brad Frost](https://atomicdesign.bradfrost.com). 

#### API naming strategy
We utilize a RESTful API and highly recommend descriptive naming for files and folders. Avoid generic names like 'misc' or 'utils' to ensure clarity. Check out [Git's best practices](https://www.freecodecamp.org/news/how-to-use-git-best-practices-for-beginners/#:~:text=To%20get%20the%20most%20out,pull%20requests%20for%20code%20reviews.).

- **Use sub-paths** for significantly different response formats:
  - `/api/content`: Returns nested content warning definitions.
  - `/api/content/flat`: Returns a flat list of content warnings for simpler processing.

- **Use query parameters** for minor variations in the response:
  - `/api/ratings?key=name`: Returns ratings with names as keys.
  - `/api/ratings?key=id`: Returns ratings with IDs as keys.

#### Notable Details 
* **The component_library vs. user_interface**: The component_library will eventually branch out into its standalone project, serving as a general-purpose component library, which is why you see it in a sister directory.  In contrast, user_interface is tailored specifically for our comics hosting platform, encompassing platform-specific UI elements.
* **Domain-Driven Design:** Caveart is built on Domain-Driven Design (DDD) principles so that it's not married to Next.js forever, basically. NextJS is cool but as a free spritid girlie I want this website to be as easy to maintain as it grows as I can and I don't want to be locked into a specific framework forever. 

## Documentation
In general, function definitions should have JSDocs style documentation in the actual files that define them.  More complex concepts may also have long form commentary within the files that define the subject matter discussed therein.   Setup instructions, high level info, and other such stuff that involves sharing rationale and design decisions and so forth goes into the `src/documentation` folder.
