'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Force standard scroll to top on every path change.
    window.scrollTo(0, 0);
    // As a fallback for older devices or bizarre layout caching:
    setTimeout(() => window.scrollTo(0, 0), 50);
  }, [pathname]);

  return null;
}
