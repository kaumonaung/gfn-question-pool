'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const params = useParams<{ category?: string; questionId?: string }>();

  const isNested = params.category || params.questionId;

  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <nav className={isNested ? 'flex justify-between' : 'flex justify-end'}>
        {isNested && (
          <Button variant="link" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 mr-2" />
            Z&uuml;ruck
          </Button>
        )}

        <Button variant="link" asChild>
          <Link href="/">Startseite</Link>
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;
