# First Time Set Up
This first-time setup file presumes that you are a newborn plopped in the woods with nothing but a pocket full of dreams (and maybe a latop).  If you're a long standing member of the nerd herd, then go see the README.md for a bumper sticker version. If something breaks, come back here for all the deets.

## Install Git
Git is a verison control software so multiple people can work on the same thing and you can easily revert to previous saves (versions) if something goes wrong overall. 

Open your web browser and navigate to the Git website: https://git-scm.com/.  From there you should be able to find a download for the installer. Run the downloaded installer and follow the on-screen instructions. You do not need to turn on any special settings and can install the default settings with no issue.

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

Leave that in. Now, look at the `src/server/sql-helpers` folder.  If you see a file named `load_schema` up in there, congratulations! You’re in luck. Run that script and move onto configuring the Next.js application (the next step). If not, uh, well, I'm working on it, and in the meantime you'll need to load each schema manually:

1. Go to the server/domains/ folder.
2. For each domain folder (e.g., users, comics, comicpages):
- Open the schema.sql file.
- Copy its contents.
- In pgAdmin, click on Tools > Query Tool, paste the contents, and run the query.
3. Repeat this for each schema file.

## AWS
Time to do the most tedious part. 

First, go to [Amazon Web Services](https://aws.amazon.com/) and sign into your AWS console and/or make you a new account.  You might need a credit card, I don't know, I haven't set one up in a billion years.  However, just because you need an AWS account does not mean that you will have to spend money to develop for Caveart.  Their services have free tiers, and the free tier will be more than enough, so just stick with the free tiers if you're asked.

Now you want to create an S3 Bucket. AWS's interface is inscrutable and frustrating, but there should be some kind of services dropdown menu in the top navigation bar, and you want to click on S3, then create a bucket. 

Fill out the form, select a region close to you, uncheck "block all public access" unless you know better (but let's live dangerously for speed and ease), then hit the permissions tab (or section, I don't know, AWS's UI is a DPH trip) and then edit the bucket policy.

There should be a text editor you can drop this into: 

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::replace-me-with-your-bucket-name/*"
    }
  ]
}
```

In case you didn't see it, replace "replace-me-with-your-bucket-name".

Okay. You're not done.  Now you get to go to IAM (Identity and Access Management) in the AWS Console. Don't bother hunting for it in the UI — just type “IAM” in the search bar at the top, and click on "Identity And Access Management" from there.

- Click "Users" and then "Add user".
- Enter a username (e.g., caveart-dev), and select "Programmatic access".
- Click "Next" and attach the policy "AmazonS3FullAccess". 

IAM is going to complain at you that you shouldn't do this despite the fact that they explicitly code in a UI option to let you do exactly this. Ignore it.  It's fine.  Setting up IAM roles and temporary credentials is overkill for local dev. 

Click through the next steps and then download your Access Key ID and Secret Access Key.  You're going to use these keys in the .env file, which is covered in the next step. 

## Configure the Next.js Application
Within the root of the project folder, you'll find ".env.example". This file provides an example of what environment variables (configurations, settings) that Caveart needs to run.  In order to tell your local version of Caveart what your postgres password is, make a file called `.env` (with the dot!) and copy the contents of `.env.example` into it.   You'll need to replace the example values, so now let's walk through doing that.

### Encryption and Security Settings
* **ENCRYPTION_KEY_32_BYTE:** Literally just bang on your keyboard until it's 32 characters long.  We're not training for the Olympics here, this is local dev. If you want extra credit, you installed Node, so take it for a spin by opening up Terminal/git Bash/command Prompt and type in `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))`.  
* **SECRET_KEY_JWT:** This is another opportunity to bash the keyboard because this is local dev. 
* **EMAIL_SALT:** Again, smack that keyboard.

Obviously in a production environment you shouldn't just like, ... write your favorite song lyrics into your email salt or whatever, but, you know, this is a readme for a learning resource about coding in general and if you truly do need these instructions then your computer is hardly a high security operation now is it?

### Database Configuration
- **PG_USERNAME**: The username for your PostgreSQL database. If you used the default setup then it's "postgres". 
- **PG_PASSWORD:** The password you set for the PostgreSQL user during installation. If you didn't set one then leave the variable in there but leave it blank, like, `PG_PASSWORD=`.
- **PG_DATABASE:** Keep it as 'caveart'  unless you named it something else when you made it. 
- **PG_HOST:** For local development. Leave it as 'localhost'. The only reason it wouldn't be 'localhost' is if you had a bizarre spasm of ambition and complicated the dev setup in a way not described in this guide. 
- **SALT_ROUNDS_PASSWORD:** The number of rounds for password hashing. Just leave it at 10, again, it's local dev, who cares? Someone far more principled than you or I. 

### Environment Configuration
Leave **NEXT_PUBLIC_NODE_ENV** as-is ("development").  When th is app runs in production it gets changed, but the copy that lives on your computer is a development environment. 

### Email Configuration
These variables are for sending emails for stuff like password resets.

- **EMAIL_SERVER:**  The SMTP server for sending emails. If you're using Gmail, leave this as smtp.gmail.com. For other email providers, you may need to change this (e.g., smtp.mail.yahoo.com).
- **EMAIL_USER**=your_email@gmail.com 
- **EMAIL_PASSWORD** The password to the email you just gave.
- **SUPPORT_EMAIL_ADDRESS:** Whatever it is in the env.example should be left as-is.

### Authentication Configuration
- **USER_AUTH_TOKEN_NAME:** This is the name of the cookie that stores the user's authentication token. You can name it something fun but descriptive (e.g., caveart_auth_token).
- **NEXT_PUBLIC_USER_AUTH_TOKEN_NAME:** This is the same as USER_AUTH_TOKEN_NAME, but it's exposed to the frontend. Make sure they match.

### AWS S3 Configuration
If you're one of my personal buddies then you know how to contact me for the info. If you're a stranger, you're going to need to brave AWS, boo, and hiss.  Follow the steps in [Setting Up AWS](#AWS)

- **AWS_REGION:** The region where your S3 bucket is located (e.g., us-east-1). If you don’t know, check the S3 dashboard in AWS.
- **AWS_S3_BUCKET_USA:** The name of your S3 bucket. The variable is called AWS_S3_BUCKET_USA because of an abstract plan to expand to different buckets in different parts of the world, but there's only one bucket for now.
- **AWS_S3_ACCESS_KEY_ID:** The Access Key ID for your AWS user. You can generate this in the AWS Management Console under IAM > Users > Security credentials.
- **AWS_S3_SECRET_ACCESS_KEY:** The Secret Access Key for your AWS user. Keep it secret, keep it safe.

# Running The Application
Type `npm run dev` into your terminal, and the application should start up smoothly!