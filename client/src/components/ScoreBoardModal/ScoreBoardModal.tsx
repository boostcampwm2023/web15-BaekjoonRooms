import { ScoreResult, Score } from '../../types/ScoreType';
import mockScoresData from '../../../public/mocks/Scores.json';
import ScoreBoard from './ScoreBoard';
import { FaChartSimple, FaXmark } from 'react-icons/fa6';
import { RefObject } from 'react';

interface ModalProps {
  modalOverlayRef: RefObject<HTMLDivElement>;
  closeModal: () => void;
  modalOutsideClick: (arg: React.MouseEvent<HTMLDivElement>) => void;
}

const mockScores: Score = {
  players: mockScoresData.players.map((player) => ({
    ...player,
    results: player.results.map(
      (result) => ScoreResult[result as keyof typeof ScoreResult],
    ),
  })),
};

const iconStyle = {
  fontSize: '1.5rem',
};

export default function ScoreBoardModal({
  modalOverlayRef,
  closeModal,
  modalOutsideClick,
}: ModalProps) {
  return (
    <div
      className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-aod_bg/80"
      style={{ backdropFilter: 'blur(10px)' }}
      ref={modalOverlayRef}
      onClick={modalOutsideClick}>
      <div className="relative flex h-[430px] w-[330px] flex-col items-center rounded-2xl border-[0.5px] border-aod_gutter bg-aod_bg">
        <button className="absolute right-4 top-4" onClick={closeModal}>
          <FaXmark style={iconStyle} />
        </button>
        <div className="flex w-full flex-col items-center gap-y-[2px] border-b-[0.5px] border-aod_gutter px-5 py-3">
          <div className="flex flex-row items-baseline gap-2">
            <FaChartSimple />
            <div className="text-lg font-medium text-aod_text">Scoreboard</div>
          </div>
          <div className="text-xs text-aod_text">3 online</div>
        </div>
        <ScoreBoard scores={mockScores}></ScoreBoard>
      </div>
    </div>
  );
}
