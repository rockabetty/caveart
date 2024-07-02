import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TextInput, Button, Form } from '../../../../component_library';
import { useUser } from '../../../services/auth/client/hooks/useUser';
import { ActionType } from '../../../services/auth/types/user.d.ts';
import { ErrorKeys } from '../../../services/auth/types/errors';

const SignUp: React.FC<AuthProps> = () => {
  const { t } = useTranslation();
 
  const {loginUser, isLoading, authError} = useUser();
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  
  const isEmailValid = () => /^([\w.%+-]+)@([\w-]+).([\w]{2,})$/i.test(email);

  const onInputEmail = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setEmail(e.target.value)
  }

  const onInputPassword = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPassword(e.target.value)
  }

  const validateLogin = () => {
    if (!isEmailValid()) {
      setEmailError(t(ErrorKeys.EMAIL_INVALID));
      return false;
    }
    if (password.length === 0) {
      setPasswordError(t(ErrorKeys.PASSWORD_SHORT));
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    const isValid = validateLogin();
    if (isValid) {
      loginUser(email, password);
    }
  };

  return (
    <div>
      <Form
        id="login-modal"
        onSubmit={handleLogin}
        submitLabel={t('authenticationForm.buttonLabels.logIn')}
        submissionError={authError.status === 403
          ? t(authError.message)
          : null
        }
        loading={isLoading}
      >
        <fieldset>
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
        </fieldset>
      </Form>
    </div>
  );
};

export default SignUp;