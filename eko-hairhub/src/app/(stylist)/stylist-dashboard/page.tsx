"use client";

import Link from "next/link";
import Image from "next/image";
import { DollarSign, Calendar, Star, Users, TrendingUp, CheckCircle, XCircle, Clock, ArrowRight, LayoutDashboard, User, Image as ImageIcon, Scissors, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_BOOKINGS, MOCK_STYLISTS } from "@/lib/mock-data";
import { formatCurrency, formatDate, getInitials, getStatusColor } from "@/lib/utils";

const stylist = MOCK_STYLISTS[0];
const bookings = MOCK_BOOKINGS;

const NAV_ITEMS = [
  { href: '/stylist-dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/stylist-dashboard/profile', icon: User, label: 'My Profile' },
  { href: '/stylist-dashboard/portfolio', icon: ImageIcon, label: 'Portfolio' },
  { href: '/stylist-dashboard/services', icon: Scissors, label: 'Services' },
  { href: '/stylist-dashboard/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/stylist-dashboard/availability', icon: Clock, label: 'Availability' },
  { href: '/stylist-dashboard/earnings', icon: DollarSign, label: 'Earnings' },
];

function StylistSidebar({ active }: { active: string }) {
  return (
    <aside className="w-60 flex-shrink-0 hidden lg:block">
      <div className="card-dark rounded-2xl p-4 sticky top-24">
        {/* Profile mini */}
        <div className="flex items-center gap-3 p-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={stylist.user.avatar} />
            <AvatarFallback>{getInitials(stylist.user.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white text-sm font-medium">{stylist.user.fullName}</p>
            <Badge variant="success" className="text-xs">Verified</Badge>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active === item.label
                  ? 'bg-gradient-brand text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/05'
              }`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default function StylistDashboard() {
  const totalEarnings = bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/06 glass h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2.5 mr-8">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Scissors className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold">
            <span className="text-gradient">Eko</span><span className="text-white"> HairHub</span>
          </span>
        </Link>
        <span className="text-white/30 text-sm hidden sm:block">Stylist Dashboard</span>
        <div className="ml-auto flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white">
            <Bell className="w-4 h-4" />
          </button>
          <Avatar className="w-9 h-9">
            <AvatarImage src={stylist.user.avatar} />
            <AvatarFallback>{getInitials(stylist.user.fullName)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="pt-16 flex">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex gap-8">
            <StylistSidebar active="Overview" />

            {/* Main content */}
            <main className="flex-1 min-w-0">
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-white mb-1">
                  Good morning, {stylist.user.fullName.split(' ')[0]}! ✂️
                </h1>
                <p className="text-white/40 text-sm">Here's what's happening with your business today</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: DollarSign, label: 'Total Earnings', value: formatCurrency(totalEarnings), color: 'text-green-400', bg: 'bg-green-500/10', trend: '+12% this month' },
                  { icon: Calendar, label: 'Total Bookings', value: bookings.length, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: `${pendingBookings.length} pending` },
                  { icon: Star, label: 'Rating', value: `${stylist.rating}★`, color: 'text-gold-400', bg: 'bg-gold-500/10', trend: `${stylist.reviewCount} reviews` },
                  { icon: Users, label: 'Repeat Clients', value: '43%', color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+5% vs last month' },
                ].map(({ icon: Icon, label, value, color, bg, trend }) => (
                  <div key={label} className="card-dark rounded-2xl p-5">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
                    <p className="text-white/60 text-sm mt-1">{label}</p>
                    <p className="text-white/30 text-xs mt-1">{trend}</p>
                  </div>
                ))}
              </div>

              {/* Pending bookings - action required */}
              {pendingBookings.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-display text-xl font-semibold text-white">Action Required</h2>
                    <Badge variant="warning">{pendingBookings.length} pending</Badge>
                  </div>
                  <div className="space-y-3">
                    {pendingBookings.map(booking => (
                      <div key={booking.id} className="card-dark rounded-xl p-4 border-yellow-500/20 border">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <AvatarFallback>{getInitials(booking.customer.fullName)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-white font-medium truncate">{booking.customer.fullName}</p>
                              <p className="text-white/50 text-sm">{booking.service.name} • {formatDate(booking.scheduledAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-white font-semibold text-sm hidden sm:block">{formatCurrency(booking.totalAmount)}</span>
                            <Button size="sm" className="gap-1.5 text-xs bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-3.5 h-3.5" /> Accept
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs text-red-400 border-red-500/20">
                              <XCircle className="w-3.5 h-3.5" /> Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All bookings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-white">Recent Bookings</h2>
                  <Link href="/stylist-dashboard/bookings">
                    <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
                      View all <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="card-dark rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/06">
                          <th className="text-left px-5 py-3 text-white/40 text-xs font-medium">Client</th>
                          <th className="text-left px-5 py-3 text-white/40 text-xs font-medium hidden sm:table-cell">Service</th>
                          <th className="text-left px-5 py-3 text-white/40 text-xs font-medium hidden md:table-cell">Date</th>
                          <th className="text-left px-5 py-3 text-white/40 text-xs font-medium">Status</th>
                          <th className="text-right px-5 py-3 text-white/40 text-xs font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(booking => (
                          <tr key={booking.id} className="border-b border-white/04 last:border-0 hover:bg-white/02 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">{getInitials(booking.customer.fullName)}</AvatarFallback>
                                </Avatar>
                                <span className="text-white text-sm font-medium">{booking.customer.fullName}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-white/60 text-sm hidden sm:table-cell">{booking.service.name}</td>
                            <td className="px-5 py-4 text-white/60 text-sm hidden md:table-cell">{formatDate(booking.scheduledAt)}</td>
                            <td className="px-5 py-4">
                              <Badge className={`${getStatusColor(booking.status)} text-xs`}>{booking.status}</Badge>
                            </td>
                            <td className="px-5 py-4 text-right text-white font-semibold text-sm">
                              {formatCurrency(booking.totalAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
