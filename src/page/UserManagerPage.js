import React, { useState } from 'react';
import UserManagerComponent from '../components/UserManagerComponent';
import TeamManagerComponent from '../components/TeamManagerComponent';

const UserManager = () => {
  const [refreshKeyForTeamManager, setRefreshKeyForTeamManager] = useState(0);
  const [refreshKeyForUserManager, setRefreshKeyForUserManager] = useState(0);

  const handleUserCreated = () => {
    setRefreshKeyForTeamManager((prev) => prev + 1);
  };

  const handleUserAssignedToTeam = () => {
    setRefreshKeyForUserManager((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col" style={{ height: `calc(100vh - 4rem)` }}>
      <div className="flex-1 overflow-hidden">
        <UserManagerComponent onUserCreated={handleUserCreated} key={refreshKeyForUserManager} />
      </div>
      <div className="flex-1 overflow-hidden">
        <TeamManagerComponent onUserAssignedToTeam={handleUserAssignedToTeam} key={refreshKeyForTeamManager} />
      </div>
    </div>
  );
};

export default UserManager;
