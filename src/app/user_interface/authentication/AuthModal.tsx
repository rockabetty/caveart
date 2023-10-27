import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Login from './LogIn';
import Signup from './SignUp';
import { useUser } from '../../../auth/client/hooks/useUser';
import { ActionType } from '../../../auth/client/types/user.d.ts'
import { Button, Modal } from '../../../../component_library';

interface AuthProps {
  isOpen: boolean;
  initial: 'Sign Up' | 'Log In' | '';
  onClose: (...params: any) => any;
  onAuth: (...params: any) => any;
  loggedIn: boolean;
}

const AuthModal: React.FC<AuthProps> = ({ isOpen, initial, onClose, onAuth, loggedIn }) => {
  const { t } = useTranslation();
  const [authMode, setAuthMode] = useState<'Log In' | 'Sign Up' | ''>(initial);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  useEffect(() => {
    const message = authMode === 'Log In' ? t('authenticationForm.logInSuccessful') : t('authenticationForm.signUpSuccessful');
    setConfirmationMessage(message);
  }, [authMode]);

  const renderContent = () => {
    if (loggedIn) {
      return (
        <div className="authmodal_confirmation">
          <img src="img/brand/confirmation.gif" alt={confirmationMessage} />
          <p>{confirmationMessage}!</p>
          <Button look="primary" id="continue" onClick={onClose}>
            {t('authenticationForm.enterSite')}
          </Button>
        </div>
      );
    } else {
      return (
        <>
          {authMode === 'Log In' ? (
            <>
              <Login onLogIn={onAuth} />
              <Button id="authmodal_sign-up" look="muted" onClick={() => setAuthMode('Sign Up')}>
                {t('authenticationForm.buttonLabels.signUp')}
              </Button>
            </>
          ) : (
            <>
              <Signup onSignup={onAuth} />
              <Button id="authmodal_sign-up" look="muted" onClick={() => setAuthMode('Log In')}>
                {t('authenticationForm.buttonLabels.logIn')}
              </Button>
            </>
          )}
        </>
      );
    }
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
    </Modal>
  );
};

export default AuthModal;