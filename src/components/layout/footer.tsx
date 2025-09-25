import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function AppFooter() {
  return (
    <footer id="contact" className="w-full bg-muted text-muted-foreground">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground font-headline">
              Agriassist
            </span>
          </Link>
          <p className="text-sm">
            Revolutionizing Agriculture with Technology.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="tel:+919876543210" className="hover:text-primary">
                +91 98765 43210
              </a>
            </li>
            <li>
              <a
                href="mailto:info@agriassist.in"
                className="hover:text-primary"
              >
                info@agriassist.in
              </a>
            </li>
            <li>Punjab, India</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-primary">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-center text-sm">
          © {new Date().getFullYear()} Agriassist. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
