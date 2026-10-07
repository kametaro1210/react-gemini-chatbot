import { Link } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi2';
import './index.css';

export default function ConversationItem() {
  return (
    <Link to="" className="conversation-item">
      <div className="conversation-title">会話の履歴タイトル</div>
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
