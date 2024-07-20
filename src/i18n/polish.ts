import {default as comicFeature} from '../app/user_interface/comic/i18n/polish'

const polish = {
  translation: {
    ...comicFeature,
    "headerNavigation": {
      "myAccount": "Mój Profil",
      "myWebcomics": "Moje Komiksy",
      "mySubscriptions": "Moje Czytelnicze",
      "notifications": "Powiadomienia"
    },
    "authenticationForm": {
      "labels" : {
        "username": "Nazwa użytkownika",
        "email": "Email",
        "password": "Hasło",
        "password2": "Potwierdź hasło"
      },
      "instructions": {
        "username": "Podaj nazwę użytkownika",
        "email": "Podaj prawidłowy adres e-mail",
        "password": "Ustaw hasło zawierające minimum 8 znaków",
      },
      "userErrorMessages": {
        "userNameTaken": "Wybierz inną nazwę użytkownika.",
        "emailTaken": "Wybierz inny adres e-mail.",  
        "passwordTooShort": "To hasło jest zbyt krótkie.",
        "passwordMissing": "Proszę wprowadzić hasło.",
        "passwordsDontMatch": "Hasła nie pokrywają się.",
        // This message is for when a user's email or password is not correct
        // It is not advised to specify which one is the case, so be vague.
        "credentialsInvalid": "Spróbuj innego hasła.",
        "generalError": "Niektóre z tych informacji są niepoprawne. Proszę sprawdzić formularz."
      },
      "buttonLabels": {
        "logIn": "Zaloguj",
        "signUp": "Utwórz konto",
        "logOut": "Wyloguj"
      },
      "logInSuccessful": "Zalogowano pomyślnie",
      "signUpSuccessful": "Utworzono konto",
      "enterSite": "Wejdź do jaskini!"
    }
  }
}

export default polish