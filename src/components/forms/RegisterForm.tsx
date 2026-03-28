'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: connect to backend auth
    setTimeout(() => {
      router.push("/login");
    }, 800);
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* header */}
      <div className="mb-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#06b6d4' }}>
          Get started
        </p>
        <h1 className="text-2xl font-black text-white">Create your account</h1>
        <p className="text-xs text-zinc-500 mt-2">
          Already have an account?{" "}
          <Link href="/login" className="hover:text-white transition-colors" style={{ color: '#06b6d4' }}>
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* name */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
            Full name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Dr. Priya Nair"
            required
            className="w-full rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
            style={{ background: '#111111', border: '1px solid #ffffff12' }}
          />
        </div>

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
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
            Password
          </label>
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
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
