import { Logo } from '@/components/logo';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1">
            <Logo />
            <p className="mt-4 max-w-xs text-muted-foreground">
              Your Story, Your Adventure. AI-powered travel planning.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:gap-16 text-sm">
            <div>
              <h4 className="font-bold font-headline mb-4 text-foreground">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold font-headline mb-4 text-foreground">Explore</h4>
              <ul className="space-y-3">
                <li><Link href="/destinations" className="text-muted-foreground hover:text-foreground">Destinations</Link></li>
                <li><Link href="/planner" className="text-muted-foreground hover:text-foreground">AI Planner</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Travel Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold font-headline mb-4 text-foreground">Support</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} VoyageFlix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
