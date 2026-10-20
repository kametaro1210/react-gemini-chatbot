import { GoogleGenerativeAI, type Content } from '@google/generative-ai';

// 環境変数（Viteの仕組み）からGeminiのAPIキーを取得する
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

// GoogleGenerativeAIのインスタンスをAPIキーを使って初期化する
const genAi = new GoogleGenerativeAI(API_KEY);

// 使用するモデルの設定とインスタンスのエクスポート
const model = genAi.getGenerativeModel({

  // 使用するGeminiのモデル名を指定
  model: 'gemini-3.5-flash-lite',

  // ほかのモデルに切り替えたい場合はコメントアウトを切り替えて使用する
  // model: 'gemini-3.5-flash',
  // model: 'gemini-3.5-pro',
});

/*
  Geminiチャットセッションの作成処理

  【目的】
  引数で受け取った会話履歴をもとに、Geminiのチャットセッションを作成する。

  【処理フロー】
  1. 会話履歴をGeminiのstartChatに渡してチャットセッションを作成する。
  2. 作成したチャットセッションを呼び出し元に返す。
*/

// ---------------------------------------------------------

export const startChatSession = (history: Content[]) => {
  return model.startChat({ history });
};

/*
  会話タイトルの生成処理

  【目的】
  引数で受け取ったメッセージをもとに、Geminiで15文字以内の会話タイトルを生成する。

  【処理フロー】
  1. メッセージを含め、タイトルのみを返すよう指示するプロンプトを作成する。
  2. generateContentでプロンプトをGeminiに送信し、指示に沿ったタイトルを生成させる。
      Memo : generateContentは、入力されたプロンプトをもとにGeminiにコンテンツを生成させ、
              その生成結果を応答として受け取るメソッド。
  3. 受け取った応答から生成テキストを取り出して返す。
*/

// ---------------------------------------------------------

export const generateConversationTitle = async (message: string) => {
  const prompt = `以下のメッセージに対する会話のタイトルを15文字以内で生成してください。タイトルのみを返してください。\n\nメッセージ:${message}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};