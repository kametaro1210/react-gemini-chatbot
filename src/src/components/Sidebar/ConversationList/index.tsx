import ConversationItem from '../ConversationItem';
import './index.css';

export default function ConversationList() {
  return (
    <div className="conversation-list">
      <ConversationItem />
      <ConversationItem />
      <ConversationItem />
    </div>
  );
}
