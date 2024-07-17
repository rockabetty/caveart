import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, Form } from '@components';
import { useUser } from '../../../services/auth/client/hooks/useUser';
import { ErrorKeys } from '../../../services/auth/types/errors';

const Login: React.FC= () => {
  const { t } = useTranslation();
 
  const {loginUser, authError} = useUser();
  
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
        submissionError={authError && authError.status === 403
          ? t(authError.message)
          : null
        }
        formValues={{email, password}}
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

export default Login;