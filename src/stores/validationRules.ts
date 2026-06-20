//YYYY-MM-DD形式
const today = new Date().toISOString().split("T")[0];

// タスク名
export const nameRules = [
  (v: string) => !!v || "タスク名を入力してください",
  (v: string) => v.length <= 50 || "タスク名は50文字以内で入力してください",
];

// タスク内容
export const contentRules = [
  (v: string) => !!v || "タスク内容を入力してください",
  (v: string) => v.length <= 255 || "タスク内容は255文字以内で入力してください",
];

// 期限（今日以降）
export const limitRules = [
  (v: string) => !!v || "期限を入力してください",
  (v: string) => v >= today || "期限は今日以降の日付を選んでください",
];

// メールアドレス
export const emailRules = [
  (v: string) => !!v || "メールアドレスを入力してください",
  (v: string) => /.+@.+\..+/.test(v) || "メールアドレスの形式が正しくありません",
];

// パスワード
export const passwordRules = [
  (v: string) => !!v || "パスワードを入力してください",
  (v: string) => v.length >= 6 || "パスワードは6文字以上で入力してください",
];

// 必須のみ（ログインのメール・パスワードなど緩いチェック用）
export const requiredRule = [
  (v: string) => !!v || "入力してください",
];

// 進行度のバリデーション（0〜100の範囲のみ許可）
export const progressRules = [
  (v: any) => v !== null && v !== "" || "進行度を入力してください",
  (v: any) => (Number(v) >= 0 && Number(v) <= 100) || "進行度は0〜100の範囲で入力してください",
];