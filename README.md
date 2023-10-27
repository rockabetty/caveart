Caveart is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Requirements
Install node version 16.14.0 or greater. 

## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

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
