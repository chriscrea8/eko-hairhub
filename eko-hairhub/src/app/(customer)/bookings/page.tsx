"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Star, MessageSquare, RefreshCw, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MOCK_BOOKINGS } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import type { Booking } from "@/types";

function BookingCard({ booking }: { booking: Booking }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="card-dark rounded-2xl p-5 hover:border-white/10 transition-all">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Stylist info */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={booking.stylist.user.avatar || ''} alt="" width={56} height={56} className="object-cover w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-white font-semibold">{booking.stylist.user.fullName}</h3>
              <Badge className={`${getStatusColor(booking.status)} flex-shrink-0`}>{booking.status}</Badge>
            </div>
            <p className="text-white/60 text-sm">{booking.service.name}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-white/30 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />{formatDate(booking.scheduledAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />{new Date(booking.scheduledAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />{booking.locationType === 'SALON' ? 'Salon Visit' : 'Home Service'}
              </span>
            </div>
          </div>
        </div>

        {/* Amount + actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="text-white font-bold text-lg">{formatCurrency(booking.totalAmount)}</p>
            {booking.payment && (
              <p className="text-green-400 text-xs">Paid ✓</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {booking.status === 'COMPLETED' && !booking.review && (
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setShowReviewForm(!showReviewForm)}>
                <Star className="w-3 h-3" /> Review
              </Button>
            )}
            {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
              <Button size="sm" variant="outline" className="gap-1.5 text-xs text-red-400 border-red-500/20 hover:bg-red-500/10">
                <X className="w-3 h-3" /> Cancel
              </Button>
            )}
            {booking.status === 'COMPLETED' && (
              <Link href={`/book/${booking.stylist.id}`}>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <RefreshCw className="w-3 h-3" /> Rebook
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Existing review */}
      {booking.review && (
        <div className="mt-4 pt-4 border-t border-white/06">
          <div className="flex items-start gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < booking.review!.rating ? 'fill-gold-400 text-gold-400' : 'text-white/10'}`} />
              ))}
            </div>
            <p className="text-white/50 text-xs italic">"{booking.review.comment}"</p>
          </div>
        </div>
      )}

      {/* Review form */}
      {showReviewForm && !booking.review && (
        <div className="mt-4 pt-4 border-t border-white/06">
          <h4 className="text-white text-sm font-medium mb-3">Leave a Review</h4>
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} onClick={() => setRating(i + 1)}>
                <Star className={`w-6 h-6 transition-colors ${i < rating ? 'fill-gold-400 text-gold-400' : 'text-white/20 hover:text-gold-400'}`} />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/04 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none mb-3"
          />
          <div className="flex gap-2">
            <Button size="sm" disabled={rating === 0}>Submit Review</Button>
            <Button size="sm" variant="outline" onClick={() => setShowReviewForm(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const pending = MOCK_BOOKINGS.filter(b => b.status === 'PENDING');
  const upcoming = MOCK_BOOKINGS.filter(b => b.status === 'ACCEPTED');
  const completed = MOCK_BOOKINGS.filter(b => b.status === 'COMPLETED');
  const cancelled = MOCK_BOOKINGS.filter(b => b.status === 'CANCELLED');

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">My Bookings</h1>
            <p className="text-white/40">Track and manage all your hair appointments</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: MOCK_BOOKINGS.length, color: 'text-white' },
              { label: 'Completed', value: completed.length, color: 'text-green-400' },
              { label: 'Upcoming', value: upcoming.length + pending.length, color: 'text-brand-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card-dark rounded-xl p-4 text-center">
                <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
                <p className="text-white/40 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({MOCK_BOOKINGS.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({upcoming.length + pending.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {MOCK_BOOKINGS.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="w-10 h-10 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 mb-4">No bookings yet</p>
                    <Link href="/stylists"><Button>Book Your First Appointment</Button></Link>
                  </div>
                ) : MOCK_BOOKINGS.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            </TabsContent>

            <TabsContent value="upcoming">
              <div className="space-y-4">
                {[...upcoming, ...pending].length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-white/40 mb-4">No upcoming appointments</p>
                    <Link href="/stylists"><Button>Book an Appointment</Button></Link>
                  </div>
                ) : [...upcoming, ...pending].map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4">
                {completed.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-white/40">No completed appointments</p>
                  </div>
                ) : completed.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
