import { PlayerScore } from '../../types/ScoreType';
import Result from './Result';

interface PlayersProps {
  playerScore: PlayerScore;
}

export default function Players({ playerScore }: PlayersProps) {
  return (
    <li className="flex flex-row bg-aod_bg px-5 py-2.5 text-aod_text odd:bg-aod_text_alt odd:text-aod_gutter">
      <div>{playerScore.name}</div>
      <div className="flex w-full flex-row gap-1">
        {playerScore.results.map((result, index) => (
          <Result key={index} result={result} />
        ))}
      </div>
    </li>
  );
}
