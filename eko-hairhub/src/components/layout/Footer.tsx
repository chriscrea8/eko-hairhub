import Link from "next/link";
import { Scissors, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/06 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-gradient">Eko</span>
                <span className="text-white"> HairHub</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Lagos's premier hair marketplace connecting you with the best stylists, barbers, and salons across the city.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white hover:border-brand-500/40 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              {['Hairstyle Gallery', 'Find Stylists', 'Book Appointment', 'Become a Stylist'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Blog', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/06 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Eko HairHub. Made with ❤️ in Lagos.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-sm text-white/30">Payments secured by</span>
            <span className="text-sm font-semibold text-green-400 ml-1">Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
