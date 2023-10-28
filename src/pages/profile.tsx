import React, {useEffect, useState} from 'react'
import CaveartLayout from '../app/user_interface/CaveartLayout';
import axios from 'axios';
import { useUser } from '../auth/client/hooks/useUser';
import { ActionType, UserType } from '../auth/types/user.d.ts';

const Profile: React.FC = () => {

  const {viewProfile, getUser} = useUser();
  const [userProfile, setUserProfile] = useState<UserType>({})

  useEffect(() => {
    const userInfo = getUser()
    setUserProfile(userInfo)
  }, [getUser]);

  useEffect(() => {
    try {
      viewProfile();
    }
    catch(error) {
      console.log(err);
    };
  },
  []);

  if (userProfile) {
    return (
      <CaveartLayout requireLogin={false}>
        <h1>{userProfile.username}</h1>
        <p>member since {userProfile.created_at} | {userProfile.email}</p>
      </CaveartLayout>
    )
  } else {
    return (
      <CaveartLayout>
      </CaveartLayout>
    )
  }

  
}

export default Profile;