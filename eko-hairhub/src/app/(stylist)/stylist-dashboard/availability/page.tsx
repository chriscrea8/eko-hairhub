"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock, Scissors, Calendar, LayoutDashboard,
  User, Image as ImageIcon, DollarSign, Bell, Save, Home
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_STYLISTS } from "@/lib/mock-data";
import { DAY_NAMES, getInitials } from "@/lib/utils";

const stylist = MOCK_STYLISTS[0];

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
];

type DayAvailability = {
  isAvailable: boolean;
  startTime: string;
  endTime: string;
};

const DEFAULT_SCHEDULE: DayAvailability[] = [
  { isAvailable: false, startTime: "09:00", endTime: "18:00" }, // Sun
  { isAvailable: true, startTime: "09:00", endTime: "18:00" },  // Mon
  { isAvailable: true, startTime: "09:00", endTime: "18:00" },  // Tue
  { isAvailable: true, startTime: "09:00", endTime: "18:00" },  // Wed
  { isAvailable: true, startTime: "09:00", endTime: "18:00" },  // Thu
  { isAvailable: true, startTime: "09:00", endTime: "16:00" },  // Fri
  { isAvailable: true, startTime: "10:00", endTime: "14:00" },  // Sat
];

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState<DayAvailability[]>(DEFAULT_SCHEDULE);
  const [homeService, setHomeService] = useState(stylist.offersHomeService);
  const [homeServiceFee, setHomeServiceFee] = useState(stylist.homeServiceFee?.toString() || "");
  const [saved, setSaved] = useState(false);

  const toggleDay = (dayIndex: number) => {
    setSchedule(
      schedule.map((day, i) =>
        i === dayIndex ? { ...day, isAvailable: !day.isAvailable } : day
      )
    );
  };

  const updateTime = (dayIndex: number, field: "startTime" | "endTime", value: string) => {
    setSchedule(schedule.map((day, i) => (i === dayIndex ? { ...day, [field]: value } : day)));
  };

  const handleSave = () => {
    // In production: call API
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
                        item.label === "Availability" ? "bg-gradient-brand text-white" : "text-white/50 hover:text-white hover:bg-white/05"
                      }`}>
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="flex-1 min-w-0 max-w-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display text-3xl font-bold text-white mb-1">Availability</h1>
                  <p className="text-white/40 text-sm">Set your working hours and availability</p>
                </div>
              </div>

              {/* Weekly schedule */}
              <div className="card-dark rounded-2xl p-6 mb-6">
                <h2 className="font-display text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-400" />
                  Weekly Schedule
                </h2>

                <div className="space-y-3">
                  {DAY_NAMES.map((day, i) => (
                    <div
                      key={day}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                        schedule[i].isAvailable ? "bg-white/03" : "opacity-50"
                      }`}
                    >
                      {/* Toggle */}
                      <button
                        onClick={() => toggleDay(i)}
                        className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${
                          schedule[i].isAvailable ? "bg-brand-500" : "bg-white/10"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                            schedule[i].isAvailable ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>

                      {/* Day label */}
                      <span className={`w-24 text-sm font-medium flex-shrink-0 ${schedule[i].isAvailable ? "text-white" : "text-white/30"}`}>
                        {day}
                      </span>

                      {/* Time pickers */}
                      {schedule[i].isAvailable ? (
                        <div className="flex items-center gap-2 flex-1">
                          <select
                            value={schedule[i].startTime}
                            onChange={(e) => updateTime(i, "startTime", e.target.value)}
                            className="flex-1 rounded-lg border border-white/10 bg-white/05 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-500"
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t} className="bg-surface-50">{t}</option>
                            ))}
                          </select>
                          <span className="text-white/30 text-sm flex-shrink-0">to</span>
                          <select
                            value={schedule[i].endTime}
                            onChange={(e) => updateTime(i, "endTime", e.target.value)}
                            className="flex-1 rounded-lg border border-white/10 bg-white/05 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-500"
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t} className="bg-surface-50">{t}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="text-white/20 text-sm italic">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Home service settings */}
              <div className="card-dark rounded-2xl p-6 mb-6">
                <h2 className="font-display text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Home className="w-5 h-5 text-brand-400" />
                  Home Service
                </h2>

                <div className="flex items-start gap-4 mb-4">
                  <button
                    onClick={() => setHomeService(!homeService)}
                    className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 mt-0.5 ${
                      homeService ? "bg-brand-500" : "bg-white/10"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${homeService ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <div>
                    <p className="text-white font-medium">Offer home visits</p>
                    <p className="text-white/40 text-sm">Clients can request that you come to their location</p>
                  </div>
                </div>

                {homeService && (
                  <div className="ml-14 space-y-2">
                    <label className="text-white/60 text-sm">Home Service Fee (₦)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-sm">₦</span>
                      <input
                        type="number"
                        value={homeServiceFee}
                        onChange={(e) => setHomeServiceFee(e.target.value)}
                        placeholder="2500"
                        className="w-32 rounded-xl border border-white/10 bg-white/04 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <p className="text-white/30 text-xs">This fee is added to the service price for home visits</p>
                  </div>
                )}
              </div>

              {/* Save button */}
              <div className="flex items-center gap-3">
                <Button onClick={handleSave} className="gap-2" size="lg">
                  <Save className="w-4 h-4" />
                  {saved ? "Saved! ✓" : "Save Availability"}
                </Button>
                {saved && <p className="text-green-400 text-sm">Changes saved successfully</p>}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
