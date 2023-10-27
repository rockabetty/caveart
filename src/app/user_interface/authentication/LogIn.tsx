import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TextInput } from '../../../../component_library';
import { Button } from '../../../../component_library';
import { useUser } from '../../../auth/client/hooks/useUser';
import { ActionType } from '../../../auth/types/user.d.ts'


const LogIn: React.FC<AuthProps> = () => {

  const [state, dispatch] = useUser();

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

  const validateLogin = () => {
    const isValidName = name.length > 0;
    const isValidPassword = password.length > 0;
    if (isValidName && isValidPassword) {
      console.log("valid")
      return true
    }

    setNameState(isValidName ? 'default' : 'error');
    setNameError(isValidName ? '' : t('authenticationForm.instructions.username'));
    setValidName(isValidName);

    setPasswordState(isValidPassword ? 'default' : 'error');
    setValidPassword(isValidPassword);

    return false;
  };

  const handleLogin = () => {
    const isValid = validateLogin();
    const userData = { name, password };
    if (isValid) {
      axios.post('/api/auth/signup', userData)
        .then((res) => {
          setName("");
          setPassword("");
          dispatch({
            type: ActionType.Login,
            payload: userData
          })
        })
        .catch((err) => {
          const { data } = err?.response;
          setServerError(err.response.data);
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
            labelText={t('authenticationForm.labels.password')}
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