import React from 'react';

import LogoutButton from '../components/buttons/LogoutButton';
import Profile from '../components/Profile';
import RoomAccessPanel from '../components/RoomAccessPanel';

export default function Lobby() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className="bg-aod_bg min-h-screen">
        <div className="flex w-full justify-end">
          <LogoutButton />
        </div>
        <div className="mt-32 flex flex-col items-center">
          <Profile />
          <RoomAccessPanel />
        </div>
      </div>
    </React.Suspense>
  );
}
