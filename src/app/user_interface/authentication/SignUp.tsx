import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TextInput, Button } from '../../../../component_library';
import { useUser } from '../../../auth/client/hooks/useUser';
import { ActionType } from '../../../auth/types/user.d.ts';
import { ErrorKeys } from '../../../auth/types/errors';

const SignUp: React.FC<AuthProps> = () => {
  const { t } = useTranslation();

  const {loginUser} = useUser();
  
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerification, setPasswordVerification] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordVerificationError, setPasswordVerificationError] = useState<string>("");

  const isEmailValid = () => /^([\w.%+-]+)@([\w-]+).([\w]{2,})$/i.test(email);

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

  const validateSignup = () => {
    if (name.length === 0) {
      setNameError(t(ErrorKeys.USERNAME_MISSING));
      return false;
    }
    if (!isEmailValid()) {
      setEmailError(t(ErrorKeys.EMAIL_INVALID));
      return false;
    }
    if (password.length < 8) {
      setPasswordError(t(ErrorKeys.PASSWORD_SHORT));
      return false;
    }
    if (password !== passwordVerification) {
      setPasswordVerificationError(t(ErrorKeys.PASSWORD_MISMATCH));
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    const isValid = validateSignup();
 
    if (isValid) {
      const userData = {name, email, password}

      axios.post('/api/auth/signup', userData)
        .then((res) => {
          loginUser(email, password);
        })
        .catch((err) => {
          console.log(err);
          const {detail} = err?.response?.data;
          if (detail && detail.includes("name")) {
            setNameError(t(ErrorKeys.USERNAME_TAKEN));
          }
          if (detail && detail.includes("email")) {
            setEmailError(t(ErrorKeys.EMAIL_TAKEN));
          }
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
            type="text"
            placeholderText="Captain Caveman"
            errorText={nameError}
            value={name}
          />
          <TextInput
            labelText={t('authenticationForm.labels.email')}
            id="signup_email"
            onChange={(e) => {onInputEmail(e)}}
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
            errorText={passwordError}
            id="signup_password"
            onChange={(e) => {onInputPassword(e)}}
            type="password"
          />
          <TextInput
            labelText={t('authenticationForm.labels.password2')}
            errorText={passwordVerificationError}
            value={passwordVerification}
            placeholderText=""
            id="signup_password_verification"
            onChange={(e) => {onInputPasswordVerification(e)}}
            type="password"
          />
        </fieldset>
        <Button id="authenticate_signup" type="button" onClick={handleSignup} look="primary">
          {t('authenticationForm.buttonLabels.signUp')}
        </Button>
      </form>
    </div>
  );
};

export default SignUp;