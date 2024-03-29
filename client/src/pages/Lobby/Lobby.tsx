import { useRef, useState } from 'react';
import LogoutButton from './LogoutButton';
import Profile from './Profile';
import RoomAccessPanel from './RoomAccessPanel/RoomAccessPanel';
import ThemeSettingModal from './ThemeSettingModal';
import ThemeSettingButton from './ThemeSettingButton';

export default function Lobby() {
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modalOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalOverlayRef.current === event.target) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex w-full justify-end gap-4 pr-4 shadow-md">
        <ThemeSettingButton openModal={openModal} />
        <LogoutButton />
      </div>
      <div className="mt-32 flex flex-col items-center">
        <Profile />
        <RoomAccessPanel />
      </div>
      {isModalOpen && (
        <ThemeSettingModal
          modalOverlayRef={modalOverlayRef}
          closeModal={closeModal}
          modalOutsideClick={modalOutsideClick}
        />
      )}
    </div>
  );
}
