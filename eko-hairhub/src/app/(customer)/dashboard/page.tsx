"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Star, ArrowRight, Scissors, MapPin, Bell, Search, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_BOOKINGS, MOCK_STYLISTS, MOCK_HAIRSTYLES } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor, getInitials } from "@/lib/utils";

const MOCK_CUSTOMER = { fullName: "Kemi Adeleke", email: "kemi@email.com", avatar: "" };

export default function CustomerDashboard() {
  const upcomingBookings = MOCK_BOOKINGS.filter(b => b.status === 'ACCEPTED' || b.status === 'PENDING');
  const recentBookings = MOCK_BOOKINGS.filter(b => b.status === 'COMPLETED');
  const suggestedStylists = MOCK_STYLISTS.slice(0, 3);
  const trendingStyles = MOCK_HAIRSTYLES.slice(0, 4);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-white/40 text-sm mb-1">Good morning ☀️</p>
              <h1 className="font-display text-3xl font-bold text-white">
                Hey, {MOCK_CUSTOMER.fullName.split(' ')[0]}!
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <Bell className="w-4.5 h-4.5" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500" />
              </button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={MOCK_CUSTOMER.avatar} />
                <AvatarFallback>{getInitials(MOCK_CUSTOMER.fullName)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { href: '/hairstyles', icon: Scissors, label: 'Browse Styles', color: 'from-brand-500 to-brand-600' },
              { href: '/stylists', icon: Search, label: 'Find Stylists', color: 'from-gold-500 to-gold-600' },
              { href: '/bookings', icon: Calendar, label: 'My Bookings', color: 'from-purple-500 to-purple-600' },
              { href: '/stylists', icon: TrendingUp, label: 'Trending Now', color: 'from-green-500 to-teal-600' },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link key={label} href={href}>
                <div className="card-dark rounded-2xl p-5 hover:border-white/15 transition-all group cursor-pointer h-full">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white text-sm font-medium">{label}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming bookings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-white">Upcoming Appointments</h2>
                  <Link href="/bookings">
                    <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
                      View all <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                {upcomingBookings.length === 0 ? (
                  <div className="card-dark rounded-2xl p-8 text-center">
                    <Calendar className="w-8 h-8 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm mb-4">No upcoming appointments</p>
                    <Link href="/stylists">
                      <Button size="sm">Book an Appointment</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.map(booking => (
                      <div key={booking.id} className="card-dark rounded-2xl p-5 hover:border-brand-500/20 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={booking.stylist.user.avatar || ''} alt="" width={48} height={48} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-white font-semibold">{booking.stylist.user.fullName}</h3>
                                <p className="text-white/50 text-sm">{booking.service.name}</p>
                              </div>
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-white/30 text-xs">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(booking.scheduledAt)}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(booking.scheduledAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.locationType === 'SALON' ? 'Salon' : 'Home'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent completed */}
              {recentBookings.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-white mb-4">Recent Visits</h2>
                  <div className="space-y-3">
                    {recentBookings.map(booking => (
                      <div key={booking.id} className="card-dark rounded-2xl p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={booking.stylist.user.avatar || ''} alt="" width={48} height={48} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{booking.stylist.user.fullName}</h3>
                            <p className="text-white/50 text-sm">{booking.service.name} • {formatDate(booking.scheduledAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold text-sm">{formatCurrency(booking.totalAmount)}</p>
                            {booking.review ? (
                              <div className="flex items-center gap-1 justify-end mt-1">
                                {Array.from({ length: booking.review.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />
                                ))}
                              </div>
                            ) : (
                              <button className="text-brand-400 text-xs hover:underline mt-1">Leave review</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Trending styles */}
              <div>
                <h2 className="font-display text-xl font-semibold text-white mb-4">Trending Styles</h2>
                <div className="grid grid-cols-2 gap-2">
                  {trendingStyles.map(style => (
                    <Link key={style.id} href="/hairstyles">
                      <div className="relative aspect-square rounded-xl overflow-hidden group">
                        <Image src={style.imageUrl} alt={style.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium">{style.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Suggested stylists */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-white">Top Stylists</h2>
                  <Link href="/stylists">
                    <Button variant="ghost" size="sm" className="text-brand-400 text-xs">View all</Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {suggestedStylists.map(stylist => (
                    <Link key={stylist.id} href={`/stylists/${stylist.id}`}>
                      <div className="card-dark rounded-xl p-3 flex items-center gap-3 hover:border-brand-500/20 transition-all">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={stylist.user.avatar || ''} alt="" width={40} height={40} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{stylist.user.fullName}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                            <span className="text-white/50 text-xs">{stylist.rating} • {stylist.area}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs px-3 flex-shrink-0">Book</Button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
