'use client';

import { useDropCountdown } from '@/hooks/useCountdown';

interface DynamicMainProps {
    children: React.ReactNode;
}

export default function DynamicMain({ children }: DynamicMainProps) {
    const { isExpired } = useDropCountdown();

    return (
        <main className={isExpired ? "" : "pt-4"}>{children}</main>
    );
} 