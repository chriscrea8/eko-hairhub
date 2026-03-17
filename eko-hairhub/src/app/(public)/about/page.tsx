import Image from "next/image";
import Link from "next/link";
import { Shield, Star, Users, Scissors, MapPin, Heart, ArrowRight, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-500/08 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gold-500/06 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="gold" className="mb-6">Our Story</Badge>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Connecting Lagos's
              <span className="block text-gradient">Hair Community</span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Eko HairHub was born out of a simple frustration — finding talented hairstylists in Lagos shouldn't be this hard.
              We built the platform we always wished existed.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 border-t border-white/04">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">Our Mission</Badge>
                <h2 className="font-display text-4xl font-bold text-white mb-6">
                  Empowering Stylists.<br />Delighting Customers.
                </h2>
                <div className="space-y-4 text-white/50 leading-relaxed">
                  <p>
                    Lagos is home to some of the world's most talented hairstylists, barbers, and beauty professionals.
                    Yet, too many of them rely solely on word-of-mouth and WhatsApp groups to find clients.
                  </p>
                  <p>
                    Eko HairHub gives every stylist — from the established salon in Victoria Island to the talented
                    freelancer in Surulere — a professional digital presence, seamless booking tools, and secure payments.
                  </p>
                  <p>
                    For customers, we've removed the guesswork. Browse verified portfolios, read real reviews,
                    book instantly, and pay securely. Your perfect hair day, simplified.
                  </p>
                </div>
                <div className="mt-8">
                  <Link href="/register">
                    <Button className="gap-2">
                      Join the Community <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-48 rounded-2xl overflow-hidden">
                      <Image src="https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=400&q=80" alt="Braids" fill className="object-cover" />
                    </div>
                    <div className="relative h-32 rounded-2xl overflow-hidden">
                      <Image src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" alt="Fade" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative h-32 rounded-2xl overflow-hidden">
                      <Image src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80" alt="Locs" fill className="object-cover" />
                    </div>
                    <div className="relative h-48 rounded-2xl overflow-hidden">
                      <Image src="https://images.unsplash.com/photo-1570158268183-d296b2892211?w=400&q=80" alt="Goddess Locs" fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 border-t border-white/04">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Scissors, value: "500+", label: "Verified Stylists", color: "text-brand-400" },
                { icon: Users, value: "12K+", label: "Happy Customers", color: "text-gold-400" },
                { icon: MapPin, value: "20+", label: "Lagos Areas", color: "text-purple-400" },
                { icon: Star, value: "4.9★", label: "Average Rating", color: "text-green-400" },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="text-center">
                  <div className={`w-12 h-12 rounded-2xl glass-warm flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className={`font-display text-3xl font-bold ${color} mb-1`}>{value}</p>
                  <p className="text-white/40 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 border-t border-white/04">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Our Values</Badge>
              <h2 className="font-display text-4xl font-bold text-white">What We Stand For</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Trust & Safety",
                  desc: "Every stylist is manually verified with portfolio review and ID checks. No anonymous profiles.",
                  color: "text-brand-400",
                  bg: "bg-brand-500/10",
                },
                {
                  icon: Heart,
                  title: "Community First",
                  desc: "We're building this for Lagos. Every feature, every decision is centered on the needs of our local community.",
                  color: "text-red-400",
                  bg: "bg-red-500/10",
                },
                {
                  icon: CheckCircle,
                  title: "Quality Guaranteed",
                  desc: "Real reviews from real customers. Transparent pricing. No hidden fees. What you see is what you get.",
                  color: "text-green-400",
                  bg: "bg-green-500/10",
                },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="card-dark rounded-2xl p-6">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-white text-lg mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-white/04">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Ready to Join Us?
            </h2>
            <p className="text-white/50 mb-10">
              Whether you're looking for your next amazing hair experience or you're a stylist ready to grow your business — Eko HairHub is your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/stylists">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Find a Stylist <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/register?role=stylist">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  Join as a Stylist
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
