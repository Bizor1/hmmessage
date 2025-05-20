'use client';

import React from 'react';
import SidebarNavigation from './SidebarNavigation';

interface SidebarProps {
    isOpen: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export default function Sidebar({ isOpen, onMouseEnter, onMouseLeave }: SidebarProps) {
    return (
        <div
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="p-6">
                <SidebarNavigation />
            </div>
        </div>
    );
} 