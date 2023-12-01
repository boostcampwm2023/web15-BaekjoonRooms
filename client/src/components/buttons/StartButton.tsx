import { useState } from 'react';

export type StartButtonProps = {
  start: () => void;
  timer: string;
};

export default function StartButton({ isHost }: { isHost: boolean }) {
  const [timer, setTimer] = useState(`${isHost ? 'start' : 'waiting'}`);
  const start = () => {
    isHost && setTimer('0:00:00');
  };
  return (
    <div className="flex w-full justify-end">
      <button
        onClick={start}
        className="flex h-[33px] w-full items-center justify-center rounded-lg bg-aod_accent font-medium text-aod_white hover:opacity-80">
        {timer}
      </button>
    </div>
  );
}
