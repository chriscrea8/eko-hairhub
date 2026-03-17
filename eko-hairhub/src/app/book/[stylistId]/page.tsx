"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Home, Clock, Calendar, CreditCard, CheckCircle, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_STYLISTS } from "@/lib/mock-data";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { Service, ServiceLocationType } from "@/types";

type BookingStep = 'service' | 'datetime' | 'location' | 'payment' | 'confirm';

const STEPS: { key: BookingStep; label: string }[] = [
  { key: 'service', label: 'Service' },
  { key: 'datetime', label: 'Date & Time' },
  { key: 'location', label: 'Location' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirm', label: 'Confirm' },
];

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

const UPCOMING_DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return d;
});

export default function BookingPage({ params }: { params: Promise<{ stylistId: string }> }) {
  const { stylistId } = use(params);
  const stylist = MOCK_STYLISTS.find(s => s.id === stylistId) || MOCK_STYLISTS[0];

  const [step, setStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<ServiceLocationType>('SALON');
  const [address, setAddress] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const stepIndex = STEPS.findIndex(s => s.key === step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const totalAmount = selectedService
    ? selectedService.price + (locationType === 'HOME' ? (stylist.homeServiceFee || 0) : 0)
    : 0;

  const canProceed = () => {
    if (step === 'service') return !!selectedService;
    if (step === 'datetime') return !!selectedDate && !!selectedTime;
    if (step === 'location') return locationType === 'SALON' || (locationType === 'HOME' && address.trim().length > 5);
    if (step === 'payment') return true;
    return false;
  };

  const nextStep = () => {
    const idx = STEPS.findIndex(s => s.key === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].key);
  };

  const prevStep = () => {
    const idx = STEPS.findIndex(s => s.key === step);
    if (idx > 0) setStep(STEPS[idx - 1].key);
  };

  const handleConfirmBooking = () => {
    // Would call Paystack + API here
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-3">Booking Confirmed! 🎉</h1>
          <p className="text-white/50 mb-2">Your appointment with <strong className="text-white">{stylist.user.fullName}</strong> has been booked.</p>
          <p className="text-white/50 mb-8">
            {selectedDate?.toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
          </p>
          <div className="card-dark rounded-2xl p-5 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/50 text-sm">Service</span>
              <span className="text-white text-sm font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/50 text-sm">Amount Paid</span>
              <span className="text-white text-sm font-semibold text-green-400">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">Reference</span>
              <span className="text-white/60 text-xs font-mono">EKO-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/bookings"><Button className="w-full">View My Bookings</Button></Link>
            <Link href="/stylists"><Button variant="outline" className="w-full">Browse More Stylists</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        {/* Progress bar */}
        <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-white/06">
          <div
            className="h-full bg-gradient-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back button */}
          <button onClick={step === 'service' ? undefined : prevStep} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
            {step === 'service' ? (
              <Link href={`/stylists/${stylist.id}`} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Profile
              </Link>
            ) : (
              <><ArrowLeft className="w-4 h-4" /> Back</>
            )}
          </button>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2 flex-shrink-0">
                <div className={`flex items-center gap-2 ${i <= stepIndex ? 'text-white' : 'text-white/30'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    i < stepIndex ? 'bg-green-500' : i === stepIndex ? 'bg-gradient-brand' : 'bg-white/10'
                  }`}>
                    {i < stepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-sm hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-px ${i < stepIndex ? 'bg-green-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* STEP 1: Service Selection */}
              {step === 'service' && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Choose a Service</h2>
                  <div className="space-y-3">
                    {stylist.services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`w-full text-left rounded-xl p-5 border transition-all ${
                          selectedService?.id === service.id
                            ? 'border-brand-500/50 bg-brand-500/10'
                            : 'border-white/08 bg-white/03 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-white">{service.name}</h3>
                              <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-white/40 text-sm">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDuration(service.duration)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-white">{formatCurrency(service.price)}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedService?.id === service.id ? 'border-brand-500 bg-brand-500' : 'border-white/20'
                            }`}>
                              {selectedService?.id === service.id && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Date & Time */}
              {step === 'datetime' && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Select Date & Time</h2>

                  {/* Date picker */}
                  <div className="mb-6">
                    <p className="text-white/50 text-sm mb-3">Pick a Date</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {UPCOMING_DATES.map((date, i) => {
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(date)}
                            className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border transition-all w-16 ${
                              isSelected ? 'border-brand-500/50 bg-brand-500/15' : 'border-white/08 hover:border-white/20'
                            }`}
                          >
                            <span className="text-xs text-white/40">{date.toLocaleDateString('en', { weekday: 'short' })}</span>
                            <span className={`text-xl font-bold mt-1 ${isSelected ? 'text-brand-400' : 'text-white'}`}>
                              {date.getDate()}
                            </span>
                            <span className="text-xs text-white/40">{date.toLocaleDateString('en', { month: 'short' })}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  {selectedDate && (
                    <div>
                      <p className="text-white/50 text-sm mb-3">Available Times</p>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                              selectedTime === time
                                ? 'border-brand-500/50 bg-brand-500/15 text-brand-400'
                                : 'border-white/08 text-white/60 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Location */}
              {step === 'location' && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Choose Location</h2>

                  <div className="space-y-4">
                    <button
                      onClick={() => setLocationType('SALON')}
                      className={`w-full text-left rounded-xl p-5 border transition-all ${
                        locationType === 'SALON' ? 'border-brand-500/50 bg-brand-500/10' : 'border-white/08 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${locationType === 'SALON' ? 'bg-brand-500/20' : 'bg-white/05'}`}>
                          <MapPin className="w-5 h-5 text-brand-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white mb-0.5">Salon Visit</h3>
                          <p className="text-white/40 text-sm">{stylist.location}</p>
                          <p className="text-green-400 text-xs mt-1">No additional fee</p>
                        </div>
                      </div>
                    </button>

                    {stylist.offersHomeService && (
                      <button
                        onClick={() => setLocationType('HOME')}
                        className={`w-full text-left rounded-xl p-5 border transition-all ${
                          locationType === 'HOME' ? 'border-brand-500/50 bg-brand-500/10' : 'border-white/08 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${locationType === 'HOME' ? 'bg-brand-500/20' : 'bg-white/05'}`}>
                            <Home className="w-5 h-5 text-brand-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white mb-0.5">Home Service</h3>
                            <p className="text-white/40 text-sm">Stylist comes to your location</p>
                            <p className="text-brand-400 text-xs mt-1">+{formatCurrency(stylist.homeServiceFee || 0)} travel fee</p>
                          </div>
                        </div>
                      </button>
                    )}

                    {locationType === 'HOME' && (
                      <div className="mt-4">
                        <label className="block text-white/60 text-sm mb-2">Your Address</label>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your full address in Lagos..."
                          rows={3}
                          className="w-full rounded-xl border border-white/10 bg-white/04 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Payment */}
              {step === 'payment' && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Payment</h2>
                  <div className="card-dark rounded-2xl p-6 mb-6">
                    <h3 className="text-white font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">{selectedService?.name}</span>
                        <span className="text-white">{formatCurrency(selectedService?.price || 0)}</span>
                      </div>
                      {locationType === 'HOME' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Home service fee</span>
                          <span className="text-white">{formatCurrency(stylist.homeServiceFee || 0)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/08 pt-3 flex justify-between font-semibold">
                        <span className="text-white">Total</span>
                        <span className="text-white text-lg">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-warm rounded-2xl p-6 border border-brand-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Pay with Paystack</h3>
                        <p className="text-white/40 text-xs">Secured by 256-bit encryption</p>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm">
                      You'll be redirected to Paystack's secure payment page to complete your payment of{' '}
                      <strong className="text-white">{formatCurrency(totalAmount)}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 5: Confirm */}
              {step === 'confirm' && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Review & Confirm</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Stylist', value: stylist.user.fullName },
                      { label: 'Service', value: selectedService?.name },
                      { label: 'Date', value: selectedDate?.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                      { label: 'Time', value: selectedTime },
                      { label: 'Location', value: locationType === 'SALON' ? `Salon — ${stylist.location}` : `Home Service — ${address}` },
                      { label: 'Total Amount', value: formatCurrency(totalAmount) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between py-3 border-b border-white/06">
                        <span className="text-white/40 text-sm">{label}</span>
                        <span className="text-white text-sm font-medium text-right max-w-xs">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/06">
                <Button variant="outline" onClick={prevStep} disabled={step === 'service'}>
                  Back
                </Button>
                {step === 'confirm' ? (
                  <Button onClick={handleConfirmBooking} size="lg" className="gap-2">
                    Confirm & Pay {formatCurrency(totalAmount)}
                  </Button>
                ) : (
                  <Button onClick={nextStep} disabled={!canProceed()} className="gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar summary */}
            <div className="hidden lg:block">
              <div className="card-dark rounded-2xl p-5 sticky top-24">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/06">
                  <div className="w-12 h-12 rounded-xl overflow-hidden">
                    <Image src={stylist.user.avatar || ''} alt="" width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{stylist.user.fullName}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                      <span className="text-white/60 text-xs">{stylist.rating} • {stylist.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {selectedService && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Service</span>
                      <span className="text-white">{selectedService.name}</span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Date</span>
                      <span className="text-white">{selectedDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Time</span>
                      <span className="text-white">{selectedTime}</span>
                    </div>
                  )}
                  {selectedService && (
                    <div className="flex justify-between pt-3 border-t border-white/06 font-semibold">
                      <span className="text-white/60">Total</span>
                      <span className="text-white">{formatCurrency(totalAmount)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
