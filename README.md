Caveart is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Instructions For Friendos: First Time Set Up
## Install Git
Git is a verison control software so multiple people can work on the same thing and you can easily revert to previous saves (versions) if something goes wrong overall. Open your web browser and navigate to the Git website: https://git-scm.com/.  From there you should be able to find a download for the installer. Run the downloaded installer and follow the on-screen instructions! You do not need to turn on any special settings and can install the default settings with no issue.

## Install Node.js and NPM
Node is a server environment that you can use to make JavaScript projects. Node Package Manager is a tool to download packages of useful code other people've written so you don't have to reinvent what already exists.  

Download Node from the Node.js website: https://nodejs.org/ and download the LTS (Long Term Support) version.  Run the downloaded installer and make sure that both "Node.js runtime" and "NPM package manager" options are selected during installation.

## Install NVM
Node Version Manager maintains what version of Node you have, to make sure your version stays up to date and/or you have the version of Node compatible with the coding project you're working on. 

For Windows: https://github.com/coreybutler/nvm-windows/releases
For Mac: https://github.com/nvm-sh/nvm

This way, if you ever run into an error that talks about Node versions you can use NVM to pick the right version. 

For this repo, if you type `node -v` and see a number higher than '16.14.0' you should be good to go.

## Get the Github repo!
Determine where you want the project to be located on your computer.  Right-click inside that location and select "Git Bash Here" from the context menu. In the opened terminal, type:
`git clone https://github.com/rockabetty/caveart.git`

## Install dependencies
Go to the folder you downloaded Caveart into and type `npm install`.  This is going to download a bunch of ancillary code that is needed for Caveart to work. 

## Set Up the PostgreSQL Database
PostgreSQL is a type of database language and you need to download it to make Caveart work since that's where the data for comics, etc. lives.  Go to https://www.postgresql.org/download and download the latest stable version for your computer. 

When you go through the intsaller, you want to check that PostgreSQL Server, pgAdmin 4, Stack Builder, and Command Line Utilities are selected to be installed.  Leave the default port number and locale if you are not familiar with PostgreSQL.  You're going to be asked to set and remember the password for the "postgres" user. This is your admin account or 'superuser' account so don't forget it!

The server provides the space for the data to live and be manipulated.  PgAdmin 4 is a graphical interface to manage and manipulate the PostgreSQL database. Stack Builder is a graphical tool that makes it easier to download and install additional tools that can enhance the PostgreSQL experience.  Command Line Utilities is a series of scripts that lets you control Postgres from your terminal.

Open pgAdmin. The first time you open it, you'll be prompted to enter the password for the "postgres" user. Once logged in, you'll see the "Servers" tab on the left side. Expanding it will show the PostgreSQL server.  You're going to want to right click on 'Database' in the left hand side, then 'Create', then make a database named 'caveart'.

When you do that, you will see a menu called "create database" with tabs.  In the general tab, name the database 'caveart'.  Then click on the last tab, 'SQL'. You should see 'CREATE DATABASE caveart...' 

Leave that in, but paste the contents of `core_schema.sql` (which you will find in `src/data`) after it. It should look like this: 

```
CREATE DATABASE caveart
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

CREATE TYPE user_role AS ENUM ('Member', 'Creator', 'Moderator');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  ...
```

## Configure the Next.js Application
Within the root of the project folder, you'll find ".env.example". This file provides an example of what environment variables (configurations, settings) that Caveart needs to run.  In order to tell your local version of Caveart what your postgres password is, make a file called `.env` (with the dot!) and put the following line in there: 

PG_PASSWORD=your_password

You can also just paste the entire .env.example in there and change up the numbers.

# Running The Application
Type `npm run dev` and the application should run!

# General Notes On How Stuff Works
## Component Library vs User Interface
If you look at the file structure you'll notice `component_library` but also `src/app/user_interface`.  The difference is whether a visual element is an independent, reusable component like a button or a form field or whatever.  Independent, standalone items you could use on any website go in 'component_library' and are used as lego bricks to build the user interface for the website.  Pieces of the UI that are specific to Caveart itself are built with components from the library, so you'll see stuff like `SiteHeader` in caveart's `user_interface` folder because it's specific to Caveart, and you'll see it uses buttons, etc. from the `component_library`.  Thinkk of `component_library` as a community pantry of ingredients and `user_interface` as meals and recipes created with them to be specifically served at your table!

## Variable Colors
If you make new UI parts for Caveart, such as components for the library, please refer to the existing components for examples of how to color them. They aren't hard-coded values like "#FF0000" but variables like "var(--color-text)" and "var(--color-border)". This is so that we can make it a lot easier for users to make alterations on their website. If you hard code in a value by using colors directly then that component's look will not be as easily customizable. 

The component_library will later be extracted to its own standalone thing to facilitate the creation of other projects and apps but lives in Caveart right now for sake of speedy development.

If you want to edit how Caveart proper looks when building the site, the CSS for that is in `src/app/brand.css`.  You'll see a bunch of 'theme' variable names, which are gradient color ramps that present 10 shades of a color from light to dark.  You can change those values and watch the website's colors change!  The guts that make this work are found in `component_library/design/style.css`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# Git Instructions For My Flying Monke Babbies 
To make a new thing what you do is you cut a branch which is you create a version of the code with a name, and git takes care of the version making for you. You just have to tell git about this new branch you want.  So you do this: 

Get the latest updates so you are up to date:
`git pull origin master`

Make a new branch:
`git checkout -b name-of-branch`

Get the website running:
`npm run dev` 

The website should run and tell you where to go to find it (localhost:3000).  It's set up to auto-restart when you save changes (this is called hot loading), so you should see your updates basically immediately. 

When you're happy with the changes and you want to save them:

`git status` will show you all the files it has detected changes for.
`git add name-of-thing` will let you mark certain files for saving to the main version.  

Added the wrong thing? 
`git reset name-of-thing`

Made changes you saved and you are like, "noooo I need the original back but I don't want to leave this branch"? 
`git restore name-of-thing`.  That will get rid of your changes and restore it to the last save point (which is a 'commit').

They are not saved yet, they're just marked for saving (something that is marked for saving is 'staged'). It's a little extra layer of redundancy because the next thing you do, which is to commit to your changes, is not exactly permanent but it is a sort of like, "OK git, I'm very sure this is what I want to add in now" and undoing it is a minor hassle.   So staging changes helps you from saving a file before it's actually ready by accident.

Next, to do the actual saving, you commit the changes:
`git commit -m "brief commentary explaining what you did"`
e.g. `git commit -m "wrote sick new CSS that adds dancing babies"`

Note the quotes are in the command.

There are more 'refined' ways to make commits but for the purposes of a tutorial for babby's first commit `git commit -m "short message here"` will do!

Once that commit is saved, you can type `git log` and see it in the history of the code!  If you do that from the terminal, you exit out of the log with 'q'.  Otherwise you can use the up and down arrows to read therough the log.

Then, you can upload it to the repository to submit your changes to the project:
`git push origin name-of-branch`

Then in your browser, go to the git repo: https://github.com/rockabetty/caveart 

You'll see a little notification that shows Github has received your latest changes.   There'll be a button that says something like 'create a pull request' or 'PR'.  Click that button, then fill out the form, submit it. 

This creates a draft for review and then you go HEY CHECK OUT MY SICK NEW CODE and ping me on discord because I absolutely will forget to check this github account's notifications. 
