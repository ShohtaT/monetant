"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      }
      setMessage("サインアップ成功！メールを確認してください。");
    } catch (error) {
      setMessage(`エラー: ${error}`);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-geist">
      <h1 className="text-2xl font-bold mb-4">サインアップ</h1>
      
      <form onSubmit={onSignUp} className="w-full max-w-md flex flex-col gap-4">
        <input
          type="email"
          placeholder="メールアドレス"
          className="border p-3 rounded-md w-full text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          className="border p-3 rounded-md w-full text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600"
        >
          サインアップ
        </button>
      </form>
      
      {message && (
        <p className="mt-4 text-sm text-center text-red-500">{message}</p>
      )}
    </div>
  );
}
