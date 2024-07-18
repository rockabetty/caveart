import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { TextInput, Form } from "@components";
import { useUser } from "./hooks/useUser";
import { ErrorKeys } from "./errors.types";

const SignUp: React.FC = () => {
  const { t } = useTranslation();

  const { loginUser } = useUser();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerification, setPasswordVerification] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordVerificationError, setPasswordVerificationError] =
    useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const isEmailValid = () => /^([\w.%+-]+)@([\w-]+).([\w]{2,})$/i.test(email);

  const checkpasswordsMatch = () => {
    setPasswordVerificationError("");
    if (password !== passwordVerification) {
      setPasswordVerificationError(t(ErrorKeys.PASSWORD_MISMATCH));
    }
  };

  const onInputName = function (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setName(e.target.value);
  };

  const onInputEmail = function (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setEmail(e.target.value);
  };

  const onInputPassword = function (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setPassword(e.target.value);
  };

  const onInputPasswordVerification = function (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setPasswordVerification(e.target.value);
  };

  const validateSignup = () => {
    setNameError("");
    if (name.length === 0) {
      setNameError(t(ErrorKeys.USERNAME_MISSING));
      return false;
    }
    setEmailError("");
    if (!isEmailValid()) {
      setEmailError(t(ErrorKeys.EMAIL_INVALID));
      return false;
    }
    setPasswordError("");
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
    setFormError("");
    const isValid = validateSignup();

    if (isValid) {
      const userData = { name, email, password };

      axios
        .post("/api/auth/signup", userData)
        .then(() => {
          loginUser(email, password);
        })
        .catch((err: any) => {
          console.log(err);
          const { data } = err?.response;
          switch (data.message) {
            case ErrorKeys.USERNAME_MISSING:
              setNameError(t(ErrorKeys.USERNAME_MISSING));
              break;
            case ErrorKeys.PASSWORD_MISSING:
              setPasswordError(t(ErrorKeys.PASSWORD_MISSING));
              break;
            case ErrorKeys.EMAIL_INVALID:
              setEmailError(t(ErrorKeys.EMAIL_INVALID));
              break;
            case ErrorKeys.USERNAME_TAKEN:
              setNameError(t(ErrorKeys.USERNAME_TAKEN));
              setFormError(t(ErrorKeys.USERNAME_TAKEN));
              break;
            case ErrorKeys.EMAIL_TAKEN:
              setEmailError(t(ErrorKeys.EMAIL_TAKEN));
              setFormError(t(ErrorKeys.EMAIL_TAKEN));
              break;
            default:
              setFormError(t(ErrorKeys.GENERAL_SUBMISSION_ERROR));
          }
        });
    }
  };

  return (
    <Form
      id="signup-modal"
      onSubmit={handleSignup}
      submitLabel={t("authenticationForm.buttonLabels.signUp")}
      submissionError={t(formError)}
      formValues={{ name, email, password }}
    >
      <fieldset>
        <TextInput
          labelText={t("authenticationForm.labels.username")}
          pattern={"/^[a-zA-Z0-9_-]+$/"}
          id="signup_name"
          onChange={(e) => {
            onInputName(e);
          }}
          type="text"
          placeholderText="Captain Caveman"
          errorText={nameError}
          value={name}
          required={true}
        />
        <TextInput
          labelText={t("authenticationForm.labels.email")}
          id="signup_email"
          onChange={(e) => {
            onInputEmail(e);
          }}
          placeholderText="unga@bunga.com"
          type="email"
          errorText={emailError}
          value={email}
          required={true}
        />
        <TextInput
          labelText={t("authenticationForm.labels.password")}
          helperText={t("authenticationForm.instructions.password")}
          value={password}
          placeholderText=""
          minLength={8}
          errorText={passwordError}
          id="signup_password"
          onChange={(e) => {
            onInputPassword(e);
          }}
          type="password"
          required={true}
        />
        <TextInput
          labelText={t("authenticationForm.labels.password2")}
          errorText={passwordVerificationError}
          value={passwordVerification}
          placeholderText=""
          id="signup_password_verification"
          onChange={(e) => {
            onInputPasswordVerification(e);
          }}
          onBlur={() => {
            checkpasswordsMatch();
          }}
          type="password"
          required={true}
        />
      </fieldset>
    </Form>
  );
};

export default SignUp;
