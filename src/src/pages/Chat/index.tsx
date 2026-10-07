import Sidebar from '../../components/Sidebar';
import './index.css';
import { Outlet } from 'react-router-dom';

export default function Chat() {
  return (
    <div className="chat-layout">
      <Sidebar />
      <div className="chat-main">
        <Outlet />
      </div>
    </div>
  );
}
