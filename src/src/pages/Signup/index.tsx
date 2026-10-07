import { Link } from 'react-router-dom';
import './index.css';

export default function Signup() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">アカウント作成</h1>

        <div className="auth-form-container">
          <div className="form-group">
            <label htmlFor="username">ユーザー名</label>
            <input id="username" type="text" placeholder="山田太郎" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              placeholder="example@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              placeholder="8文字以上"
              required
              minLength={8}
            />
          </div>

          <button type="button" className="auth-button" onClick={() => {}}>
            アカウント作成
          </button>
        </div>

        <p className="auth-footer">
          既にアカウントをお持ちの方は
          <Link to="/signin">ログイン</Link>
        </p>
      </div>
    </div>
  );
}
