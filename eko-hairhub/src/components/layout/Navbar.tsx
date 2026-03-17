"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scissors, ChevronDown, User, Calendar, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

// Mock auth state - replace with real auth context
const MOCK_USER = null; // set to user object when logged in

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = MOCK_USER;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/06 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold">
              <span className="text-gradient">Eko</span>
              <span className="text-white"> HairHub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/hairstyles">
              <Button variant="ghost" size="sm">Gallery</Button>
            </Link>
            <Link href="/stylists">
              <Button variant="ghost" size="sm">Find Stylists</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 hover:bg-white/05 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={(user as any).avatar} />
                    <AvatarFallback>{getInitials((user as any).fullName)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/80">{(user as any).fullName?.split(' ')[0]}</span>
                  <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform", dropdownOpen && "rotate-180")} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 card-dark rounded-xl shadow-xl border border-white/08 overflow-hidden">
                    <div className="p-2">
                      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/05 text-sm text-white/70 hover:text-white transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/bookings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/05 text-sm text-white/70 hover:text-white transition-colors">
                        <Calendar className="w-4 h-4" /> My Bookings
                      </Link>
                      <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/05 text-sm text-white/70 hover:text-white transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <div className="border-t border-white/06 my-1" />
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-sm text-red-400 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/06 bg-surface/95 backdrop-blur-lg">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <Link href="/hairstyles" className="block px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/05 transition-colors" onClick={() => setIsOpen(false)}>
              Gallery
            </Link>
            <Link href="/stylists" className="block px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/05 transition-colors" onClick={() => setIsOpen(false)}>
              Find Stylists
            </Link>
            <Link href="/about" className="block px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/05 transition-colors" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
