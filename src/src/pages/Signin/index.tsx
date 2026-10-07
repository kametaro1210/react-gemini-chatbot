import { Link } from 'react-router-dom';
import './index.css';

export default function Signin() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">ログイン</h1>

        <div className="auth-form-container">
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
              placeholder="パスワードを入力"
              required
            />
          </div>

          <button type="button" className="auth-button" onClick={() => {}}>
            ログイン
          </button>
        </div>

        <p className="auth-footer">
          アカウントをお持ちでない方は
          <Link to="/signup">新規登録</Link>
        </p>
      </div>
    </div>
  );
}
