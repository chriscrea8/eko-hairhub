"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors, Eye, EyeOff, ArrowRight, Loader2, User, Scissors as ScissorsIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    window.location.href = role === "STYLIST" ? "/stylist-dashboard" : "/dashboard";
  };

  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-100 to-surface-200" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(223,90,30,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 20%, rgba(232,180,32,0.1) 0%, transparent 50%)`,
        }} />

        {/* Decorative circles */}
        <div className="absolute -right-20 top-1/4 w-80 h-80 rounded-full border border-brand-500/10" />
        <div className="absolute -right-10 top-1/4 w-60 h-60 rounded-full border border-brand-500/15" />
        <div className="absolute -right-2 top-1/4 w-40 h-40 rounded-full border border-brand-500/20" />

        <div className="relative flex flex-col justify-center p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-bold">
              <span className="text-gradient">Eko</span><span className="text-white"> HairHub</span>
            </span>
          </Link>

          <h2 className="font-display text-4xl font-bold text-white mb-4">Join Lagos's Biggest Hair Community</h2>
          <p className="text-white/50 mb-10">Whether you're looking for a stylist or you ARE the stylist — we've got you.</p>

          <div className="space-y-4">
            {[
              'Discover 500+ verified stylists across Lagos',
              'Book appointments in under 2 minutes',
              'Pay securely with Paystack',
              'Home service available in your area',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-400" />
                </div>
                <span className="text-white/60 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold">
              <span className="text-gradient">Eko</span><span className="text-white"> HairHub</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-white/40 mb-8">Join thousands of hair lovers in Lagos</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {([
              { role: 'CUSTOMER', label: 'I need a stylist', icon: User, desc: 'Browse and book' },
              { role: 'STYLIST', label: 'I am a stylist', icon: ScissorsIcon, desc: 'Grow my business' },
            ] as const).map((opt) => (
              <button
                key={opt.role}
                type="button"
                onClick={() => setRole(opt.role)}
                className={`relative p-4 rounded-xl border text-left transition-all ${
                  role === opt.role
                    ? 'border-brand-500/50 bg-brand-500/10'
                    : 'border-white/08 hover:border-white/15 bg-white/03'
                }`}
              >
                {role === opt.role && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <opt.icon className={`w-5 h-5 mb-2 ${role === opt.role ? 'text-brand-400' : 'text-white/40'}`} />
                <p className={`text-sm font-semibold ${role === opt.role ? 'text-white' : 'text-white/60'}`}>{opt.label}</p>
                <p className="text-xs text-white/30 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Amaka Okonkwo"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
              <Label htmlFor="phone">Phone Number <span className="text-white/20">(optional)</span></Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(level => (
                      <div key={level} className={`h-1 flex-1 rounded-full transition-all ${passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <span className={`text-xs ${strengthColors[passwordStrength].replace('bg-', 'text-')}`}>{strengthLabels[passwordStrength]}</span>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full gap-2 mt-2" size="lg" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Creating account..." : `Create ${role === 'STYLIST' ? 'Stylist' : 'Customer'} Account`}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>

            <p className="text-center text-white/30 text-xs">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-brand-400 hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-400 hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
