# Git Instructions For Newbies
Caveart is meant as a learning resource for some folks I know who want to jump into coding.  Here you go, a super short git crash course for my buddies <3.

## Setting things up
1. **Go to your project folder in your terminal:** Type `cd path/to/file` in your terminal.

A terminal is  an application where you interact with your computer using typed commands, rather than a graphical interface with icons and windows, like in those movie scenes where hackers furiously type away.

* **For Windows:** Your terminal is named 'Git Bash', installed with Git. (If you haven't done this yet, please refer to the setup instructions).
* **For Mac:** Your terminal is named 'Terminal'. 

Open the correct application (Git Bash or Terminal) and you will see a text-based window ready for your commands.

To navigate to your project's folder, use the cd command, which stands for "change directory". You'd type something like cd `~/projects/caveart`.

Here, `~` denotes your home directory (think of it as a shortcut for `/Users/YourName` on Mac or `C:\Users\YourName` on Windows when using Git Bash). If, for instance, you stored the project in `C:/Users/YourName/projects/caveart`, you'd  type cd `~/projects/caveart` since `~` represents your home directory.

Feeling disoriented or just want to check your current directory's contents? Type `ls`. This command, which stands for 'list', shows you all the files and folders in your current location. You can think of `ls` as standing for 'list stuff' if it helps you remember, as in 'list the stuff that's in here'.

So, in short, navigate to where you've stored the project using the cd command in your terminal.

2. **Download the latest version:**  To fetch the latest changes from the main repository, use the command `git pull origin master`.  

If this is your first time using Git, you can safely proceed to the next step.

If you're revisiting this guide as a refresher, keep in mind that `git pull origin master` will attempt to integrate recent changes into your current working directory. This doesn't overwrite your local modifications, but if there's a discrepancy between your changes and the recent updates, Git will notify you of a 'merge conflict'. Should this happen, here are some pointers:

* 1. Either [stash](https://git-scm.com/docs/git-stash) your changes temporarily or commit them. Stashing saves your local changes temporarily so you can pull new updates without losing your work.
* 2. Switch to the master branch with git checkout master.
* 3. Try `git pull origin master` again.
Instructions for committing your changes can be found below. 

## Coding New Things
When you set out to work on a new feature or try to fix a bug, you want to follow these steps. 

If you're not a fan of the command line, check out [GitHub Desktop](https://github.com/apps/desktop).  I've never used it because I'm stuck in my ways, but it provides a user-friendly interface and might make life easier for you since UIs tend to do that.  The steps below are for the command line but they do provide steps and actions that will have a UI equivalent.

1. **Make sure you have the latest version:** Type `git pull` to download everything. 

1. **Create a new Branch:** Think of a branch as your personal workspace. It keeps your changes separate from the main project, so if something goes wrong, it won't affect everyone else's code if you upload it to the repo.
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

5. **Commit your changes:** This is like saving a checkpoint of your work. You can always look back to see what you've done.   Commit your changes often! Small, frequent commits make it easier to track your progress and troubleshoot if something breaks.

Type `git commit -m "Describe what you did briefly"`.  For example: `git commit -m "Added cool animations"`. Note the quotes are in the command.  There is actually a longer way to make more descriptive commit messages, but this is a crash course to get you started.

After you've committed, you can view the commit in the work log. Type `git log` to see the work log. Type `q` to exit the work log.

6. **Share your changes**: Ready to show off your hard work? Type `git push origin name-of-branch`, which will upload your commit!

Then in your browser, go to the git repo: https://github.com/rockabetty/caveart. You'll see a notification indicating that GitHub noticed your new changes. Click on the 'Create a pull request' button and fill in the details. This is how you propose your changes to be added to the main project. 

Once you've done all this, don't forget to ping me on Discord to check out your code! I might forget to check GitHub notifications sometimes. 
