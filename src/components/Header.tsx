'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname } from 'next/navigation';
import Sidebar from "./Sidebar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import MobileMenu from "./MobileMenu";
import SearchButton from './SearchButton';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const sidebarTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();
    const { openCart, itemCount } = useCart();
    const { isAuthenticated } = useAuth();
    const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

    const isCollectionPage = pathname.startsWith('/collections/');
    const isProductPage = pathname.startsWith('/products/');

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (sidebarTimeoutRef.current) {
                clearTimeout(sidebarTimeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = (category: string) => {
        if (sidebarTimeoutRef.current) {
            clearTimeout(sidebarTimeoutRef.current);
            sidebarTimeoutRef.current = null;
        }
        setIsSidebarOpen(true);
        setHoveredCategory(category);
    };

    const handleMouseLeave = () => {
        sidebarTimeoutRef.current = setTimeout(() => {
            setIsSidebarOpen(false);
            setHoveredCategory(null);
        }, 200);
    };

    const useSolidStyle = isCollectionPage || isProductPage || isSidebarOpen;
    const linkClassName = useSolidStyle ? "nav-link" : "nav-link-transparent";
    const headerBgClass = useSolidStyle ? "bg-white" : "bg-transparent";
    const logoTextColor = useSolidStyle ? "text-black" : "text-white";

    const imageSrc = hoveredCategory === 'men'
        ? 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325553/mymessage/images/WhatsApp%20Image%202025-05-14%20at%2012.29.28%20PM.jpg'
        : 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325322/mymessage/images/1.jpg';
    const blurOverlayLeft = "left-[40rem]";

    return (
        <>
            {/* Blur overlay - Hidden on mobile (md:block) */}
            {isSidebarOpen && hoveredCategory && (
                <div className={`fixed top-16 ${blurOverlayLeft} right-0 h-[calc(100vh-4rem)] bg-black/30 backdrop-blur-sm z-30 hidden md:block`} aria-hidden="true"></div>
            )}

            {/* Image Display - Hidden on mobile (md:block) */}
            <div
                className={`fixed top-16 left-64 w-96 h-[calc(100vh-4rem)] z-30 overflow-hidden transition-opacity duration-1000 ease-in-out ${isSidebarOpen && hoveredCategory ? 'opacity-100' : 'opacity-0'} hidden md:block`}
            >
                {/* Conditionally render image only when needed to potentially save resources */}
                {isSidebarOpen && hoveredCategory && (
                    <Image
                        src={imageSrc}
                        alt={`${hoveredCategory} category image`}
                        layout="fill"
                        objectFit="cover"
                        quality={80}
                    />
                )}
            </div>

            <div className={`sticky top-0 left-0 right-0 z-50 ${headerBgClass} transition-colors duration-300 ease-in-out`}>
                <header className={`absolute w-full ${headerBgClass} transition-colors duration-300 ease-in-out`}>
                    <div className="container-represent">
                        <div className="flex justify-between items-center h-16">
                            {/* Left navigation - Hidden below md */}
                            <nav className="hidden md:flex space-x-6">
                                {/* Pass category to handlers - hover only active on md+ screens */}
                                <div onMouseEnter={() => handleMouseEnter('men')} onMouseLeave={handleMouseLeave} className="hidden md:block">
                                    <Link href="/collections/all" className={linkClassName}>
                                        Under His Shelter
                                    </Link>
                                </div>
                                <div onMouseEnter={() => handleMouseEnter('women')} onMouseLeave={handleMouseLeave} className="hidden md:block">
                                    <Link href="/products/washed-green-t-shirt" className={linkClassName}>
                                        Grey washed
                                    </Link>
                                </div>
                                {/* 247 link remains visible */}

                            </nav>

                            {/* Mobile nav toggle - Opens Mobile Menu */}
                            <button
                                className={`md:hidden ${logoTextColor}`}
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Open menu</span>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>

                            {/* Logo - Stays centered */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 overflow-hidden">
                                <Link href="/" className={`text-lg font-bold uppercase tracking-widest ${logoTextColor} flex items-center justify-center`}>
                                    <div className="relative">
                                        {/* MY part */}
                                        <span
                                            className={`inline-block transition-all duration-500 ease-in-out transform ${scrolled
                                                ? "opacity-0 -translate-x-full absolute"
                                                : "opacity-100 translate-x-0 relative"
                                                }`}
                                            style={{ marginRight: '-2px' }}
                                        >
                                            MY
                                        </span>

                                        {/* M (stays visible) */}
                                        <span
                                            className={`inline-block transition-all duration-500 ease-in-out transform ${scrolled ? "scale-110" : "scale-100"
                                                }`}
                                        >
                                            M
                                        </span>

                                        {/* ESSAGE part */}
                                        <span
                                            className={`inline-block transition-all duration-500 ease-in-out transform ${scrolled
                                                ? "opacity-0 translate-x-full absolute"
                                                : "opacity-100 translate-x-0 relative"
                                                }`}
                                            style={{ marginLeft: '-2px' }}
                                        >
                                            ESSAGE
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            {/* Right section: Cart icon on mobile, more icons on desktop */}
                            <div className="flex items-center space-x-4">
                                {/* Desktop Right navigation - Hidden below md */}
                                <nav className="hidden md:flex items-center space-x-4">



                                    <Link href="/about" className={linkClassName}>
                                        About
                                    </Link>
                                    <Link href="/story" className={linkClassName}>
                                        Story
                                    </Link>
                                    <Link href="/contact" className={linkClassName}>
                                        Contact
                                    </Link>
                                    {/* Search Icon - Desktop only */}
                                    <SearchButton color={useSolidStyle ? 'black' : 'white'} />
                                </nav>

                                {/* Cart Button - Visible on all sizes */}
                                <button onClick={openCart} className={`${linkClassName} relative`}>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span className="sr-only">Open cart</span>
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {itemCount}
                                        </span>
                                    )}
                                </button>

                                {/* Profile Icon - Visible on all sizes */}
                                <Link href="/auth" className={`${linkClassName} relative`}>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" />
                                        <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span className="sr-only">{isAuthenticated ? "Account" : "Sign in"}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            {/* Render Sidebar - Hidden on mobile (md:block) */}
            <div className="hidden md:block">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onMouseEnter={() => hoveredCategory && handleMouseEnter(hoveredCategory)}
                    onMouseLeave={handleMouseLeave}
                />
            </div>

            {/* Render Mobile Menu - Conditionally rendered */}
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </>
    );
} 