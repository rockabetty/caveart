import React, { useEffect, useState } from 'react';
import CaveartLayout from '../app/user_interface/CaveartLayout';
import { useUser } from '../app/user_interface/users/hooks/useUser';
import { UserProfile } from '../services/auth/types/user';

const Profile: React.FC = () => {
  const { viewProfile } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
        <div className="tile">
          <h1>{userProfile.username}</h1>
          <p>{userProfile.created_at}</p>
        </div>
      </CaveartLayout>
    );
  }

  return <CaveartLayout>Error loading profile</CaveartLayout>;
};

export default Profile;