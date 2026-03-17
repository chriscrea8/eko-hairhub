"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-bold text-white">Eko HairHub</span>
          </Link>

          <div>
            <blockquote className="text-white/90 font-display text-3xl font-semibold leading-snug mb-6">
              "The best place to find world-class hair talent in Lagos."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">K</div>
              <div>
                <p className="text-white font-medium">Kemi Adeleke</p>
                <p className="text-white/60 text-sm">Happy Customer, VI Lagos</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {['500+\nStylists', '12K+\nBookings', '4.9★\nRating'].map((stat, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4">
                {stat.split('\n').map((line, j) => (
                  <p key={j} className={j === 0 ? 'text-white font-display font-bold text-lg' : 'text-white/60 text-xs'}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold">
              <span className="text-gradient">Eko</span><span className="text-white"> HairHub</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/40 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-brand-400 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-brand-400 hover:underline font-medium">Create one</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-xl bg-white/03 border border-white/06">
            <p className="text-white/30 text-xs font-medium mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-white/50 font-mono">
              <p>Customer: customer@demo.com / demo123</p>
              <p>Stylist: stylist@demo.com / demo123</p>
              <p>Admin: admin@demo.com / demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
