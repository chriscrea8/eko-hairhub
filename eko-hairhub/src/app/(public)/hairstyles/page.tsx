"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_HAIRSTYLES, HAIR_CATEGORIES } from "@/lib/mock-data";

export default function HairstylesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = MOCK_HAIRSTYLES.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || h.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="relative py-20 overflow-hidden border-b border-white/04">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-500/08 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Inspiration Gallery</Badge>
            <h1 className="font-display text-5xl font-bold text-white mb-4">
              Find Your <span className="text-gradient">Perfect Style</span>
            </h1>
            <p className="text-white/40 max-w-lg mx-auto text-lg">
              Browse hundreds of hairstyles, from braids to fades — find your look and book the right stylist.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-16 z-40 bg-surface/90 backdrop-blur-lg border-b border-white/06 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="Search hairstyles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category filters */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {HAIR_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-gradient-brand text-white shadow-lg shadow-brand-500/20"
                        : "bg-white/05 text-white/50 hover:bg-white/08 hover:text-white border border-white/08"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/40 text-lg">No hairstyles found for "{search}"</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-white/30 text-sm mb-6">{filtered.length} styles found</p>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {filtered.map((style) => (
                  <div
                    key={style.id}
                    className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer card-dark"
                  >
                    <div className="relative">
                      <Image
                        src={style.imageUrl}
                        alt={style.name}
                        width={400}
                        height={400}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ height: style.popularityScore > 93 ? '280px' : '200px' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/10 transition-colors" />

                      {/* Overlay content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <Badge variant="secondary" className="text-xs mb-2">{style.category}</Badge>
                        <h3 className="font-display font-semibold text-white text-base">{style.name}</h3>
                        <p className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2">{style.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {style.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-white/30 text-xs">#{tag}</span>
                          ))}
                        </div>
                      </div>

                      {/* Hover action */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href="/stylists">
                          <Button size="sm" className="shadow-xl">
                            Book This Style
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
