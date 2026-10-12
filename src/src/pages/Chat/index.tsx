import Sidebar from '../../components/Sidebar';
import './index.css';
import { Navigate, Outlet } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '../../modules/auth/current-user.state';

export default function Chat() {

  // ログイン中のユーザー情報を取得するために、
  // JotaiのuseAtomValueフックを使用してcurrentUserAtomから値を取得する
  const currentUser = useAtomValue(currentUserAtom);

  // ログインしていない場合は、サインインページにリダイレクトする
  if (!currentUser) return <Navigate to="/signin" />;

  return (
    <div className="chat-layout">
      <Sidebar />
      <div className="chat-main">
        <Outlet />
      </div>
    </div>
  );
}
