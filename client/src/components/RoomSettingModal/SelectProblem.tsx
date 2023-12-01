import { Dispatch, SetStateAction } from 'react';
import { ProblemType } from '../../types/ProblemType';

interface SelectProblemProps {
  problem: ProblemType;
  setProblem: Dispatch<SetStateAction<ProblemType>>;
  problemList: ProblemType[];
  setProblemList: Dispatch<SetStateAction<ProblemType[]>>;
}

export default function SelectProblem({
  problem,
  setProblem,
  problemList,
  setProblemList,
}: SelectProblemProps) {
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProblem({
      title: event.target.value,
      boj_problem_id: '',
      url: '',
      level: '',
      tag: [],
    });
  };
  const registerProblem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProblemList([...problemList, problem]);
    setProblem({
      title: '',
      boj_problem_id: '',
      url: '',
      level: '',
      tag: [],
    });
  };

  return (
    <form
      className="m-2 flex w-[250px] justify-between"
      onSubmit={registerProblem}>
      <input
        className="rounded-lg bg-aod_white px-2"
        placeholder="문제를 입력하시오"
        value={problem.title}
        onChange={onChangeInput}
      />
      <button className="rounded-lg bg-aod_accent px-3 py-1 text-sm text-aod_white hover:opacity-80">
        등록
      </button>
    </form>
  );
}
