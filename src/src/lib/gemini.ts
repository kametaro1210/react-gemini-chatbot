import { GoogleGenerativeAI } from '@google/generative-ai';

// 環境変数（Viteの仕組み）からGeminiのAPIキーを取得する
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

// GoogleGenerativeAIのインスタンスをAPIキーを使って初期化する
const genAi = new GoogleGenerativeAI(API_KEY);

// 使用するモデルの設定とインスタンスのエクスポート
export const model = genAi.getGenerativeModel({

  // 使用するGeminiのモデル名を指定
  model: 'gemini-3.5-flash-lite',

  // ほかのモデルに切り替えたい場合はコメントアウトを切り替えて使用する
  // model: 'gemini-3.5-flash',
  // model: 'gemini-3.5-pro',
});