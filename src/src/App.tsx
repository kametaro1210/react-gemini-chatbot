import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import ChatContainer from './components/Chat/ChatContainer';
import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { currentUserAtom } from './modules/auth/current-user.state';
import { authRepository } from './modules/auth/auth.repository';

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const setCurrentUser = useSetAtom(currentUserAtom);

/* 
    アプリ起動時のログイン状態復元・初期ロード処理
    
    【処理概要】
    アプリケーションの起動時（マウント時）に、
    サーバーへ現在のログインユーザー情報を問い合わせてグローバルステートに保持する。

    ユーザー情報の取得が完了するまではロード画面を表示してレンダリングを一時停止することにより、
    未取得の状態で各ページ（チャット画面など）の判定やリダイレクトが誤作動するのを防ぐ。
    
    【処理フロー】
    1. useState を用いて、初期ロード中を表す isLoading ステートを true に設定する。
    2. コンポーネントの初回描画（マウント）時に非同期関数 `fetchCurrentUser` を実行するため、
      `useEffect` 内から呼び出す。
    3. fetchCurrentUser 関数内で authRepository.getCurrentUser() を呼び出し、
      アクセストークンを基にサーバーからログインユーザー情報を取得する。
    4. 取得したユーザー情報を Jotai の setCurrentUser（currentUserAtom）に
      セットしてグローバルで共有する。
    5. API通信のエラー時はコンソールにエラーを出力し、
      finally ブロックで必ず setIsLoading(false) を実行してロード状態を解除する。
    6. isLoading が true の間は空の div を返却してアプリ本体の描画をブロックし、
      ロード完了後に通常のルーティング画面を表示する。
*/

  useEffect(() => {
          const fetchCurrentUser = async () => {
              try {
                  const user = await authRepository.getCurrentUser();
                  setCurrentUser(user);
              } catch (error) {
                  console.error(error);
              } finally {
                  setIsLoading(false);
              }
          };
        fetchCurrentUser();
    }, [setCurrentUser]);

  if (isLoading) return <div />;

    return (

    // BrowserRouterでアプリ全体を囲み、ブラウザのURLに応じた画面切り替えを有効にする
    <BrowserRouter>

      {/* Routesの中に、表示するURLとコンポーネントの組み合わせを定義する */}
      <Routes>

        {/* /signinにアクセスしたとき、ログイン画面を表示する */}
        <Route path="/signin" element={<Signin />} />

        {/* /signupにアクセスしたとき、新規登録画面を表示する */}
        <Route path="/signup" element={<Signup />} />

        {/* /を親ルートにして、チャット共通のレイアウトを表示する */}
        <Route path="/" element={<Chat />}>

          {/* 親ルートのURLが/だけの場合、チャット未選択時の案内を表示する */}
          <Route
            index
            element={
              <div className="chat-empty">
                会話を選択、または作成してください
              </div>
            }
          />
          
          {/* /chats/会話IDにアクセスしたとき、会話画面を表示する。:conversationIdはURLから取得する値 */}
          <Route path="/chats/:conversationId" element={<ChatContainer />} />
        </Route>
      </Routes>
    {/* BrowserRouterの終了。ここで囲まれた範囲でルーティングを利用できる */}
    </BrowserRouter>
  );


}

export default App
