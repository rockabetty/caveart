const english = {
  translation: {
    "authenticationForm": {
      "labels" : {
        "username": "Username",
        "email": "Email",
        "password": "Password",
        "password2": "Verify password"
      },
      "instructions": {
        "username": "Please enter a username",
        "email": "Please enter a valid email address",
        "password": "Pick a password with at least 8 characters",
      },
      "userErrorMessages": {
        "userNameTaken": "Please pick a different username",
        "emailTaken": "Please pick a different email address",  
        "passwordTooShort": "This password is not long enough",
        "passwordsDontMatch": "Passwords do not match",
        // This message is for when a user's email or password is not correct
        // It is not advised to specify which one is the case, so be vague.
        "badLoginInfo": "Can't log in with these credentials"
      },
      "buttonLabels": {
        "logIn": "Log in",
        "signUp": "Sign up",  
        "logOut": "Log out"
      },
      "logInSuccessful": "You are successfully logged in",
      "signUpSuccessful": "You are signed up",
      "enterSite": "Into the cave!"
    }
  }
};

export default english;