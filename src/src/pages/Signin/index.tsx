import { Link } from 'react-router-dom';
import './index.css';
import { authRepository } from '../../modules/auth/auth.repository';
import { useState } from 'react';

export default function Signin() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    const signin = async () => {
    setIsLoading(true);
    try {
      const { user, token } = await authRepository.signin(email, password);
      console.log('ログイン成功:', user, token);
    } catch (error) {
      console.error(error);
      alert('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              placeholder="パスワードを入力"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="auth-button"
            disabled={isLoading || !email || !password}
            onClick={signin}
          >
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
