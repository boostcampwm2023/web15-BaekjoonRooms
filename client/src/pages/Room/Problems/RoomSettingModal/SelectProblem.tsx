import { Dispatch, SetStateAction, useState } from 'react';
import { ProblemType } from '../../../../types/ProblemType';
import { SearchResults } from './SearchResults';

interface SelectProblemProps {
  problem: ProblemType;
  setProblem: Dispatch<SetStateAction<ProblemType>>;
  problemList: ProblemType[];
  setProblemList: Dispatch<SetStateAction<ProblemType[]>>;
}

export default function SelectProblem({
  problemList,
  setProblemList,
}: SelectProblemProps) {
  const [searchInput, setSearchInput] = useState<string>('');

  const onChangeInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);

    if (!event.target.value.trim()) return;
  };

  const registerProblem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleOptionClick = (option: ProblemType) => {
    const newProblem: ProblemType = {
      title: option.title,
      bojProblemId: option.bojProblemId,
      url: `https://www.acmicpc.net/problem/${option.bojProblemId}`,
      level: option.level,
      // response have no tag attribute, leave blank
      tags: [],
    };

    if (problemList.length + 1 > 4) {
      alert('문제는 최대 4개까지만 등록할 수 있습니다.');
      return;
    }
    setProblemList([...problemList, newProblem]);
    setSearchInput('');
  };

  return (
    <form
      className="relative m-2 flex justify-between"
      onSubmit={registerProblem}>
      <input
        className="rounded-lg bg-default_white px-2 py-0.5"
        placeholder="문제를 입력하시오"
        value={searchInput}
        onChange={onChangeInput}
      />
      <SearchResults input={searchInput} onResultClick={handleOptionClick} />
    </form>
  );
}
