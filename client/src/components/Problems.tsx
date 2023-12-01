import { useState, useRef } from 'react';

import { ProblemType } from '../types/ProblemType';
import RoomSettingModal from './RoomSettingModal/RoomSettingModal';

export default function Problems({ isHost }: { isHost: boolean }) {
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalOverlayRef = useRef<HTMLDivElement>(null);

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
    <>
      {isHost ? (
        <div className="h-[120px] w-full cursor-pointer" onClick={openModal}>
          {problems.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-aod_text">
                문제를 추가해주세요!
              </h1>
            </div>
          ) : (
            <ul className="w-full flex-col">
              {problems.map((problem, index) => (
                <div
                  className="mt-1 w-fit rounded-[21px] bg-aod_green/75 px-2.5 py-1 text-left text-xs"
                  key={index}>
                  {problem.title}
                </div>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex h-[108px] w-full items-center justify-center text-aod_text">
          문제 출제중...
        </div>
      )}
      {isModalOpen && (
        <RoomSettingModal
          modalOverlayRef={modalOverlayRef}
          closeModal={closeModal}
          modalOutsideClick={modalOutsideClick}
          problems={problems}
          setProblems={setProblems}
        />
      )}
    </>
  );
}
