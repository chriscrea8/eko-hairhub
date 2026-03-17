"use client";

import Link from "next/link";
import { DollarSign, TrendingUp, ArrowUpRight, Download, Calendar, Scissors, LayoutDashboard, User, Image as ImageIcon, Clock, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MOCK_BOOKINGS, MOCK_STYLISTS } from "@/lib/mock-data";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

const stylist = MOCK_STYLISTS[0];

const MONTHLY_DATA = [
  { month: 'Aug', amount: 45000 },
  { month: 'Sep', amount: 62000 },
  { month: 'Oct', amount: 58000 },
  { month: 'Nov', amount: 75000 },
  { month: 'Dec', amount: 91000 },
  { month: 'Jan', amount: 83000 },
];

const maxAmount = Math.max(...MONTHLY_DATA.map(d => d.amount));

const NAV_ITEMS = [
  { href: '/stylist-dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/stylist-dashboard/profile', icon: User, label: 'My Profile' },
  { href: '/stylist-dashboard/portfolio', icon: ImageIcon, label: 'Portfolio' },
  { href: '/stylist-dashboard/services', icon: Scissors, label: 'Services' },
  { href: '/stylist-dashboard/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/stylist-dashboard/availability', icon: Clock, label: 'Availability' },
  { href: '/stylist-dashboard/earnings', icon: DollarSign, label: 'Earnings' },
];

export default function EarningsPage() {
  const completedBookings = MOCK_BOOKINGS.filter(b => b.status === 'COMPLETED');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformFee = totalEarnings * 0.1; // 10% platform fee
  const netEarnings = totalEarnings - platformFee;

  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/06 glass h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2.5 mr-8">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Scissors className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold">
            <span className="text-gradient">Eko</span><span className="text-white"> HairHub</span>
          </span>
        </Link>
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
            {/* Sidebar */}
            <aside className="w-60 flex-shrink-0 hidden lg:block">
              <div className="card-dark rounded-2xl p-4 sticky top-24">
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
                        item.label === 'Earnings'
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

            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display text-3xl font-bold text-white mb-1">Earnings</h1>
                  <p className="text-white/40 text-sm">Track your revenue and payouts</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                  <Download className="w-4 h-4" /> Export Report
                </Button>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Gross Earnings', value: formatCurrency(totalEarnings), icon: DollarSign, color: 'text-white', bg: 'bg-white/08', sub: 'All time' },
                  { label: 'Platform Fee (10%)', value: formatCurrency(platformFee), icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/10', sub: 'Deducted' },
                  { label: 'Net Earnings', value: formatCurrency(netEarnings), icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', sub: 'Your take-home' },
                ].map(({ label, value, icon: Icon, color, bg, sub }) => (
                  <div key={label} className="card-dark rounded-2xl p-5">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
                    <p className="text-white/60 text-sm mt-1">{label}</p>
                    <p className="text-white/30 text-xs">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="card-dark rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-semibold text-white">Monthly Revenue</h2>
                  <Badge variant="success" className="gap-1">
                    <TrendingUp className="w-3 h-3" /> +18% vs last month
                  </Badge>
                </div>

                {/* Bar chart */}
                <div className="flex items-end gap-3 h-40">
                  {MONTHLY_DATA.map((data, i) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-white/40 text-xs">{formatCurrency(data.amount).replace('₦', '₦').replace(',000', 'k')}</span>
                      <div className="w-full relative group">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${i === MONTHLY_DATA.length - 1 ? 'bg-gradient-brand' : 'bg-white/10 group-hover:bg-white/20'}`}
                          style={{ height: `${(data.amount / maxAmount) * 120}px` }}
                        />
                      </div>
                      <span className="text-white/50 text-xs">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction history */}
              <div>
                <h2 className="font-display text-xl font-semibold text-white mb-4">Transaction History</h2>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <div className="card-dark rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/06">
                              <th className="text-left px-5 py-3 text-white/40 text-xs">Client</th>
                              <th className="text-left px-5 py-3 text-white/40 text-xs hidden sm:table-cell">Service</th>
                              <th className="text-left px-5 py-3 text-white/40 text-xs hidden md:table-cell">Date</th>
                              <th className="text-left px-5 py-3 text-white/40 text-xs">Reference</th>
                              <th className="text-right px-5 py-3 text-white/40 text-xs">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {MOCK_BOOKINGS.filter(b => b.payment).map(booking => (
                              <tr key={booking.id} className="border-b border-white/04 last:border-0 hover:bg-white/02">
                                <td className="px-5 py-4 text-white text-sm font-medium">{booking.customer.fullName}</td>
                                <td className="px-5 py-4 text-white/60 text-sm hidden sm:table-cell">{booking.service.name}</td>
                                <td className="px-5 py-4 text-white/60 text-sm hidden md:table-cell">{booking.payment?.paidAt ? formatDate(booking.payment.paidAt) : '-'}</td>
                                <td className="px-5 py-4">
                                  <span className="text-white/40 text-xs font-mono">{booking.payment?.reference}</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                  <span className={`font-semibold text-sm ${booking.payment?.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {formatCurrency(booking.totalAmount)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
