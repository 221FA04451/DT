'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: connect to backend auth
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* header */}
      <div className="mb-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#06b6d4' }}>
          Welcome back
        </p>
        <h1 className="text-2xl font-black text-white">Sign in to your account</h1>
        <p className="text-xs text-zinc-500 mt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="hover:text-white transition-colors" style={{ color: '#06b6d4' }}>
            Register
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* email */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
            style={{ background: '#111111', border: '1px solid #ffffff12' }}
          />
        </div>

        {/* password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Password
            </label>
            <Link href="#" className="text-[10px] text-zinc-500 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
            style={{ background: '#111111', border: '1px solid #ffffff12' }}
          />
        </div>

        {/* submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all mt-2"
          style={{ background: '#06b6d4', color: '#000', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
