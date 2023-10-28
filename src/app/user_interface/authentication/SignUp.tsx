import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TextInput, Button } from '../../../../component_library';


const SignUp: React.FC<AuthProps> = () => {
  const { t } = useTranslation();
  
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerification, setPasswordVerification] = useState<string>("");

  const [nameState, setNameState] = useState<"default"|"error"|"valid">('default');
  const [emailState, setEmailState] = useState<"default"|"error"|"valid">('default');
  const [passwordState, setPasswordState] = useState<"default"|"error"|"valid">('default');
  const [passwordVerificationState, setPasswordVerificationState] = useState<"default"|"error"|"valid">('default');

  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");

  const isEmailValid = (email: string) => /^([\w.%+-]+)@([\w-]+).([\w]{2,})$/i.test(email);

  const onInputName = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setName(e.target.value)
  }

  const onInputEmail = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setEmail(e.target.value)
  }

  const onInputPassword = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPassword(e.target.value)
  }

  const onInputPasswordVerification = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPasswordVerification(e.target.value)
  }

  const validateName = () => {
    const isValid = name.length > 0;
    setNameState(isValid ? 'default' : 'error');
    setNameError(isValid ? '' : t('authenticationForm.instructions.username'));
  };

  const validateEmail = () => {
    const isValid = isEmailValid(email);
    setEmailState(isValid ? 'default' : 'error');
    setEmailError(isValid ? '' : t('authenticationForm.instructions.email'));
  };

  const validatePassword = () => {
    const isValid = password.length > 7;
    setPasswordState(isValid ? 'default' : 'error');
  };

  const validatePasswordVerification = () => {
    const isValid = password === passwordVerification;
    setPasswordVerificationState(isValid ? 'default' : 'error');
  };

  const validateSignup = () => {
    validateName();
    validateEmail();
    validatePassword();
    validatePasswordVerification();
  };

  const handleSignup = () => {
    validateSignup();
 
    if (isEmailValid(email) && name.length > 0 && password.length > 7 && password === passwordVerification) {
      axios.post('/api/auth/signup', { name, email, password })
        .then((res) => {
          setName("");
          setEmail("");
          setPassword("");
          onSignup(res.data);
        })
        .catch((err) => {
          console.log(err);
          const {detail} = err?.response?.data;
          if (detail && detail.includes("name")) {
            setNameError(t('authenticationForm.userErrorMessages.userNameTaken'));
            setNameState('error')
          }
          if (detail && detail.includes("email")) {
            setEmailError(t('authenticationForm.userErrorMessages.emailTaken'));
            setEmailState('error')
          }
          // setServerError(err.response.data);
        });
    }
  };

  return (
    <div>
      <form noValidate>
        <fieldset>
          <TextInput
            labelText={t('authenticationForm.labels.username')}
            id="signup_name"
            onChange={(e) => {onInputName(e)}}
            status={nameState}
            type="text"
            placeholderText="Captain Caveman"
            errorText={nameError}
            value={name}
          />
          <TextInput
            labelText={t('authenticationForm.labels.email')}
            id="signup_email"
            onChange={(e) => {onInputEmail(e)}}
            status={emailState}
            placeholderText="unga@bunga.com"
            type="email"
            errorText={emailError}
            value={email}
          />
          <TextInput
            labelText={t('authenticationForm.labels.password')}
            helperText={t('authenticationForm.instructions.password')}
            value={password}
            placeholderText=""
            errorText={t('authenticationForm.userErrorMessages.passwordTooShort')}
            status={passwordState}
            id="signup_password"
            onChange={(e) => {onInputPassword(e)}}
            type="password"
          />
          <TextInput
            labelText={t('authenticationForm.labels.password2')}
            errorText={t('authenticationForm.userErrorMessages.passwordsDontMatch')}
            value={passwordVerification}
            placeholderText=""
            status={passwordVerificationState}
            id="signup_password_verification"
            onChange={(e) => {onInputPasswordVerification(e)}}
            type="password"
          />
        </fieldset>
        { serverError && <span className="form_server-message Error">{serverError}</span> }
        <Button id="authenticate_signup" type="button" onClick={handleSignup} look="primary">
          {t('authenticationForm.buttonLabels.signUp')}
        </Button>
      </form>
    </div>
  );
};

export default SignUp;