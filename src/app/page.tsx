
'use client';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-students');
  const { token } = useAuth();

  return (
    <div className="flex flex-col items-center text-center animate-fade-in-up">
      <div className="flex items-center justify-center gap-2 mb-4">
        <GraduationCap className="h-10 w-10 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          StudentVerse
        </h1>
      </div>
      <p className="max-w-2xl text-lg text-muted-foreground md:text-xl mb-6">
        The all-in-one solution for managing students efficiently and effortlessly.
        Built with modern technology for a seamless experience.
      </p>
      <Link href={token ? "/students" : "/login"}>
        <Button size="lg">
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
      {heroImage && (
        <div className="relative mt-12 w-full max-w-4xl aspect-[3/2] rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}
    </div>
  );
}
