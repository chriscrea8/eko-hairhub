import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eko HairHub — Lagos's Premier Hair Marketplace",
  description: "Discover top hairstylists, barbers, and salons in Lagos. Book appointments, browse hairstyles, and pay securely with Paystack.",
  keywords: ["hair", "Lagos", "stylist", "barber", "salon", "booking", "Nigeria"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-surface antialiased">
        {children}
      </body>
    </html>
  );
}
