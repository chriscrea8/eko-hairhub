"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Clock, Scissors, Calendar,
  LayoutDashboard, User, Image as ImageIcon, DollarSign, Bell
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MOCK_STYLISTS } from "@/lib/mock-data";
import { formatCurrency, formatDuration, getInitials } from "@/lib/utils";
import type { Service } from "@/types";

const stylist = MOCK_STYLISTS[0];

const CATEGORIES = ["Braids", "Natural Hair", "Locs", "Barbering", "Extensions", "Wigs", "Styling", "Treatment", "Grooming"];

const NAV_ITEMS = [
  { href: "/stylist-dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/stylist-dashboard/profile", icon: User, label: "My Profile" },
  { href: "/stylist-dashboard/portfolio", icon: ImageIcon, label: "Portfolio" },
  { href: "/stylist-dashboard/services", icon: Scissors, label: "Services" },
  { href: "/stylist-dashboard/bookings", icon: Calendar, label: "Bookings" },
  { href: "/stylist-dashboard/availability", icon: DollarSign, label: "Earnings" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(stylist.services);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", price: "", duration: "", category: "Braids",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", duration: "", category: "Braids" });
    setShowDialog(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    const newService: Service = {
      id: editing?.id || Date.now().toString(),
      stylistId: stylist.id,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      duration: parseInt(form.duration),
      category: form.category,
    };

    if (editing) {
      setServices(services.map((s) => (s.id === editing.id ? newService : s)));
    } else {
      setServices([...services, newService]);
    }
    setShowDialog(false);
  };

  const deleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

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
                  {[
                    { href: "/stylist-dashboard", icon: LayoutDashboard, label: "Overview" },
                    { href: "/stylist-dashboard/profile", icon: User, label: "My Profile" },
                    { href: "/stylist-dashboard/portfolio", icon: ImageIcon, label: "Portfolio" },
                    { href: "/stylist-dashboard/services", icon: Scissors, label: "Services" },
                    { href: "/stylist-dashboard/bookings", icon: Calendar, label: "Bookings" },
                    { href: "/stylist-dashboard/availability", icon: Clock, label: "Availability" },
                    { href: "/stylist-dashboard/earnings", icon: DollarSign, label: "Earnings" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        item.label === "Services" ? "bg-gradient-brand text-white" : "text-white/50 hover:text-white hover:bg-white/05"
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
                  <h1 className="font-display text-3xl font-bold text-white mb-1">Services</h1>
                  <p className="text-white/40 text-sm">Manage the services you offer and their pricing</p>
                </div>
                <Button onClick={openAdd} className="gap-2">
                  <Plus className="w-4 h-4" /> Add Service
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Services", value: services.length },
                  { label: "Avg. Price", value: formatCurrency(services.reduce((s, sv) => s + sv.price, 0) / services.length || 0) },
                  { label: "Avg. Duration", value: formatDuration(Math.round(services.reduce((s, sv) => s + sv.duration, 0) / services.length || 0)) },
                ].map(({ label, value }) => (
                  <div key={label} className="card-dark rounded-xl p-4 text-center">
                    <p className="text-xl font-display font-bold text-white">{value}</p>
                    <p className="text-white/40 text-xs mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Services list */}
              <div className="space-y-3">
                {services.map((service) => (
                  <div key={service.id} className="card-dark rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0">
                      <Scissors className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{service.name}</h3>
                        <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                      </div>
                      {service.description && (
                        <p className="text-white/40 text-sm line-clamp-1 mb-1">{service.description}</p>
                      )}
                      <div className="flex items-center gap-1 text-white/30 text-xs">
                        <Clock className="w-3 h-3" />
                        {formatDuration(service.duration)}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-display font-bold text-white">{formatCurrency(service.price)}</p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => openEdit(service)}
                        className="w-9 h-9 rounded-lg bg-white/05 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {services.length === 0 && (
                  <div className="card-dark rounded-2xl p-16 text-center">
                    <Scissors className="w-10 h-10 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 mb-4">No services added yet</p>
                    <Button onClick={openAdd} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Your First Service
                    </Button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input
                placeholder="e.g. Box Braids (Medium)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      form.category === cat
                        ? "bg-brand-500/15 border-brand-500/40 text-brand-400"
                        : "border-white/10 text-white/40 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₦)</Label>
                <Input
                  type="number"
                  placeholder="15000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  placeholder="180"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description <span className="text-white/20">(optional)</span></Label>
              <textarea
                placeholder="Describe what's included..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-white/04 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={!form.name || !form.price || !form.duration}
                className="flex-1"
              >
                {editing ? "Update Service" : "Add Service"}
              </Button>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
