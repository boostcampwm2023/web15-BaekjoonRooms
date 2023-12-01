import { useLocation } from 'react-router-dom';

import Problems from '../components/Problems';
import ScoreboardButton from '../components/buttons/ScoreBoardButton';
import Chat from '../components/Chat';
import StartButton from '../components/buttons/StartButton';
import RoomInfo from '../components/RoomInfo';

export default function Room() {
  const location = useLocation();
  const isHost = location.state?.isHost;
  const roomCode = location.state?.roomCode;

  return (
    <div className="flex min-h-screen items-center justify-center bg-aod_fg">
      <div className="z-10 flex min-h-screen w-[388px] flex-col items-center gap-2 rounded-lg bg-aod_bg p-4 shadow-2xl">
        <RoomInfo />
        <Problems isHost={isHost} />
        <ScoreboardButton />
        <StartButton isHost={isHost} />
        <Chat />
      </div>
    </div>
  );
}
