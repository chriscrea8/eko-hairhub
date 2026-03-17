"use client";

import Link from "next/link";
import { Users, Scissors, Calendar, DollarSign, ShieldCheck, AlertTriangle, TrendingUp, CheckCircle, XCircle, Eye, LayoutDashboard, UserCheck, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MOCK_BOOKINGS, MOCK_STYLISTS } from "@/lib/mock-data";
import { formatCurrency, formatDate, getInitials, getStatusColor } from "@/lib/utils";

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/verification', icon: UserCheck, label: 'Verification' },
  { href: '/admin/bookings-overview', icon: Calendar, label: 'Bookings' },
];

export default function AdminDashboard() {
  const totalRevenue = MOCK_BOOKINGS.filter(b => b.status === 'COMPLETED').reduce((s, b) => s + b.totalAmount, 0);
  const platformRevenue = totalRevenue * 0.1;
  const pendingVerification = MOCK_STYLISTS.filter(s => !s.isVerified);

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
        <Badge variant="destructive" className="text-xs">Admin Panel</Badge>
        <div className="ml-auto flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white relative">
            <Bell className="w-4 h-4" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <Avatar className="w-9 h-9">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="pt-16 flex">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-56 flex-shrink-0 hidden lg:block">
              <div className="card-dark rounded-2xl p-4 sticky top-24">
                <p className="text-white/30 text-xs font-medium px-3 mb-3 uppercase tracking-wider">Admin Menu</p>
                <nav className="space-y-1">
                  {NAV_ITEMS.map(item => (
                    <Link key={item.href} href={item.href}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        item.label === 'Dashboard' ? 'bg-gradient-brand text-white' : 'text-white/50 hover:text-white hover:bg-white/05'
                      }`}>
                        <item.icon className="w-4 h-4" />
                        {item.label}
                        {item.label === 'Verification' && pendingVerification.length > 0 && (
                          <Badge variant="warning" className="ml-auto text-xs px-1.5">{pendingVerification.length}</Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
                <p className="text-white/40 text-sm">Platform overview and management</p>
              </div>

              {/* Platform stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Users, label: 'Total Users', value: '12,847', color: 'text-blue-400', bg: 'bg-blue-500/10', change: '+234 this week' },
                  { icon: Scissors, label: 'Active Stylists', value: '523', color: 'text-brand-400', bg: 'bg-brand-500/10', change: '8 pending verification' },
                  { icon: Calendar, label: 'Total Bookings', value: '48,291', color: 'text-purple-400', bg: 'bg-purple-500/10', change: '+1,204 this month' },
                  { icon: DollarSign, label: 'Platform Revenue', value: formatCurrency(platformRevenue), color: 'text-green-400', bg: 'bg-green-500/10', change: 'From 10% commission' },
                ].map(({ icon: Icon, label, value, color, bg, change }) => (
                  <div key={label} className="card-dark rounded-2xl p-5">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
                    <p className="text-white/60 text-sm mt-1">{label}</p>
                    <p className="text-white/30 text-xs mt-1">{change}</p>
                  </div>
                ))}
              </div>

              {/* Alerts */}
              {pendingVerification.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">{pendingVerification.length} stylist(s) awaiting verification</p>
                    <p className="text-white/40 text-xs mt-0.5">Review their applications to get them live on the platform</p>
                  </div>
                  <Link href="/admin/verification" className="ml-auto flex-shrink-0">
                    <Button size="sm" variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 text-xs">
                      Review Now
                    </Button>
                  </Link>
                </div>
              )}

              {/* Main content tabs */}
              <Tabs defaultValue="bookings">
                <TabsList className="mb-6">
                  <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
                  <TabsTrigger value="stylists">Stylists</TabsTrigger>
                  <TabsTrigger value="users">Recent Users</TabsTrigger>
                </TabsList>

                <TabsContent value="bookings">
                  <div className="card-dark rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/06 flex items-center justify-between">
                      <h3 className="text-white font-medium">All Bookings</h3>
                      <Link href="/admin/bookings-overview">
                        <Button variant="ghost" size="sm" className="text-xs text-brand-400">View All</Button>
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/06">
                            <th className="text-left px-5 py-3 text-white/40 text-xs">Customer</th>
                            <th className="text-left px-5 py-3 text-white/40 text-xs hidden sm:table-cell">Stylist</th>
                            <th className="text-left px-5 py-3 text-white/40 text-xs hidden md:table-cell">Service</th>
                            <th className="text-left px-5 py-3 text-white/40 text-xs">Status</th>
                            <th className="text-right px-5 py-3 text-white/40 text-xs">Amount</th>
                            <th className="px-5 py-3 text-white/40 text-xs"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {MOCK_BOOKINGS.map(b => (
                            <tr key={b.id} className="border-b border-white/04 last:border-0 hover:bg-white/02">
                              <td className="px-5 py-4 text-white text-sm">{b.customer.fullName}</td>
                              <td className="px-5 py-4 text-white/60 text-sm hidden sm:table-cell">{b.stylist.user.fullName}</td>
                              <td className="px-5 py-4 text-white/60 text-sm hidden md:table-cell">{b.service.name}</td>
                              <td className="px-5 py-4">
                                <Badge className={`${getStatusColor(b.status)} text-xs`}>{b.status}</Badge>
                              </td>
                              <td className="px-5 py-4 text-right text-white text-sm font-semibold">{formatCurrency(b.totalAmount)}</td>
                              <td className="px-5 py-4">
                                <button className="text-white/30 hover:text-white transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stylists">
                  <div className="space-y-4">
                    {MOCK_STYLISTS.map(stylist => (
                      <div key={stylist.id} className="card-dark rounded-xl p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarFallback>{getInitials(stylist.user.fullName)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium text-sm">{stylist.user.fullName}</p>
                              {stylist.isVerified ? (
                                <Badge variant="success" className="text-xs gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Verified</Badge>
                              ) : (
                                <Badge variant="warning" className="text-xs">Pending</Badge>
                              )}
                            </div>
                            <p className="text-white/40 text-xs">{stylist.area} • {stylist.specialties.join(', ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right hidden sm:block mr-4">
                            <p className="text-white text-sm font-semibold">{stylist.rating}★</p>
                            <p className="text-white/30 text-xs">{stylist.reviewCount} reviews</p>
                          </div>
                          {!stylist.isVerified && (
                            <>
                              <Button size="sm" className="gap-1 text-xs bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-3 h-3" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="gap-1 text-xs text-red-400 border-red-500/20">
                                <XCircle className="w-3 h-3" /> Reject
                              </Button>
                            </>
                          )}
                          <button className="text-white/30 hover:text-white ml-1">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="users">
                  <div className="card-dark rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/06">
                            <th className="text-left px-5 py-3 text-white/40 text-xs">User</th>
                            <th className="text-left px-5 py-3 text-white/40 text-xs hidden sm:table-cell">Email</th>
                            <th className="text-left px-5 py-3 text-white/40 text-xs">Role</th>
                            <th className="text-left px-5 py-3 text-white/40 text-xs hidden md:table-cell">Joined</th>
                            <th className="px-5 py-3 text-white/40 text-xs">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...MOCK_STYLISTS.map(s => s.user), ...MOCK_BOOKINGS.map(b => b.customer)].slice(0, 6).map((user, i) => (
                            <tr key={i} className="border-b border-white/04 last:border-0 hover:bg-white/02">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-7 h-7">
                                    <AvatarFallback className="text-xs">{getInitials(user.fullName)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-white text-sm">{user.fullName}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-white/50 text-sm hidden sm:table-cell">{user.email}</td>
                              <td className="px-5 py-4">
                                <Badge variant={user.role === 'STYLIST' ? 'default' : 'secondary'} className="text-xs">{user.role}</Badge>
                              </td>
                              <td className="px-5 py-4 text-white/40 text-xs hidden md:table-cell">{formatDate(user.createdAt)}</td>
                              <td className="px-5 py-4">
                                <button className="text-white/30 hover:text-red-400 transition-colors text-xs">Suspend</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
