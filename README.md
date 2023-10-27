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
