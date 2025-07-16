import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Waves, UserCog } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <Button asChild variant="ghost">
          <Link href="/login">Login <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </header>
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter text-primary">
                LiSEAnsyado
              </h1>
              <p className="text-lg md:text-xl text-foreground/80">
                Modernizing Cantilan's Fishery. Simplified registration, enhanced compliance, and sustainable seas for our local heroes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/login">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-96">
                <div 
                    className="absolute inset-0 bg-primary/10 rounded-3xl transform -rotate-6"
                    aria-hidden="true"
                ></div>
                <div 
                    className="absolute inset-0 bg-accent/20 rounded-3xl transform rotate-6"
                    aria-hidden="true"
                ></div>
                <div className="absolute inset-0 p-2">
                    <img 
                        src="https://placehold.co/600x400.png" 
                        data-ai-hint="fishing boat philippines"
                        alt="Fishing boat on the shores of Cantilan" 
                        className="w-full h-full object-cover rounded-2xl shadow-2xl"
                    />
                </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-foreground/60">
        © {new Date().getFullYear()} LiSEAnsyado. All Rights Reserved.
      </footer>
    </div>
  );
}
