"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, Filter, Home, Shield, X, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_STYLISTS, LAGOS_AREAS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const SPECIALTIES = ['All', 'Braids', 'Natural Hair', 'Barbering', 'Locs', 'Weaves', 'Wigs', 'Twists'];

export default function StylistsPage() {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("all");
  const [specialty, setSpecialty] = useState("All");
  const [homeServiceOnly, setHomeServiceOnly] = useState(false);

  const filtered = MOCK_STYLISTS.filter((s) => {
    const matchesSearch =
      s.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.bio.toLowerCase().includes(search.toLowerCase()) ||
      s.specialties.some(sp => sp.toLowerCase().includes(search.toLowerCase()));
    const matchesArea = area === "all" || s.area === area;
    const matchesSpecialty = specialty === "All" || s.specialties.includes(specialty);
    const matchesHome = !homeServiceOnly || s.offersHomeService;
    return matchesSearch && matchesArea && matchesSpecialty && matchesHome;
  });

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="relative py-20 border-b border-white/04 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/08 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">500+ Stylists</Badge>
            <h1 className="font-display text-5xl font-bold text-white mb-4">
              Find Your <span className="text-gradient">Perfect Stylist</span>
            </h1>
            <p className="text-white/40 max-w-lg mx-auto">
              Browse verified hairstylists, barbers, and salons across Lagos. Filter by location, specialty, and more.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-16 z-40 bg-surface/90 backdrop-blur-lg border-b border-white/06 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="Search by name or specialty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Area */}
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="w-full md:w-48">
                  <MapPin className="w-4 h-4 mr-2 text-white/40" />
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {LAGOS_AREAS.slice(0, 10).map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Home service toggle */}
              <button
                onClick={() => setHomeServiceOnly(!homeServiceOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  homeServiceOnly
                    ? "bg-brand-500/15 border-brand-500/30 text-brand-400"
                    : "bg-white/05 border-white/08 text-white/50 hover:text-white"
                }`}
              >
                <Home className="w-4 h-4" />
                Home Service
              </button>
            </div>

            {/* Specialty pills */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {SPECIALTIES.map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpecialty(sp)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    specialty === sp
                      ? "bg-gradient-brand text-white"
                      : "bg-white/05 text-white/40 hover:text-white border border-white/08"
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-white/30 text-sm mb-6">
            {filtered.length} stylists found
            {(search || area !== "all" || specialty !== "All" || homeServiceOnly) && (
              <button onClick={() => { setSearch(""); setArea("all"); setSpecialty("All"); setHomeServiceOnly(false); }} className="ml-3 text-brand-400 hover:underline">
                Clear filters
              </button>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((stylist) => (
              <Link href={`/stylists/${stylist.id}`} key={stylist.id}>
                <div className="card-dark rounded-2xl overflow-hidden hover:border-brand-500/20 transition-all group h-full flex flex-col">
                  {/* Portfolio strip */}
                  <div className="relative h-52 bg-surface-100 flex-shrink-0">
                    <div className="grid grid-cols-3 h-full">
                      {stylist.portfolioImages.slice(0, 3).map((img) => (
                        <div key={img.id} className="relative overflow-hidden">
                          <Image src={img.url} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-50 via-transparent to-transparent" />

                    {/* Badges overlay */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {stylist.isVerified && (
                        <Badge variant="success" className="text-xs gap-1">
                          <Shield className="w-2.5 h-2.5" /> Verified
                        </Badge>
                      )}
                    </div>
                    {stylist.offersHomeService && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="default" className="text-xs gap-1">
                          <Home className="w-2.5 h-2.5" /> Home
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-500/30 flex-shrink-0">
                        <Image
                          src={stylist.user.avatar || ''}
                          alt={stylist.user.fullName}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{stylist.user.fullName}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(stylist.rating) ? 'fill-gold-400 text-gold-400' : 'text-white/20'}`} />
                            ))}
                          </div>
                          <span className="text-white/50 text-xs">({stylist.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-white/40 text-xs mb-3">
                      <MapPin className="w-3 h-3" />
                      {stylist.location}
                    </div>

                    <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                      {stylist.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {stylist.specialties.map(s => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/06">
                      <div>
                        <span className="text-white/30 text-xs">Starting from</span>
                        <div className="text-white font-semibold text-base">
                          {formatCurrency(Math.min(...stylist.services.map(s => s.price)))}
                        </div>
                      </div>
                      <Button size="sm">View Profile</Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-white/40 text-lg mb-4">No stylists found matching your filters</p>
              <Button variant="outline" onClick={() => { setSearch(""); setArea("all"); setSpecialty("All"); setHomeServiceOnly(false); }}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
