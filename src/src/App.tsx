import { BrowserRouter, Route, Routes } from "react-router-dom"



function App() {

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
