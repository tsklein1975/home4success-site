import { Metadata } from 'next';
import LearningHub from './_components/LearningHub';

export const metadata: Metadata = {
  title: 'מרחב למידה אינטראקטיבי - הבית שלך להצלחה',
  description: 'תרגול כתיבה בעברית ואנגלית ופותר בעיות מתמטיות למגוון גילאים.',
};

import { Suspense } from 'react';

export default function InteractiveLearningPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafaf7] flex items-center justify-center font-bold">טוען...</div>}>
      <LearningHub />
    </Suspense>
  );
}
