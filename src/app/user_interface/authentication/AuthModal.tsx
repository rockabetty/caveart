import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Login from './LogIn';
import Signup from './SignUp';
import { Button, Modal } from '../../../../component_library';

interface AuthProps {
  isOpen: boolean;
  initial: 'Sign Up' | 'Log In' | '';
  onClose: (...params: any) => any;
}

const AuthModal: React.FC<AuthProps> = ({ isOpen, initial, onClose }) => {
  const { t } = useTranslation();
  
  const [authMode, setAuthMode] = useState<'Log In' | 'Sign Up' | ''>(initial);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  useEffect(() => {
    setAuthMode(initial)
  }, [initial]);

  useEffect(() => {
    const message = authMode === 'Log In' ? t('authenticationForm.logInSuccessful') : t('authenticationForm.signUpSuccessful');
    setConfirmationMessage(message);
  }, [authMode]);

  const renderContent = () => {
    return (
      <>
        {authMode === 'Log In' ? (
          <>
            <Login />
            <Button id="authmodal_sign-up" look="muted" onClick={() => setAuthMode('Sign Up')}>
              {t('authenticationForm.buttonLabels.signUp')}
            </Button>
          </>
        ) : (
          <>
            <Signup />
            <Button id="authmodal_sign-up" look="muted" onClick={() => setAuthMode('Log In')}>
              {t('authenticationForm.buttonLabels.logIn')}
            </Button>
          </>
        )}
      </>
    );
  };

  return (
    <Modal
      size="md"
      id="authmodal_sign-up"
      ariaLabel={authMode}
      heading={authMode === 'Log In' ? t('authenticationForm.buttonLabels.logIn') : t('authenticationForm.buttonLabels.signUp')}
      isOpen={isOpen}
      onClose={onClose}
    >
      {isOpen && renderContent()}
      { confirmationMessage
        ? <span>{confirmationMessage}</span>
        : null
      }
    </Modal>
  );
};

export default AuthModal;