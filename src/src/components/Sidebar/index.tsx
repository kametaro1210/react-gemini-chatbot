import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import ConversationList from './ConversationList';
import { conversationRepository } from '../../modules/conversations/conversation.repository';
import { useSetAtom } from 'jotai';
import { conversationsAtom } from '../../modules/conversations/conversation.state';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {

  // 別のページへ移動（画面遷移）するための関数を取得する
  const navigate = useNavigate();

  // Jotaiのグローバル状態（conversationsAtom）を更新するための関数を取得
  const setConversations = useSetAtom(conversationsAtom);

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
          }}
          onClick={() => {}}
        >
          <HiOutlineArrowRightOnRectangle size={20} />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
}
