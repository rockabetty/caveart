import React from 'react'
import CaveartLayout from '../app/user_interface/CaveartLayout';

function Profile () {
  return (
    <CaveartLayout requireLogin={true}>
      <h1>Profile</h1>
    </CaveartLayout>
  )
}

export default Profile