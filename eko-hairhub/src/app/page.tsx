import Link from "next/link";
import Image from "next/image";
import { Scissors, Star, MapPin, Shield, ArrowRight, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_HAIRSTYLES, MOCK_STYLISTS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const featuredStyles = MOCK_HAIRSTYLES.slice(0, 6);
  const topStylists = MOCK_STYLISTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-gold-500/08 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-600/05 blur-[150px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <div className="animate-fade-up">
                <Badge variant="gold" className="mb-6 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Lagos's #1 Hair Marketplace
                </Badge>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 animate-fade-up delay-100">
                Your Perfect
                <span className="block text-gradient">Hair Day</span>
                <span className="block text-white">Starts Here</span>
              </h1>

              <p className="text-lg text-white/50 leading-relaxed mb-10 animate-fade-up delay-200 max-w-lg">
                Discover talented hairstylists, barbers, and salons across Lagos. Browse styles, book instantly, pay securely.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
                <Link href="/stylists">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Find Your Stylist
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/hairstyles">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    Browse Hairstyles
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-14 grid grid-cols-3 gap-6 animate-fade-up delay-400">
                {[
                  { value: '500+', label: 'Verified Stylists' },
                  { value: '12K+', label: 'Happy Customers' },
                  { value: '4.9★', label: 'Average Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="relative hidden lg:block h-[600px]">
              {/* Main image card */}
              <div className="absolute top-0 right-0 w-72 h-80 rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-fade-up delay-200">
                <Image
                  src="https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&q=80"
                  alt="Braids"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-display font-semibold text-lg">Box Braids</p>
                  <p className="text-white/60 text-sm">by Amaka Okonkwo</p>
                </div>
              </div>

              {/* Secondary image */}
              <div className="absolute top-40 left-0 w-56 h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-fade-up delay-300">
                <Image
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80"
                  alt="Fade"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-display font-semibold">Clean Fade</p>
                </div>
              </div>

              {/* Booking card */}
              <div className="absolute bottom-8 right-8 glass-warm rounded-2xl p-4 w-64 shadow-xl animate-fade-up delay-400 border border-brand-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80" alt="" width={40} height={40} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Amaka O.</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                      <span className="text-gold-400 text-xs font-medium">4.9 (247 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
                  <MapPin className="w-3 h-3" /> Victoria Island, Lagos
                </div>
                <div className="bg-green-500/15 border border-green-500/25 rounded-lg px-3 py-2 text-center">
                  <span className="text-green-400 text-xs font-medium flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Available Today
                  </span>
                </div>
              </div>

              {/* Rating pill */}
              <div className="absolute top-8 left-16 glass rounded-full px-4 py-2 flex items-center gap-2 shadow-lg animate-fade-up delay-500">
                <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                <span className="text-white text-sm font-medium">Top Rated Stylist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/30 text-xs">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 border-t border-white/04">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Book in 4 Simple Steps
            </h2>
            <p className="text-white/40 max-w-md mx-auto">
              From browsing to your appointment — we've made it effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: Scissors, title: 'Browse Styles', desc: 'Explore our gallery of hundreds of hairstyles and find what you love.' },
              { step: '02', icon: MapPin, title: 'Find a Stylist', desc: 'Search verified stylists by location, specialty, and rating.' },
              { step: '03', icon: Clock, title: 'Book Instantly', desc: 'Select your date, time, and whether salon visit or home service.' },
              { step: '04', icon: Shield, title: 'Pay Securely', desc: 'Safe payment via Paystack. Get confirmation instantly.' },
            ].map((item, i) => (
              <div key={i} className="relative card-dark rounded-2xl p-6 hover:border-brand-500/20 transition-all group">
                <div className="absolute top-4 right-4 font-display text-5xl font-bold text-white/04 group-hover:text-brand-500/10 transition-colors">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center mb-5 shadow-lg shadow-brand-500/20">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HAIRSTYLE GALLERY PREVIEW ===== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">Gallery</Badge>
              <h2 className="font-display text-4xl font-bold text-white">
                Trending Styles
              </h2>
            </div>
            <Link href="/hairstyles">
              <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featuredStyles.map((style, i) => (
              <Link
                href={`/hairstyles`}
                key={style.id}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                  i === 0 ? 'row-span-2' : ''
                }`}
              >
                <div className={`relative ${i === 0 ? 'h-full min-h-[420px]' : 'h-48 md:h-56'}`}>
                  <Image
                    src={style.imageUrl}
                    alt={style.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/10 transition-colors" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge variant="secondary" className="mb-2 text-xs">{style.category}</Badge>
                    <p className="text-white font-display font-semibold text-base">{style.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link href="/hairstyles">
              <Button variant="outline" className="w-full gap-1.5">
                View All Hairstyles <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TOP STYLISTS PREVIEW ===== */}
      <section className="py-24 border-t border-white/04">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">Top Rated</Badge>
              <h2 className="font-display text-4xl font-bold text-white">
                Meet Our Stylists
              </h2>
            </div>
            <Link href="/stylists">
              <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
                All Stylists <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topStylists.map((stylist) => (
              <Link href={`/stylists/${stylist.id}`} key={stylist.id}>
                <div className="card-dark rounded-2xl overflow-hidden hover:border-brand-500/20 transition-all group cursor-pointer">
                  {/* Portfolio preview */}
                  <div className="relative h-48 bg-surface-100">
                    <div className="grid grid-cols-2 h-full">
                      {stylist.portfolioImages.slice(0, 2).map((img, i) => (
                        <div key={img.id} className="relative overflow-hidden">
                          <Image src={img.url} alt={img.hairstyleName || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-50 via-transparent to-transparent" />
                    {stylist.isVerified && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="success" className="text-xs gap-1">
                          <Shield className="w-2.5 h-2.5" /> Verified
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-brand-500/30">
                          <Image
                            src={stylist.user.avatar || ''}
                            alt={stylist.user.fullName}
                            width={44}
                            height={44}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{stylist.user.fullName}</h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                            <span className="text-gold-400 text-xs font-medium">{stylist.rating}</span>
                            <span className="text-white/30 text-xs">({stylist.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-white/40 text-xs mb-3">
                      <MapPin className="w-3 h-3" />
                      {stylist.area}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {stylist.specialties.slice(0, 2).map(s => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                      {stylist.offersHomeService && (
                        <Badge variant="default" className="text-xs">🏠 Home Service</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white/30 text-xs">From </span>
                        <span className="text-white font-semibold text-sm">
                          {formatCurrency(Math.min(...stylist.services.map(s => s.price)))}
                        </span>
                      </div>
                      <Button size="sm" className="text-xs px-4">Book Now</Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-brand opacity-90" />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M44.5 20C49.6 39.3 59.7 60.4 74.5 74.5 89.3 88.6 109.5 95 124.5 108 139.5 121 149.3 140 143.5 155c-5.8 15-27.4 25.7-46.5 26.5C78 182.3 61.6 173.2 48 163 34.4 152.8 23.6 141.5 16 128 8.4 114.5 4 98.8 4 83.7 4 68.6 8.5 54 17.5 43c9-11 22.5-19.8 27-23z' fill='%23ffffff'/%3E%3C/svg%3E")`,
              backgroundSize: '400px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right -50px top -50px'
            }} />

            <div className="relative px-8 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                  Are You a Stylist?
                </h2>
                <p className="text-white/70 max-w-md">
                  Join hundreds of stylists earning more on Eko HairHub. Create your profile, showcase your work, and grow your clientele.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link href="/register?role=stylist">
                  <Button size="lg" className="bg-white text-brand-600 hover:bg-white/90 shadow-xl w-full sm:w-auto">
                    Join as Stylist
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST SECTION ===== */}
      <section className="py-20 border-t border-white/04">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: 'Verified Stylists', desc: 'Every stylist is background-checked and portfolio-verified by our team.' },
              { icon: Star, title: 'Quality Guaranteed', desc: 'Not satisfied? We\'ll work to make it right. Your happiness matters.' },
              { icon: Clock, title: 'Easy Rescheduling', desc: 'Plans change — reschedule bookings up to 24 hours before with no hassle.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl glass-warm flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
