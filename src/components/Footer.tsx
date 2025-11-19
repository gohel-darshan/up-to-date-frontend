'use client'

import Link from 'next/link'
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-accent">UP TO DATE SELECTION</h3>
            <p className="text-primary-foreground/80 text-sm">
              Premium tailoring and bespoke suits. Experience excellence with our curated fabric collection.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-accent">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/products" className="block text-primary-foreground/80 hover:text-accent transition-smooth">
                Products
              </Link>
              <Link href="/contact" className="block text-primary-foreground/80 hover:text-accent transition-smooth">
                Contact
              </Link>
              <Link href="/about" className="block text-primary-foreground/80 hover:text-accent transition-smooth">
                About
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-accent">Stay Connected</h4>
            <p className="text-primary-foreground/80 text-sm">
              Get the latest collections and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input 
                placeholder="Enter your email" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 flex-1"
              />
              <Button className="bg-brand-gold text-white hover:bg-brand-gold-light font-semibold whitespace-nowrap">
                <Mail className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Subscribe</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/60 text-sm">
              © 2025 UP TO DATE SELECTION. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-primary-foreground/60 hover:text-accent text-sm transition-smooth">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-primary-foreground/60 hover:text-accent text-sm transition-smooth">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;