# Overview
Caveart is an invite-only comics hosting platform that allows users to create an account, host their webcomics, and engage with other creators. The repo also is intended to serve as a learning resource for aspiring developers.

Caveart is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Directory Structure
### Notable Structural Decisions 
* **The component_library vs. user_interface**: We follow the atomic design methodology to structure our UI components. To learn more about this methodology, visit [Atomic Design By Brad Frost](https://atomicdesign.bradfrost.com). The component_library will eventually branch out into its standalone project, serving as a general-purpose component library. In contrast, user_interface is tailored specifically for our comics hosting platform, encompassing platform-specific UI elements. Think of the component_library as universal ingredients (like salt or garlic) and the user_interface as the specialized recipes you cook using those ingredients.
* **client vs. server in the auth directory:** This separation indicates the context intended for specific functions.  Some functions, such as those handling cookies, could apply to both the server and browser but interact differently in each context. Items within client are specific to React (usable in both the user_interface and pages directory), while those within server are exclusive to the server.

## Contribution Guidelines
We utilize a RESTful API and highly recommend descriptive naming for files and folders. Avoid generic names like 'misc' or 'utils' to ensure clarity. Though this README includes a brief GIT tutorial, we encourage adhering to [Git's best practices](https://www.freecodecamp.org/news/how-to-use-git-best-practices-for-beginners/#:~:text=To%20get%20the%20most%20out,pull%20requests%20for%20code%20reviews.) to maintain code clarity and project integrity! 

# First Time Set Up
## Install Git
Git is a verison control software so multiple people can work on the same thing and you can easily revert to previous saves (versions) if something goes wrong overall. Open your web browser and navigate to the Git website: https://git-scm.com/.  From there you should be able to find a download for the installer. Run the downloaded installer and follow the on-screen instructions. You do not need to turn on any special settings and can install the default settings with no issue.

## Install Node.js and NPM
Node is a server environment that you can use to make JavaScript projects. Node Package Manager is a tool to download packages of useful code other people've written so you don't have to reinvent what already exists.  

Download Node from the Node.js website: https://nodejs.org/ and download the LTS (Long Term Support) version.  Run the downloaded installer and make sure that both "Node.js runtime" and "NPM package manager" options are selected during installation.

## Install NVM
Node Version Manager maintains what version of Node you have, to make sure your version stays up to date and/or you have the version of Node compatible with the coding project you're working on. 

For Windows: https://github.com/coreybutler/nvm-windows/releases
For Mac: https://github.com/nvm-sh/nvm

This way, if you ever run into an error that talks about Node versions you can use NVM to pick the right version. 

For this repo, if you type `node -v` and see a number that is '16.14.0' or higher, you are good to go.

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
Type `npm run dev` into your terminal, and the application should start up smoothly!

# Git Instructions For Newbies
If you're new to Git, you're in the right place. Let's break it down! 

## Setting things up
1. **Go to your project folder in your terminal:** Type `cd path/to/file` in your terminal.

Not sure what a terminal is? Think of those movie scenes where hackers furiously type with green or white text on a black background. That's the gist of how a terminal looks. It's an application where you interact with your computer using typed commands, rather than a graphical interface with icons and windows.

* **For Windows:** Your terminal is named 'Git Bash', installed with Git. (If you haven't done this yet, please refer to the setup instructions).
* **For Mac:** Your terminal is named 'Terminal'. 

Open the correct application (Git Bash or Terminal) and you will see a text-based window ready for your commands.

To navigate to your project's folder, use the cd command, which stands for "change directory". You'd type something like cd `~/projects/caveart`.

Here, `~` denotes your home directory (think of it as a shortcut for `/Users/YourName` on Mac or `C:\Users\YourName` on Windows when using Git Bash). If, for instance, you stored the project in `C:/Users/YourName/projects/caveart`, you'd  type cd `~/projects/caveart` since `~` represents your home directory.

Feeling disoriented or just want to check your current directory's contents? Type `ls`. This command, which stands for 'list', shows you all the files and folders in your current location. You can think of `ls` as standing for 'list stuff' if it helps you remember, as in 'list the stuff that's in here'.

So, in short, navigate to where you've stored the project using the cd command in your terminal.

2. **Download the latest version:**  To fetch the latest changes from the main repository, use the command `git pull origin master`.  

If this is your first time using Git, you can safely proceed to the next step.

If you're revisiting this guide as a refresher, keep in mind that git pull origin master will attempt to integrate recent changes into your current working directory. This doesn't overwrite your local modifications, but if there's a discrepancy between your changes and the recent updates, Git will notify you of a 'merge conflict'. Should this happen, here are some pointers:
* 1. Either [stash](https://git-scm.com/docs/git-stash) your changes temporarily or commit them 
* 2. Switch to the master branch with git checkout master.
* 3. Try `git pull origin master` again.
Instructions for committing your changes can be found below.

3. **Create a new Branch:** Think of a branch as your personal workspace. It's a copy of the code where you can make changes without affecting the main version. 
Type `git checkout -b name-of-branch` into your terminal.

3. **Work on your project:** Get your website up and running with `npm run dev` and the  website will launch  at localhost:3000. Anytime you make and save changes, they'll appear immediately. This setup (reloading when the system detects changes) is called 'hot loading.'

4. **Save your changes:**
See what you've changed with `git status`. This command lists the files that have been modified. From this list, decide which files on that list you want to save (or "commit"), and then "stage" them. Staging is the word for preparing a file for a final save.

* To stage a file: `git add name/of/file`.  
* If you mistakenly changed a file: Unstage it with  `git reset name/of/file`.
* If you want to discard changes you made: `git restore name/of/file`.

The difference between 'reset' and 'restore' is important. 

* **Reset** tells git to temporarily set aside changes to a file without discarding them. The file remains changed in your working directory, but it's no longer staged for a commit.
* **Restore** reverts a file to its state before you made changes, effectively undoing any edits.

5. **Commit your changes:** This is like saving a checkpoint of your work. You can always look back to see what you've done.

Type `git commit -m "Describe what you did briefly"`.  For example: `git commit -m "Added cool animations"`. Note the quotes are in the command.

After you've committed, you can view the commit in the work log. Type `git log` to see the work log. Type `q` to exit the work log.

6. **Share your changes**: Ready to show off your hard work? Type `git push origin name-of-branch`, which will upload your commit!

Then in your browser, go to the git repo: https://github.com/rockabetty/caveart. You'll see a notification indicating that GitHub noticed your new changes. Click on the 'Create a pull request' button and fill in the details. This is how you propose your changes to be added to the main project. 

Once you've done all this, don't forget to ping me on Discord to check out your code! I might forget to check GitHub notifications sometimes. 