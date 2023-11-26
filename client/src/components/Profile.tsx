import { useAuthContext } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuthContext();

  return (
    <div className="mb-6 flex items-center justify-center gap-3">
      <img
        className="w-12 rounded-full"
        src={user!.avatar_url}
        alt="프로필 이미지"
      />
      <p className="text-aod_text text-lg font-semibold">{user.username}</p>
    </div>
  );
}
