import { FaArrowRight } from 'react-icons/fa6';

export default function Chat() {
  return (
    <div className="flex h-[calc(100vh-300px)] w-full flex-col justify-end">
      <div className="flex items-center justify-between gap-2 rounded-lg bg-aod_white px-2.5 py-1.5">
        <input
          className="w-full text-sm outline-none"
          placeholder="텍스트를 입력하세요"
        />
        <FaArrowRight />
      </div>
    </div>
  );
}
