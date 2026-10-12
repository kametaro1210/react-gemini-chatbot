import { Link } from 'react-router-dom';
import './index.css';
import { useState } from 'react';
import { authRepository } from '../../modules/auth/auth.repository';

export default function Signup() {

    // 各入力値（名前・メール・パスワード）を保持する変数を空文字で初期化し、
    // 入力に応じて値を書き換える処理を準備する
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 通信中かどうかを判定するフラグをfalse（通信していない状態）で初期化し、
    // 状態を切り替える処理を準備する
    const [isLoading, setIsLoading] = useState(false);

    /* 
      ユーザー登録処理を行うための非同期関数
      ローディング状態を有効にしてAPIへ非同期でユーザー登録を依頼し、
      成功時は結果を出力、失敗時はエラー処理を行い、最後にローディング状態を解除する

      【処理フロー】
      1. 処理開始と同時に、ローディング状態を有効（true）にして二重送信を防ぐ
      2. 入力された値（名前・メール・パスワード）を使ってバックエンドの登録APIを呼び出す
      3. 成功時は受け取ったユーザー情報とトークンをコンソールに出力する
      4. 失敗時はエラー内容を出力し、ユーザーに失敗を通知するアラートを表示する
      5. 成功・失敗に関わらず、最後に必ずローディング状態を解除（false）する
    */

    const signup = async () => {
    setIsLoading(true);
    try {
      const { user, token } = await authRepository.signup(
        name,
        email,
        password,
      );
      console.log('ユーザー登録成功:', user, token);
    } catch (error) {
      console.error(error);
      alert('ユーザー登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">アカウント作成</h1>

        <div className="auth-form-container">
          <div className="form-group">
            <label htmlFor="username">ユーザー名</label>
            <input 
            id="username" 
            type="text" 
            placeholder="山田太郎" 
            required

            // ユーザー名を表すステート（入力欄の見た目に反映し、変更された最新の値をセットする）
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          </div>

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
              placeholder="8文字以上"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="auth-button"

            // ユーザー登録APIとの通信中、または必須の入力項目（名前・メール・パスワード）の
            // いずれかが未入力の場合はボタンを無効化する
            disabled={isLoading || !name || !email || !password}

            // ボタンがクリックされたときに、
            // ユーザー登録処理（signup関数）を実行する
            onClick={signup}
          >
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
