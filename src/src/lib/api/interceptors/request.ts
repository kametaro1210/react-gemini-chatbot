import type { InternalAxiosRequestConfig } from 'axios';

/* 
    APIリクエストへの認証トークン付与処理
    
    【処理概要】
    Axiosのリクエスト送信前に割り込み（インターセプト）、
    ローカルストレージに保存されているアクセストークンを取得してリクエストヘッダーに自動で付与する。
    これにより、API通信ごとに手動で認証情報を付与する手間を省き、
    ログインが必要なエンドポイントへのアクセスを可能にする。
    
    【処理フロー】
    1. ローカルストレージから 'token' キーを使ってアクセストークンを取得する。
    2. トークンが存在しない場合は、そのままリクエスト設定（config）を返却して終了する。
    3. トークンが存在する場合は、リクエストヘッダーの Authorization に 
        'Bearer ${token}'(トークンを持っているユーザー)形式でセットする。
    4. 認証ヘッダーを追加したリクエスト設定（config）を返却する。
*/

export const addAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (!token) return config;

    config.headers.Authorization = `Bearer ${token}`;
    return config;
};