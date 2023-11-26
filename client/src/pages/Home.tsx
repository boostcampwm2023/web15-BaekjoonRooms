export default function Home() {
  return (
    <div className="bg-aod_bg flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-aod_text my-2 text-3xl font-bold">Baekjoon Rooms</h1>
      <button className="text-aod_text bg-aod_black my-2 flex items-center rounded-lg px-5 py-2.5 text-sm hover:bg-gray-600">
        <img
          src="/assets/Github.png"
          alt="GitHub logo"
          className="mr-2 h-5 w-5"
        />
        Login with GitHub
      </button>
    </div>
  );
}
