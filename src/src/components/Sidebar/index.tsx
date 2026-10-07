import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import ConversationList from './ConversationList';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div style={{ padding: '16px' }}>
        <button
          className="btn-primary"
          style={{ width: '100%' }}
          onClick={() => {}}
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
