import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { TextInput } from '../../../../component_library/Form';
import { Button } from '../../../../component_library/Button';
 
interface AuthProps {
  onSignup: (data: Record<string, unknown>) => void,
}

export const SignUp = (props: AuthProps) => {
  const { t, i18n } = useTranslation();

  const validateName = function () {
    const isValid = name.length > 0
    setValidName(isValid)
    setNameError(isValid ? '' : t('authenticationForm.instructions.username'))
    setNameState(isValid ? 'default' : 'error')
  }

  const validateEmail = function () {
    const regex = /^([\w.%+-]+)@([\w-]+).([\w]{2,})$/i
    const isValid = !!email.match(regex)
    setValidEmail(isValid)
    setEmailError(isValid ? '' : t('authenticationForm.instructions.email'))
    setEmailState(isValid ? 'default' : 'error')
  }

  const validatePassword = function () {
    const isValid = password.length > 7
    setValidPassword(isValid)
    setPasswordState(isValid ? 'default' : 'error')
  }

  const validatePasswordVerification = function () {
    const isValid = password === passwordVerification
    setValidPasswordVerification(isValid)
    setPasswordVerificationState(isValid ? 'default' : 'error')
  }

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

  const validateSignup = function () {
    validateName()
    validateEmail()
    validatePassword()
    validatePasswordVerification()
  }

  const signUp = function () {
   validateSignup()
  }

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordVerification, setPasswordVerification] = useState<string>("")

  const [emailState, setEmailState] = useState<"default"|"error"|"valid">('default')
  const [passwordState, setPasswordState] = useState<"default"|"error"|"valid">('default')
  const [nameState, setNameState] = useState<"default"|"error"|"valid">('default')
  const [passwordVerificationState, setPasswordVerificationState] = useState<"default"|"error"|"valid">('default')
  
  const [validName, setValidName] = useState<boolean>(false)
  const [validEmail, setValidEmail] = useState<boolean>(false)
  const [validPassword, setValidPassword] = useState<boolean>(false)
  const [validPasswordVerification, setValidPasswordVerification] = useState<boolean>(false)
  
  const [nameError, setNameError] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [serverError, setServerError] = useState<string>("")

  useEffect(() => {
    if (validName && validEmail && validPassword && validPasswordVerification) {
      axios({
        method: 'post',
        url: '/api/auth/signup',
        data: { name, email, password }
      })
        .then((res) => {
          setName("")
          setEmail("")
          setPassword("")
          props.onSignup(res.data)
        })
        .catch((err) => {
          const {data} = err?.response
          if (data.includes("name")) {
            setNameState("error")
            setNameError(t('authenticationForm.userErrorMessages.userNameTaken'))
          }
          if (data.includes("email")) {
            setEmailState("error")
            setEmailError(t('authenticationForm.userErrorMessages.emailTaken'))
          }

          setServerError(err.response.data)
        })
    }
  }, [validName, validEmail, validPassword, validPasswordVerification])

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
          />
          <TextInput
            labelText={t('authenticationForm.labels.email')}
            id="signup_email"
            onChange={(e) => {onInputEmail(e)}}
            status={emailState}
            placeholderText="unga@bunga.com"
            type="email"
            errorText={emailError}
          />
          <TextInput
            labelText={t('authenticationForm.labels.password')}
            helperText={t('authenticationForm.instructions.password')}
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
            placeholderText=""
            status={passwordVerificationState}
            id="signup_password_verification"
            onChange={(e) => {onInputPasswordVerification(e)}}
            type="password"
          />
        </fieldset>

        { serverError ? <span className="form_server-message Error">{serverError}</span> : ''}
        <Button
          id="authenticate_signup"
          type="button"
          onClick={signUp}
          look="primary"
        >
          {t('authenticationForm.buttonLabels.signUp')}
        </Button>
        
      </form>
    </div>
  )
}

export default SignUp;