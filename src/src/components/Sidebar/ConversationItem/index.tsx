import { Link, useParams, useNavigate } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi2';
import './index.css';
import { useSetAtom } from 'jotai';
import { conversationsAtom } from '../../../modules/conversations/conversation.state';
import type { Conversation } from '../../../modules/conversations/conversation.entity';
import type { MouseEvent } from 'react';
import { conversationRepository } from '../../../modules/conversations/conversation.repository';


  /**
   * ConversationItemコンポーネントが親から受け取るプロパティ（Props）の型定義
   * - conversation: 表示対象となる1件の会話（チャットルーム）データ
   */
  interface ConversationItemProps {
    conversation: Conversation;
  }

/**
* 親コンポーネントから渡されたプロパティ（Props）を「分割代入」で受け取り、
* コンポーネント内で使用できるようにする処理
* - 保存された会話（チャットルーム）のデータを親から受け取るための定義
*/
export default function ConversationItem({
  conversation,
}: ConversationItemProps) {

// URLのパスパラメータから conversationId を取得する
    const { conversationId } = useParams();

    // 現在開いている会話（部屋）のIDと、対象の会話IDが一致しているかどうかを判定する
    const isActive = conversationId === conversation.id;

    // 画面遷移（ページ移動）を行うための navigate 関数を取得する
    const navigate = useNavigate();

    // チャットの会話一覧（conversationsAtom）のデータを更新する処理を取得
    const setConversations = useSetAtom(conversationsAtom);

    const deleteConversations = async (e: MouseEvent) => {
    e.preventDefault();

    // 削除確認のダイアログを表示し、キャンセルされた場合は処理を中断する
    if (!window.confirm('この会話を削除しますか？')) return;

    try {
      
      // データベースから該当の会話を削除するAPIリクエストを送信
      await conversationRepository.delete(conversation.id);

      // 削除した会話を画面上のリスト（conversationsAtom）から除外して状態を更新
      setConversations((prev) =>
        prev.filter((item) => item.id !== conversation.id),
      );

      // 削除した会話が現在開いている会話（部屋）だった場合、トップページに遷移する
      if (isActive) {
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      alert('会話の削除に失敗しました');
    }
  };

  return (
    <Link
      to={`/chats/${conversation.id}`}
      className={`conversation-item ${isActive ? 'active' : ''}`}
    >

      <div className="conversation-title">
        {conversation.title || '新しい会話'}
      </div>
      
      <button
        className="btn-icon delete-btn"
        onClick={deleteConversations}
        title="削除"
        type="button"
      >
        <HiOutlineTrash />
      </button>
    </Link>
  );
}
