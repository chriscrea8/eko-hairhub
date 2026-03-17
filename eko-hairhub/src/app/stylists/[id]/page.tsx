"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Shield, Home, Clock, ArrowLeft, Phone, Instagram, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MOCK_STYLISTS } from "@/lib/mock-data";
import { formatCurrency, formatDuration, DAY_NAMES } from "@/lib/utils";

export default function StylistProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedTab, setSelectedTab] = useState("portfolio");

  const stylist = MOCK_STYLISTS.find(s => s.id === id) || MOCK_STYLISTS[0];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative">
          {/* Background portfolio banner */}
          <div className="h-72 md:h-80 relative overflow-hidden">
            <div className="grid grid-cols-4 h-full">
              {[...stylist.portfolioImages, ...stylist.portfolioImages].slice(0, 4).map((img, i) => (
                <div key={i} className="relative overflow-hidden">
                  <Image src={img.url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-surface" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />
          </div>

          {/* Back button */}
          <div className="absolute top-6 left-4 sm:left-8">
            <Link href="/stylists">
              <Button variant="ghost" size="sm" className="gap-2 glass">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-surface shadow-2xl flex-shrink-0">
              <Image
                src={stylist.user.avatar || ''}
                alt={stylist.user.fullName}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-white">{stylist.user.fullName}</h1>
                {stylist.isVerified && (
                  <Badge variant="success" className="gap-1">
                    <Shield className="w-3 h-3" /> Verified Pro
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-white/50 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {stylist.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                  <span className="text-gold-400 font-medium text-white">{stylist.rating}</span>
                  <span>({stylist.reviewCount} reviews)</span>
                </div>
                {stylist.yearsExperience && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {stylist.yearsExperience} years experience
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {stylist.specialties.map(s => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
                {stylist.offersHomeService && (
                  <Badge variant="default" className="gap-1">
                    <Home className="w-3 h-3" /> Home Service +{formatCurrency(stylist.homeServiceFee || 0)}
                  </Badge>
                )}
              </div>

              <p className="text-white/60 text-sm leading-relaxed max-w-xl">{stylist.bio}</p>
            </div>

            {/* CTA */}
            <div className="w-full md:w-64 card-dark rounded-2xl p-5 flex-shrink-0">
              <div className="text-center mb-4">
                <p className="text-white/40 text-xs mb-1">Services starting from</p>
                <p className="text-2xl font-display font-bold text-white">
                  {formatCurrency(Math.min(...stylist.services.map(s => s.price)))}
                </p>
              </div>
              <Link href={`/book/${stylist.id}`} className="block">
                <Button className="w-full" size="lg">Book Appointment</Button>
              </Link>
              <p className="text-center text-white/30 text-xs mt-3">No booking fee • Pay at appointment</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                {stylist.portfolioImages.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                    <Image src={img.url} alt={img.hairstyleName || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {img.hairstyleName && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                        <p className="text-white text-sm font-medium">{img.hairstyleName}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="services">
              <div className="space-y-3 mb-12 max-w-2xl">
                {stylist.services.map((service) => (
                  <div key={service.id} className="card-dark rounded-xl p-5 flex items-center justify-between gap-4 hover:border-brand-500/20 transition-all group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white">{service.name}</h3>
                        <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-white/40 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(service.duration)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-lg font-bold text-white">{formatCurrency(service.price)}</p>
                      </div>
                      <Link href={`/book/${stylist.id}?service=${service.id}`}>
                        <Button size="sm">Book</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="mb-12">
                {/* Rating summary */}
                <div className="card-dark rounded-2xl p-6 mb-6 max-w-sm">
                  <div className="text-center mb-4">
                    <div className="text-5xl font-display font-bold text-white mb-1">{stylist.rating}</div>
                    <div className="flex justify-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(stylist.rating) ? 'fill-gold-400 text-gold-400' : 'text-white/20'}`} />
                      ))}
                    </div>
                    <p className="text-white/40 text-sm">{stylist.reviewCount} reviews</p>
                  </div>
                </div>

                {/* Sample reviews */}
                <div className="space-y-4 max-w-2xl">
                  {[
                    { name: 'Kemi A.', rating: 5, comment: 'Absolutely amazing! Best braids I\'ve ever had. Professional, punctual, and the results were stunning.', date: '2 weeks ago' },
                    { name: 'Tolu B.', rating: 5, comment: 'Came to do my knotless braids and I\'m obsessed! She was so careful with my edges. Will definitely rebook!', date: '1 month ago' },
                    { name: 'Aisha M.', rating: 4, comment: 'Great work overall. Took slightly longer than expected but the quality made up for it.', date: '2 months ago' },
                  ].map((review, i) => (
                    <div key={i} className="card-dark rounded-xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white text-sm font-bold">
                            {review.name[0]}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{review.name}</p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: review.rating }).map((_, j) => (
                                <Star key={j} className="w-3 h-3 fill-gold-400 text-gold-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-white/30 text-xs">{review.date}</span>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="availability">
              <div className="max-w-md mb-12">
                <div className="card-dark rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-white mb-4">Weekly Schedule</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const avail = stylist.availability?.find(a => a.dayOfWeek === dayIndex);
                      return (
                        <div key={dayIndex} className="flex items-center justify-between py-2 border-b border-white/04 last:border-0">
                          <span className="text-white/60 text-sm">{DAY_NAMES[dayIndex]}</span>
                          {avail?.isAvailable ? (
                            <span className="text-green-400 text-sm font-medium">
                              {avail.startTime} – {avail.endTime}
                            </span>
                          ) : (
                            <span className="text-white/20 text-sm">Closed</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky booking bar (mobile) */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-surface/90 backdrop-blur-lg border-t border-white/08 p-4 z-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white/40 text-xs">From</p>
              <p className="text-white font-bold">{formatCurrency(Math.min(...stylist.services.map(s => s.price)))}</p>
            </div>
            <Link href={`/book/${stylist.id}`} className="flex-1">
              <Button className="w-full">Book Appointment</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
