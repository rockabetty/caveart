import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TextInput } from '../../../../component_library/Form';
import { Button } from '../../../../component_library/Button';

interface AuthProps {
  onLogin: (data: Record<string, unknown>) => void;
}

const LogIn: React.FC<AuthProps> = ({ onSignup }) => {
  const { t } = useTranslation();
  
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [validName, setValidName] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
 
  const [nameState, setNameState] = useState<"default"|"error"|"valid">('default');
  const [passwordState, setPasswordState] = useState<"default"|"error"|"valid">('default');

  const [nameError, setNameError] = useState<string>("");

  const [serverError, setServerError] = useState<string>("");
  
  const onInputName = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setName(e.target.value)
  }

  const onInputPassword = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPassword(e.target.value)
  }

  const validateName = () => {
    const isValid = name.length > 0;
    setNameState(isValid ? 'default' : 'error');
    setNameError(isValid ? '' : t('authenticationForm.instructions.username'));
    setValidName(isValid);
  };

  const validatePassword = () => {
    const isValid = password.length > 0;
    setPasswordState(isValid ? 'default' : 'error');
    setValidPassword(isValid);
  };

  const validateLogin = () => {
    validateName();
    validatePassword();
  };

  const handleLogin = () => {
    validateLogin();
    if (validName && validPassword) {
      console.log("valid id")
      axios.post('/api/auth/signup', {
        name,
        password
      })
        .then((res) => {
          setName("");
          setPassword("");
          onLogin(res.data);
        })
        .catch((err) => {
          const { data } = err?.response;
          setServerError(err.response.data);
        });
    }
  };

  useEffect(handleLogin, [name, password]);

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
        </fieldset>
        { serverError && <span className="form_server-message Error">{serverError}</span> }
        <Button id="authenticate_login" type="button" onClick={handleLogin} look="primary">
          {t('authenticationForm.buttonLabels.logIn')}
        </Button>
      </form>
    </div>
  );
};

export default LogIn;