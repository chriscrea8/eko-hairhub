"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Upload, Trash2, Plus, Scissors, Calendar, LayoutDashboard,
  User, Image as ImageIcon, DollarSign, Clock, Bell
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_STYLISTS } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

const stylist = MOCK_STYLISTS[0];

const NAV_ITEMS = [
  { href: "/stylist-dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/stylist-dashboard/profile", icon: User, label: "My Profile" },
  { href: "/stylist-dashboard/portfolio", icon: ImageIcon, label: "Portfolio" },
  { href: "/stylist-dashboard/services", icon: Scissors, label: "Services" },
  { href: "/stylist-dashboard/bookings", icon: Calendar, label: "Bookings" },
  { href: "/stylist-dashboard/availability", icon: Clock, label: "Availability" },
  { href: "/stylist-dashboard/earnings", icon: DollarSign, label: "Earnings" },
];

export default function PortfolioPage() {
  const [images, setImages] = useState(stylist.portfolioImages);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // In production: upload to Cloudinary via API
    setUploading(true);
    setTimeout(() => setUploading(false), 2000);
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/06 glass h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2.5 mr-8">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Scissors className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold">
            <span className="text-gradient">Eko</span>
            <span className="text-white"> HairHub</span>
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
                  {NAV_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                          item.label === "Portfolio"
                            ? "bg-gradient-brand text-white"
                            : "text-white/50 hover:text-white hover:bg-white/05"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display text-3xl font-bold text-white mb-1">Portfolio</h1>
                  <p className="text-white/40 text-sm">
                    Showcase your best work. High-quality images attract more clients.
                  </p>
                </div>
                <Badge variant="secondary">{images.length} / 20 photos</Badge>
              </div>

              {/* Upload zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center mb-8 transition-all cursor-pointer ${
                  isDragging
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-white/10 hover:border-white/20 hover:bg-white/02"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={() => {
                    setUploading(true);
                    setTimeout(() => setUploading(false), 2000);
                  }}
                />
                <div className="w-14 h-14 rounded-2xl bg-white/05 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-white/40" />
                </div>
                <p className="text-white font-medium mb-1">
                  {isDragging ? "Drop images here" : "Drag & drop images here"}
                </p>
                <p className="text-white/40 text-sm mb-4">
                  or click to browse • PNG, JPG up to 10MB each
                </p>
                <Button size="sm" variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" /> Choose Files
                </Button>

                {uploading && (
                  <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-white/60 text-sm">Uploading to Cloudinary...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-brand-500/08 border border-brand-500/15 rounded-xl p-4 mb-8">
                <p className="text-brand-400 text-sm font-medium mb-2">📸 Portfolio Tips</p>
                <ul className="text-white/50 text-xs space-y-1">
                  <li>• Use good lighting — natural light works best for hair photography</li>
                  <li>• Show before/after for dramatic transformations</li>
                  <li>• Include a variety of styles to attract different clients</li>
                  <li>• Add captions to help clients search for specific styles</li>
                </ul>
              </div>

              {/* Portfolio grid */}
              {images.length === 0 ? (
                <div className="card-dark rounded-2xl p-16 text-center">
                  <ImageIcon className="w-10 h-10 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">No portfolio images yet. Upload your best work!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden card-dark">
                      <Image
                        src={img.url}
                        alt={img.hairstyleName || "Portfolio"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                        {/* Delete button */}
                        <button
                          onClick={() => removeImage(img.id)}
                          className="self-end w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>

                        {/* Caption */}
                        <div>
                          {img.hairstyleName && (
                            <p className="text-white text-xs font-medium">{img.hairstyleName}</p>
                          )}
                          {img.caption && (
                            <p className="text-white/60 text-xs mt-0.5">{img.caption}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add more placeholder */}
                  {images.length < 20 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/40 hover:bg-brand-500/05 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
                      <input type="file" multiple accept="image/*" className="hidden" />
                      <Plus className="w-6 h-6 text-white/20" />
                      <span className="text-white/20 text-xs">Add photo</span>
                    </label>
                  )}
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <Button className="gap-2">Save Portfolio Order</Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
