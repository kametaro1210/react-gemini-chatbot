
// Axiosライブラリを読み込み、HTTP通信を行えるようにする
import axios from 'axios';

import { addAuthorizationHeader } from './interceptors/request';

// 環境変数からAPIのベースURLを取得して定数に格納する
const baseURL = import.meta.env.VITE_API_URL;

// APIの接続先を固定し、ベースURLを固定した専用の通信クライアントを作る
const api = axios.create({ baseURL });

// バックエンドへ送信するデータの形式をJSONに統一するため、共通のヘッダーを設定する
api.defaults.headers.common['Content-Type'] = 'application/json';

// Axiosのリクエストインターセプターを設定し、
// APIリクエスト送信前に認証トークンを自動で付与する
api.interceptors.request.use(addAuthorizationHeader);


export default api;

