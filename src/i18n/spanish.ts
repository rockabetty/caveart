import {default as comicFeature} from '../app/user_interface/comic/i18n/spanish'

const spanish = {
  translation: {
    ...comicFeature,
    "headerNavigation": {
      "myWebcomics": "Mis cómics",
      "mySubscriptions": "Suscripciones",
      "myAccount": "Perfil",
      "notifications": "Avisos"
    },
    "authenticationForm": {
      "labels" : {
        "username": "Nombre de usuario",
        "email": "Correo electrónico",
        "password": "Contraseña",
        "password2": "Verificar contraseña"
      },
      "instructions": {
        "username": "Por favor escribe un nombre de usuario",
        "email": "Por favor escribe su dirección de correo electrónico",
        "password": "Su contraseña necesita 8 caracteres o más",
      },
      "userErrorMessages": {
        "userNameTaken": "Ya hay usuario con este nombre.",
        "emailTaken": "Este correo electrónico no está disponible.",  
        "passwordTooShort": "Esta contraseña es demasiado corta.",
        "passwordsDontMatch": "Las contraseñas deben ser exactamente iguales.",
        "passwordMissing": "Por favor, introduzca una contraseña.",
        // This message is for when a user's email or password is not correct
        // It is not advised to specify which one is the case, so be vague.
        "credentialsInvalid ": "Pruebe con una contraseña diferente.",
        "generalError": "Parte de esta información no funcionará. Por favor, revise el formulario."
      },
      "buttonLabels": {
        "logIn": "Iniciar sesión",
        "signUp": "Registrarse",
        "logOut": "Cerrar sesión"
      },
      "logInSuccessful": "Ha iniciado sesión",
    }
  }
}

export default spanish;