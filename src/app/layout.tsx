import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { CollectionsProvider } from '@/context/CollectionsContext'
import CartSidebar from "@/components/CartSidebar";
import ChatModal from "@/components/ChatModal";
import { Providers } from './providers';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mymessage-theta.vercel.app'),
  title: "MYMESSAGE | Fashion Brand",
  description: "Premium fashion brand for the modern individual.",
  icons: {
    icon: '/favicons/favicon.jpeg',
  },
  openGraph: {
    title: "MYMESSAGE | Fashion Brand",
    description: "Premium fashion brand for the modern individual.",
    url: 'https://mymessage-theta.vercel.app',
    siteName: 'MYMESSAGE',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MYMESSAGE | Fashion Brand",
    description: "Premium fashion brand for the modern individual.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Remove the favicon link tag since it's handled in metadata */}
      </head>
      <body>
        <Providers>
          <AuthProvider>
            <CartProvider>
              <SidebarProvider>
                <CollectionsProvider>
                  <Header />
                  <main>{children}</main>
                  <CartSidebar />
                  <ChatModal />
                  <footer className="bg-white pt-16 pb-8">
                    <div className="container-represent">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold uppercase">Help</h3>
                          <ul className="space-y-2">
                            <li><span className="text-xs text-gray-400 cursor-not-allowed">Live Chat</span></li>
                            <li><span className="text-xs text-gray-400 cursor-not-allowed">Support Hub</span></li>
                            <li><span className="text-xs text-gray-400 cursor-not-allowed">Track Order</span></li>
                            <li><span className="text-xs text-gray-400 cursor-not-allowed">Make a Return</span></li>
                            <li><span className="text-xs text-gray-400 cursor-not-allowed">Stores</span></li>
                            <li><Link href="/contact" className="text-xs text-gray-600 hover:text-black">Contact Us</Link></li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold uppercase">Company</h3>
                          <ul className="space-y-2">
                            <li className="font-semibold mb-4">Links</li>
                            <li><Link href="/about" className="text-xs text-gray-400 hover:text-white">About</Link></li>
                            <li><Link href="/story" className="text-xs text-gray-400 hover:text-white">Story</Link></li>
                            <li><Link href="/contact" className="text-xs text-gray-400 hover:text-white">Contact</Link></li>
                            <li><Link href="/shop" className="text-xs text-gray-400 hover:text-white">Shop</Link></li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-4">Social</h3>
                          <div className="flex space-x-4">
                            <Link
                              href="https://www.instagram.com/mymessage55?igsh=MWwydTZ6ZGlhOHhx"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-gray-700 hover:text-black transition-colors duration-200"
                            >
                              <FaInstagram className="w-5 h-5 mr-2" />
                              Instagram
                            </Link>
                            <Link
                              href="https://www.tiktok.com/@mymessageclo?_t=8%7CRfKxkVeQj&_r=1"
                              className="inline-flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaTiktok className="w-5 h-5 mr-2" />
                              TikTok
                            </Link>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-4">Newsletter</h3>
                          <p className="text-xs text-gray-600 mb-4">Sign up to receive updates on new arrivals and special offers</p>
                          <form className="flex">
                            <input
                              type="email"
                              placeholder="Email address"
                              className="px-3 py-2 border border-gray-300 text-xs flex-1"
                            />
                            <button className="bg-black text-white px-4 py-2 text-xs uppercase">
                              Sign Up
                            </button>
                          </form>
                        </div>
                      </div>

                      <div className="mt-12 pt-8 border-t border-gray-100 text-xs text-gray-500">
                        <p>© {new Date().getFullYear()} Fashion Brand. All rights reserved.</p>
                      </div>
                    </div>
                  </footer>
                </CollectionsProvider>
              </SidebarProvider>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
