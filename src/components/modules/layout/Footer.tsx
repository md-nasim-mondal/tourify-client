import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-linear-to-b from-gray-900 to-gray-950 text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <Link href='/' className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary'>
                <MapPin className='h-6 w-6 text-white' />
              </div>
              <span className='text-xl font-bold'>
                <span className='text-primary'>Tour</span>ify
              </span>
            </Link>
            <p className='text-gray-300 text-sm'>
              Connecting travelers with passionate local experts for authentic,
              personalized experiences worldwide.
            </p>
            <div className='flex gap-4'>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
                aria-label='Facebook'>
                <Facebook className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
                aria-label='Twitter'>
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
                aria-label='Instagram'>
                <Instagram className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
                aria-label='YouTube'>
                <Youtube className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-semibold text-lg mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/tours'
                  className='text-gray-300 hover:text-white transition-colors'>
                  Explore Tours
                </Link>
              </li>
              <li>
                <Link
                  href='/guides'
                  className='text-gray-300 hover:text-white transition-colors'>
                  Find Guides
                </Link>
              </li>
              <li>
                <Link
                  href='/destinations'
                  className='text-gray-300 hover:text-white transition-colors'>
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href='/become-guide'
                  className='text-gray-300 hover:text-white transition-colors'>
                  Become a Guide
                </Link>
              </li>
              <li>
                <Link
                  href='/about'
                  className='text-gray-300 hover:text-white transition-colors'>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className='font-semibold text-lg mb-4'>Categories</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/tours?category=food'
                  className='text-gray-300 hover:text-white transition-colors'>
                  Food Tours
                </Link>
              </li>
              <li>
                <Link
                  href='/tours?category=history'
                  className='text-gray-300 hover:text-white transition-colors'>
                  Historical Tours
                </Link>
              </li>
              <li>
                <Link
                  href='/tours?category=adventure'
                  className='text-gray-300 hover:text-white transition-colors'>
                  Adventure
                </Link>
              </li>
              <li>
                <Link
                  href='/tours?category=art'
                  className='text-gray-300 hover:text-white transition-colors'>
                  Art & Culture
                </Link>
              </li>
              <li>
                <Link
                  href='/tours?category=nightlife'
                  className='text-gray-300 hover:text-white transition-colors'>
                  Nightlife
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='font-semibold text-lg mb-4'>Contact Us</h3>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <Mail className='h-5 w-5 text-primary' />
                <span className='text-gray-300'>support@tourify.com</span>
              </div>
              <div className='flex items-center gap-3'>
                <Phone className='h-5 w-5 text-primary' />
                <span className='text-gray-300'>+1 (555) 123-4567</span>
              </div>
            </div>
            <div className='mt-6 p-4 bg-gray-800/50 rounded-lg'>
              <p className='text-sm text-gray-300'>
                Ready to explore? Find your perfect local guide today!
              </p>
              <Link
                href='/tours'
                className='inline-block mt-3 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors'>
                Start Exploring
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t border-gray-800'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-sm'>
              © {currentYear}{" "}
              <span className='text-primary font-semibold'>Tourify</span>. All
              rights reserved.
            </p>
            <div className='flex gap-6 text-sm text-gray-400'>
              <Link
                href='/privacy'
                className='hover:text-white transition-colors'>
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                className='hover:text-white transition-colors'>
                Terms of Service
              </Link>
              <Link
                href='/cookies'
                className='hover:text-white transition-colors'>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
