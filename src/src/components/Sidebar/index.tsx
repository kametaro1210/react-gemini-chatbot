import { useSetAtom } from 'jotai';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { currentUserAtom } from '../../modules/auth/current-user.state';
import { conversationRepository } from '../../modules/conversations/conversation.repository';
import { conversationsAtom } from '../../modules/conversations/conversation.state';
import ConversationList from './ConversationList';

export default function Sidebar() {

  // 別のページへ移動（画面遷移）するための関数を取得する
  const navigate = useNavigate();

  // Jotaiのグローバル状態（conversationsAtom）を更新するための関数を取得
  const setConversations = useSetAtom(conversationsAtom);

  // Jotaiのグローバル状態（currentUserAtom）を更新するための関数を取得
  const setCurrentUser = useSetAtom(currentUserAtom);

  // -------------------------------------------------------------------------

  /*
    新しい会話の作成・画面遷移処理

    【目的】
    新しい会話を作成して会話一覧の状態に反映し、その会話の詳細画面を表示する。

    【処理フロー】
    1. conversationRepository.createを呼び出し、新しい会話を作成する。
    2. 作成に成功した場合、setConversationsで現在の会話一覧を受け取り、
        新しい会話を先頭に追加した一覧でグローバル状態を更新する。
    3. navigateに新しい会話のIDを渡し、その会話の詳細画面へ遷移する。
    4. 作成中にエラーが発生した場合は、エラーをコンソールに出力し、
        alertで会話の作成に失敗したことをユーザーに通知する。
  */

  const createConversation = async () => {
    try {
      const conversation = await conversationRepository.create();

      // アプリ全体で共有している会話一覧のグローバル状態（conversationsAtom）を、
      // 最新の会話リストで上書き更新する
      setConversations((prev) => [conversation, ...prev]);

      // 新しく作成した会話の詳細ページに遷移する
      navigate(`/chats/${conversation.id}`);

      // console.log('新しい会話を作成しました:', conversation);
    } catch (error) {
      console.error(error);
      alert('会話の作成に失敗しました');
    }
  };

  // -------------------------------------------------------------------------

  /*
    ログアウト処理

    【目的】
    保存されている認証トークンと、アプリ内で保持しているユーザー情報を削除する。

    【処理フロー】
    1. localStorageからtokenを削除し、ブラウザーに保存された認証情報を消去する。
    2. setCurrentUserにundefinedを渡し、currentUserAtomのユーザー情報をクリアする。
  */

  const signout = () => {
    localStorage.removeItem('token');
    setCurrentUser(undefined);
  };

  // -------------------------------------------------------------------------

  return (
    <div className="sidebar">
      <div style={{ padding: '16px' }}>
        <button
          className="btn-primary"
          style={{ width: '100%' }}
          onClick={createConversation}
        >
          + 新規チャット
        </button>
      </div>
      <ConversationList />

      <div
        style={{
          padding: '16px',
          marginTop: 'auto',
          borderTop: '1px solid #E5E5E5',
        }}

      >
        <button
          className="sidebar-item"
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            margin: 0,
            cursor: 'pointer',
          }}
          onClick={signout}
        >

          <HiOutlineArrowRightOnRectangle size={20} />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
}
