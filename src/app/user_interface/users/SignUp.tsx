import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { TextInput, Form, DatePicker } from "@components";
import { useUser } from "./hooks/useUser";
import { ErrorKeys } from "./errors.types";

type SignupFormState = {
  name: string;
  email: string;
  password: string;
  passwordVerification: string;
  birthdate: Date;
};

type SignupErrors = {
  nameError: string;
  emailError: string;
  passwordError: string;
  passwordVerificationError: string;
};

const SignUp: React.FC = () => {
  const { t } = useTranslation();

  const { loginUser } = useUser();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerification, setPasswordVerification] = useState<string>("");
  const [birthdate, setBirthdate] = useState<Date>(new Date());
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordVerificationError, setPasswordVerificationError] =
    useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const isEmailValid = () => /^([\w.%+-]+)@([\w-]+).([\w]{2,})$/i.test(email);

  const checkPasswordsMatch = () => {
    setPasswordVerificationError("");
    if (password !== passwordVerification) {
      setPasswordVerificationError(t(ErrorKeys.PASSWORD_MISMATCH));
    }
  };

  const onInputName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const onInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onInputPassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const onInputPasswordVerification = (e: React.ChangeEvent<HTMLInputElement>) => setPasswordVerification(e.target.value);
  const onInputBirthdate = (birthdate: Date) => setBirthdate(birthdate);

  const validateFields = () => {
    const errors: Record<string, string> = {};
    // TODO - pick out the things HTML can natively just deal with.
    if (!name) errors.nameError = t(ErrorKeys.USERNAME_MISSING);
    if (!isEmailValid()) errors.emailError = t(ErrorKeys.EMAIL_INVALID);
    if (password.length < 8) errors.passwordError = t(ErrorKeys.PASSWORD_SHORT);
    if (password !== passwordVerification) errors.passwordVerificationError = t(ErrorKeys.PASSWORD_MISMATCH);
    return errors;
  };

  const validateSignup = () => {
    const errors = validateFields();
    setNameError(errors.nameError || "");
    setEmailError(errors.emailError || "");
    setPasswordError(errors.passwordError || "");
    setPasswordVerificationError(errors.passwordVerificationError || "");
    return Object.keys(errors).length === 0;
  };

  const handleApiError = (error: any) => {
    const message = error?.response?.data?.message;
    switch (message) {
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
        break;
      case ErrorKeys.EMAIL_TAKEN:
        setEmailError(t(ErrorKeys.EMAIL_TAKEN));
        break;
      default:
        setFormError(t(ErrorKeys.GENERAL_SUBMISSION_ERROR));
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget
    if (!form.reportValidity()) {
      return; // To catch the simple "you didn't fill in the required part" errors
    }

    setFormError("");
    if (validateSignup()) {
      const userData = { name, email, password, birthdate };
      axios
        .post("/api/auth/signup", userData)
        .then(() => {
          loginUser(email, password);
        })
        .catch(handleApiError);
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
          onChange={onInputName}
          type="text"
          placeholderText="Captain Caveman"
          errorText={nameError}
          value={name}
          required={true}
        />
        <TextInput
          labelText={t("authenticationForm.labels.email")}
          id="signup_email"
          onChange={onInputEmail}
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
          onChange={onInputPassword}
          type="password"
          required={true}
        />
        <DatePicker
          id="signup_birthdate"
          labelText={t("authenticationForm.labels.birthdate")}
          helperText={t("authenticationForm.instructions.birthdate")}
          onChange={onInputBirthdate}
          maxDate={new Date()}
          value={birthdate}
          showYearDropdown
        />
        <TextInput
          labelText={t("authenticationForm.labels.password2")}
          errorText={passwordVerificationError}
          value={passwordVerification}
          placeholderText=""
          id="signup_password_verification"
          onChange={onInputPasswordVerification}
          onBlur={checkPasswordsMatch}
          type="password"
          required={true}
        />

        <p className="form-field_helpertext">{t("authenticationForm.instructions.userAssertsTrueDOB")}</p>
      </fieldset>
    </Form>
  );
};

export default SignUp;
