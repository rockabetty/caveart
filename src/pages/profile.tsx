import React, { useEffect, useState } from 'react';
import CaveartLayout from '../app/user_interface/CaveartLayout';
import { useUser } from '../auth/client/hooks/useUser';
import { UserType } from '../auth/types/user.d.ts';

const Profile: React.FC = () => {
  const { viewProfile } = useUser();
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await viewProfile();
        setUserProfile(profile);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <CaveartLayout requireLogin={true}>Loading...</CaveartLayout>;
  }

  if (userProfile) {
    return (
      <CaveartLayout requireLogin={true}>
        <h1>{userProfile.username}</h1>
        <p>{userProfile.created_at} | {userProfile.email}</p>
      </CaveartLayout>
    );
  }

  return <CaveartLayout>Error loading profile</CaveartLayout>;
};

export default Profile;