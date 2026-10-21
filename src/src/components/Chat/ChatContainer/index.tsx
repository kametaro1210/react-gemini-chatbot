import { ChatSession } from '@google/generative-ai';
import { useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { HiOutlinePaperAirplane, HiOutlinePhoto } from 'react-icons/hi2';
import { useParams } from 'react-router-dom';
import { generateConversationTitle, startChatSession, } from '../../../lib/gemini';
import { conversationRepository } from '../../../modules/conversations/conversation.repository';
import { conversationsAtom } from '../../../modules/conversations/conversation.state';
import type { Message } from '../../../modules/messages/message.entity';
import { messageRepository } from '../../../modules/messages/message.repository';
import MessageList from '../MessageList';
import './index.css';


export default function ChatContainer() {

  // 入力された文字を最初に空(''）の状態で保管しておき、
  // 文字が入力・変更されるたびに setInputText でその中身を新しい文字に書き換える
  const [inputText, setInputText] = useState('');

  // URLのパラメータから会話ID（conversationId）を取得する
  const { conversationId } = useParams();

  // AIからのレスポンス待機中かどうかを管理するフラグ
  const [isLoading, setIsLoading] = useState(false);

  // データベースから取得したチャットメッセージの配列を管理
  // NOTE: fetchMessages等で非同期取得したデータや新着メッセージで随時更新される
  const [messages, setMessages] = useState<Message[]>([]);

  // AIから受信中のストリーミングテキストを保持する変数
  const [streamingText, setStreamingText] = useState('');

  // 再描画でリセットせず、会話中のチャットセッションを保持する
  const chatSessionRef = useRef<ChatSession | null>(null);

  // 会話一覧（conversationsAtom）を新しく書き換える・保存するための関数を取得する
  const setConversations = useSetAtom(conversationsAtom);

  // 選択された画像ファイルを保存する。未選択の間はnull。
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 選択した画像を画面に表示するための一時URLを保存する。未表示の間はnull。
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ボタンからファイル選択欄を開き、clearFileで選択内容を空にするための参照。
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------

  /*
    Geminiチャットセッションの初期化処理

    【目的】
    保存済みメッセージをGeminiが会話履歴として扱える形式に変換し、
    その履歴を使ってチャットセッションを作成する。

    【処理フロー】
    1. 引数で受け取ったメッセージ配列をコピーする。
    2. 作成日時を比較し、古いメッセージから順になるように並べる。
    3. 各メッセージのroleをGemini用の'user'または'model'に変換し、
        Gemini SDKの会話履歴形式に合わせてparts配列を作り、本文をtextとして設定する。
        partsは発言の内容を表す配列で、テキストや画像などの情報を入れるための項目。
    4. 変換した履歴をstartChatSessionに渡してセッションを作成する。
    5. 作成したセッションをchatSessionRef.currentに保存し、送信時に利用できるようにする。
  */

  const initializeChatSession = (messages: Message[]) => {

    // 保存済みメッセージを古い順に並べ、Gemini用の会話履歴に変換する
    const history = [...messages]
      .sort((fstMsg, secMsg) => {
        // 2件の作成日時を比べ、古いメッセージが先になるようにする
        const fstMsgCreatedAt = fstMsg.createdAt.getTime();
        const secMsgCreatedAt = secMsg.createdAt.getTime();
        return fstMsgCreatedAt - secMsgCreatedAt;
      })
      .map((message) => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      }));

    chatSessionRef.current = startChatSession(history);
  };

  // ----------------------------------------------

  /*
    会話履歴の読み込み処理

    【目的】
    チャットを開いたときと別の会話に切り替えたときに、その会話の履歴を読み込む。
    取得処理をコンポーネント本体に書くと、入力欄の変更などで再描画されるたびに
    API通信が発生する。そのためuseEffectを使い、conversationIdの変更を監視する。

    【処理フロー】
    1. 初回表示後とconversationId変更後にuseEffectが動き、fetchMessagesを呼び出す。
    2. void fetchMessages()でメッセージ取得を開始する。Promiseの戻り値はuseEffectから返さない。
    3. conversationIdがなければ終了し、あればfindOne()でその会話を取得する。
    4. 取得したmessagesをstateに保存する。データがなければ空配列を保存する。
    5. 同じmessagesをinitializeChatSessionに渡し、Gemini用の会話履歴を設定してチャットセッションを初期化する。
    6. 取得や初期化でエラーが発生した場合はcatchでコンソールに出力する。
  */

  useEffect(() => {
    const fetchMessages = async () => {

      // URLにルームIDがない場合は何も処理をしない
      if (!conversationId) return;

      try {
        const conversation = await conversationRepository.findOne(conversationId);
        setMessages(conversation.messages || []);
        initializeChatSession(conversation.messages || []);
      } catch (error) {
        console.error(error);
      }
    };

    // useEffectからPromiseを返さず、メッセージ取得を開始する
    void fetchMessages();
  }, [conversationId]);

  const handleSend = async () => {

    // 入力欄（inputText）の前後の空白を削除してメッセージを取得
    const currentMessage = inputText.trim();

    setIsLoading(true);

    const isFirstMessage = messages.length === 0;

    try {
      await createUserMessage(currentMessage);
      setInputText(''); // 入力欄を空にする
      await createAiMessage(currentMessage);

      if (isFirstMessage) {
        generateAndSaveTitle(currentMessage);
      }

    } catch (error) {
      console.error(error);
      alert('メッセージの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------------------

  /*
    画像ファイルの選択処理

    【目的】
    ファイル選択欄で選ばれた画像を画面でプレビューできるようにし、
    アップロード対象のファイルとして保存する。

    【処理フロー】
    1. eは、ファイル選択欄で選択内容が変わったときにReactから渡されるイベント情報。
        Memo : React.ChangeEvent<HTMLInputElement>は、
              「input要素で選択内容が変わったときのイベント情報」であることを示す型。
              この型により、e.targetからファイル選択欄を参照できる。
    2. e.target.filesは、ファイル選択欄で選ばれたファイルの一覧。
        Memo : ?.はファイル一覧がない場合にエラーにならないようにし、
              [0]で一覧の先頭（この画面で選択されたファイル）を取り出してfileに代入する。
    3. ファイルが選択されていなければ処理を終了する。
    4. ファイルの種類が画像でなければ、アラートを表示して処理を終了する。
    5. 選択したファイルをselectedFileに保存する。
    6. URL.createObjectURLでファイルを表示するための一時的なURLを作成し、
        previewUrlに保存してプレビューに利用する。
  */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルのみアップロード可能です');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // ----------------------------------------------------------------------------

  /*
    選択済み画像のクリア処理

    【目的】
    選択した画像とプレビューを解除し、ファイル選択欄を初期状態に戻す。

    【処理フロー】
    1. プレビュー用の一時URLがあれば、URL.revokeObjectURLでそのURLを無効にする。
        これにより、そのURLを通じて画像を読み込めなくなり、ブラウザが画像表示用に
        確保していた一時的なリソースを片付けられるようにする。
        選択元の画像ファイルを削除する処理ではない。
    2. 選択ファイルとプレビューURLをそれぞれnullにして、画面表示をクリアする。
    3. ファイル選択欄の値も空に戻す。これにより、同じ画像を選び直して
        プレビューを再表示できるようにする。
  */
  const clearFile = () => {

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

 // ----------------------------------------------------------------------------

  /*
    会話タイトルの生成・保存処理

    【目的】
    最初のメッセージをもとに会話タイトルを生成し、保存先と画面上の会話一覧を更新する。

    【処理フロー】
    1. メッセージをgenerateConversationTitleに渡し、Geminiでタイトルを生成する。
    2. 生成したタイトルをconversationRepository.updateTitleに渡し、
        対象の会話をデータベース上で更新する。
    3. setConversationsで現在の会話一覧を受け取り、mapで各会話を確認する。
    4. 対象の会話IDが更新後の会話IDと一致するかを判定する。
        一致する場合は三項演算子（条件 ? 一致した場合 : 一致しない場合）で
        更新後の会話に置き換え、一致しない場合は元の会話をそのまま残す。
    5. mapで作成した新しい会話一覧をsetConversationsに渡して画面を更新する。
  */

  const generateAndSaveTitle = async (message: string) => {

    const title = await generateConversationTitle(message);

    const updatedConversation = await conversationRepository.updateTitle(
      conversationId!,
      title,
    );

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === updatedConversation.id
          ? updatedConversation
          : conversation,
      ),
    );
  };

  // ----------------------------------------------------------------------------


  const createUserMessage = async (content: string) => {
    const userMessage = await messageRepository.create(conversationId!, {
      role: 'user',
      content,
    });

    // 既存のメッセージ配列の末尾に、新しく送信されたユーザーのメッセージを追加して状態を更新
    // Memo : prevは更新前のメッセージ配列を指し、userMessageを末尾に加えた配列を返す
    setMessages((prev) => [...prev, userMessage]);

    console.log('User message created:', userMessage);
  };

  const createAiMessage = async (content: string) => {

    // 保存済みの会話履歴を使って、Geminiのチャットセッションを初期化する
    initializeChatSession(messages);

    // 初期化したチャットセッションを取得する
    const chatSession = chatSessionRef.current;

    // セッションがまだ初期化されていない場合は、送信処理を終了する
    if (!chatSession) return;

    // AIモデルにメッセージを送信し、ストリーミング形式で応答を取得する
    const result = await chatSession.sendMessageStream(content);
    // console.log(result.response.text());

    let fullText = '';

    // AIから少しずつ届く文章のかけらを順番につなぎ合わせて、ひとつの文章にまとめる
    // Memo : 返ってくる文章のかけら（chunk）を、順番に fullText に足していく
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      setStreamingText(fullText);
    }

    const aiMessage = await messageRepository.create(conversationId!, {
      role: 'assistant',
      content: fullText,
    });

    // 既存のメッセージ配列の末尾に、AIからの新しい返答メッセージを追加して状態を更新
    // Memo : prevは更新前のメッセージ配列を指し、aiMessageを末尾に加えた配列を返す
    setMessages((prev) => [...prev, aiMessage]);

    // 処理が完了したら、ストリーミングテキストをリセット
    setStreamingText(''); 
    
    // console.log(aiMessage);

  }

  return (
    <div className="chat-container">
      
      {/* 画面に表示するメッセージの一覧と、
      AIから現在届いている文章をまとめて別のパーツ（MessageList）に渡す */}
      <MessageList
        messages={messages}
        isStreaming={isLoading}
        streamingText={streamingText}
      />

      {/* Integrated Message Input Area */}
      <div className="message-input-container">
        {previewUrl && (
          <div className="image-preview-container">
            <div className="image-preview-wrapper">
              <img src={previewUrl} alt="preview" className="image-preview" />
              <button className="image-preview-close" onClick={clearFile}>
                ×
              </button>
            </div>
          </div>
        )}

        <div className="message-input-wrapper">

          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}

            // ファイルが選択されたらhandleFileSelectを呼び出す。
            onChange={handleFileSelect}

            // fileInputRefはuseRefで作った「ファイル選択欄を直接操作するための参照」。
            // この欄に結び付け、ボタンで開いたりclearFileで選択を解除したりする。
            ref={fileInputRef}
          />
          
          <button
            className="icon-button"
            // /* ボタンを押すとファイル選択欄を開き、?で欄がまだ参照できない場合のエラーを防ぐ。
            onClick={() => fileInputRef.current?.click()}
            title="画像をアップロード"
          >
            <HiOutlinePhoto size={24} />
          </button>
          
          <textarea
            className="message-input"
            placeholder="AIにメッセージを送信する..."
            rows={1}
            onChange={(e) => setInputText(e.target.value)}
            value={inputText}
          />
          <button className="send-button" 
            onClick={handleSend}

            // APIが通信中(isLoadingがtrue)、または入力欄が空白の場合は送信ボタンを無効化する
            disabled={isLoading || (!inputText.trim())}
          >
            <HiOutlinePaperAirplane size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
