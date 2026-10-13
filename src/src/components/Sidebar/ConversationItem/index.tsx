import { Link } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi2';
import './index.css';
import type { Conversation } from '../../../modules/conversations/conversation.entity';


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

  return (
    <Link to={`/chats/${conversation.id}`} className="conversation-item">

      <div className="conversation-title">
        {conversation.title || '新しい会話'}
      </div>
      
      <button
        className="btn-icon delete-btn"
        onClick={() => {}}
        title="削除"
        type="button"
      >
        <HiOutlineTrash />
      </button>
    </Link>
  );
}
