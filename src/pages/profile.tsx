import React, {useEffect} from 'react'
import CaveartLayout from '../app/user_interface/CaveartLayout';
import axios from 'axios';
import { useUser } from '../auth/client/hooks/useUser';
import { ActionType } from '../auth/types/user.d.ts';

const Profile: React.FC = () => {

  const {viewProfile} = useUser();

  useEffect(() => {
    try {
      const profile = viewProfile();
    }
    catch(error) {
      console.log(err);
    };
  },
  []);

  return (
    <CaveartLayout requireLogin={false}>
      <h1>Profile</h1>
    </CaveartLayout>
  )
}

export default Profile;