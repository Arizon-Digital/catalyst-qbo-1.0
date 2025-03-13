

import { clsx } from 'clsx';
import { forwardRef, ReactNode, type Ref } from 'react';
import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Logo } from '@/arizon/soul/primitives/logo';
import { Link } from '~/components/link';

interface Image {
  src: string;
  alt: string;
}

interface Link {
  href: string;
  label: string;
}

export interface Section {
  title?: string;
  links: Link[];
}

interface SocialMediaLink {
  href: string;
  icon: ReactNode;
}

interface ContactInformation {
  address?: string;
  phone?: string;
}

interface Props {
  logo?: Streamable<string | Image | null>;
  sections: Streamable<Section[]>;
  copyright?: Streamable<string | null>;
  contactInformation?: Streamable<ContactInformation | null>;
  paymentIcons?: Streamable<ReactNode[] | null>;
  socialMediaLinks?: Streamable<SocialMediaLink[] | null>;
  contactTitle?: string;
  className?: string;
  logoHref?: string;
  logoLabel?: string;
  logoWidth?: number;
  logoHeight?: number;
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --footer-focus: hsl(var(--primary));
 *   --footer-background: hsl(var(--background));
 *   --footer-border-top: hsl(var(--contrast-100));
 *   --footer-border-bottom: hsl(var(--primary));
 *   --footer-contact-title: hsl(var(--contrast-300));
 *   --footer-contact-text: hsl(var(--foreground));
 *   --footer-social-icon: hsl(var(--contrast-400));
 *   --footer-social-icon-hover: hsl(var(--foreground));
 *   --footer-section-title: hsl(var(--foreground));
 *   --footer-link: hsl(var(--contrast-400));
 *   --footer-link-hover: hsl(var(--foreground));
 *   --footer-copyright: hsl(var(--contrast-400));
 * }
 * ```
 */
export const Footer = forwardRef(function Footer(
  {
    logo,
    sections: streamableSections,
    contactTitle = 'Contact Us',
    contactInformation: streamableContactInformation,
    paymentIcons: streamablePaymentIcons,
    socialMediaLinks: streamableSocialMediaLinks,
    copyright: streamableCopyright,
    className,
    logoHref = '#',
    logoLabel = 'Home',
    logoWidth = 200,
    logoHeight = 40,
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <footer
      className={clsx(
        'w-full',
        className,
      )}
      ref={ref}
    >
      {/* Subscribe Section - Blue Background */}
      <div className="w-full py-6 bg-[#1a2442] text-white">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold whitespace-nowrap">Subscribe Today</h2>
          <div className="flex-1 text-sm md:text-base px-4 hidden md:block">
            Be the first to know about exclusive deals, new product lines, company announcements, and industry news.
          </div>
          <div className="flex w-full md:w-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-2 bg-white text-black border-none w-full md:w-64"
            />
            <button className="bg-[#daa520] text-white px-4 py-2 font-semibold whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Black Background */}
      <div className="w-full py-10 bg-[#1c1c1c] text-white">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Three equal columns in desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 - Contact Info */}
            <div>
              <Stream
                fallback={
                  <div className="animate-pulse">
                    <div className="h-6 w-48 bg-gray-600 mb-2"></div>
                    <div className="h-5 w-40 bg-gray-600 mb-2"></div>
                    <div className="h-5 w-32 bg-gray-600"></div>
                  </div>
                }
                value={streamableContactInformation}
              >
                {(contactInformation) => (
                  <div>
                    <h3 className="text-white font-bold mb-2">Quality Bearings Online Ltd</h3>
                    <p className="mb-2">
                      Canada - 438 800 2658
                    </p>
                    <Link href="/contact-us" className="font-bold">
                      Contact Us
                    </Link>
                  </div>
                )}
              </Stream>
            </div>

            {/* Column 2 - Navigation Links in Single Column */}
            <div>
              <h3 className="font-bold mb-4 uppercase">Navigate</h3>
              <div className="flex flex-col gap-y-2">
                <Link href="/" className="text-white opacity-50 hover:opacity-100 transition-opacity">Home</Link>
                <Link href="/about-us" className="text-white opacity-50 hover:opacity-100 transition-opacity">About Us</Link>
                <Link href="/contact-us" className="text-white opacity-50 hover:opacity-100 transition-opacity">Contact Us</Link>
                <Link href="/customer-service" className="text-white opacity-50 hover:opacity-100 transition-opacity">Customer Service</Link>
                <Link href="/delivery-information" className="text-white opacity-50 hover:opacity-100 transition-opacity">Delivery Information</Link>
                <Link href="/faqs" className="text-white opacity-50 hover:opacity-100 transition-opacity">FAQs</Link>
                <Link href="/privacy-policy" className="text-white opacity-50 hover:opacity-100 transition-opacity">Privacy Policy</Link>
                <Link href="/customer-reviews" className="text-white opacity-50 hover:opacity-100 transition-opacity">Customer Reviews</Link>
                <Link href="/terms-and-conditions" className="text-white opacity-50 hover:opacity-100 transition-opacity">Terms & Conditions</Link>
                <Link href="/blog" className="text-white opacity-50 hover:opacity-100 transition-opacity">Blog</Link>
              </div>
            </div>

            {/* Column 3 - Awards and Apps */}
            <div>
              <div className="flex flex-col gap-6">
                {/* Award Images */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <img 
                    src="https://cdn11.bigcommerce.com/s-ur7wjnshy8/images/stencil/original/image-manager/footer-logo.png" 
                    alt="Lloyds Bank British Business Excellence" 
                    className="h-12 object-contain"
                  />
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex gap-4">
                    <img 
                      src="https://cdn11.bigcommerce.com/s-03842/content/../product_images/uploaded_images/sc21.png" 
                      alt="SC21" 
                      className="h-12 object-contain"
                    />
                   
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <img 
                    src="https://cdn11.bigcommerce.com/s-03842/content/../product_images/uploaded_images/Queens_Award_White.png" 
                    alt="Queen's Award" 
                    className="h-10 object-contain"
                  />
                  <img 
                    src="https://cdn11.bigcommerce.com/s-03842/content/../content/Investers_In_People_23_24-01.jpg" 
                    alt="Investors in People" 
                    className="h-10 object-contain"
                  />
                </div>
                
                {/* App Downloads */}
                <div>
                  <h3 className="font-bold mb-2">Download Our New Mobile App</h3>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <a 
                      href="https://play.google.com/store/apps/details?id=com.qualitybearingsonline.qualitybearingsonline"
                      className="opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <img 
                        src="https://cdn11.bigcommerce.com/s-03842/content/../content/NewSite/Product-Images/Google%20Play%20Store%20Icon.png" 
                        alt="Google Play Store" 
                        className="h-10 object-contain"
                      />
                    </a>
                    <a 
                      href="https://apps.apple.com/us/app/quality-bearings-online/id1480671392?ls=1"
                      className="opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <img 
                        src="https://cdn11.bigcommerce.com/s-03842/content/../content/NewSite/Product-Images/Apple%20Store%20Icon.png" 
                        alt="Apple App Store" 
                        className="h-10 object-contain"
                      />
                    </a>
                  </div>
                </div>
                
                {/* Social Media */}
                <div>
                  <h3 className="font-bold mb-2">Follow Us on Social Media</h3>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <a 
                      href="https://www.facebook.com/qualitybearings"
                      className="opacity-50 hover:opacity-100 transition-opacity"
                      aria-label="Facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </a>
                    <a 
                      href="https://www.instagram.com/qualitybearings/"
                      className="opacity-50 hover:opacity-100 transition-opacity"
                      aria-label="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a 
                      href="https://www.linkedin.com/company/quality-bearings-online-limited/"
                      className="opacity-50 hover:opacity-100 transition-opacity"
                      aria-label="LinkedIn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Payment Section - Darker Black Background */}
      <div className="w-full py-4 bg-[#121212] text-white">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <Stream
            fallback={
              <div className="animate-pulse h-5 w-64 bg-gray-700 mb-4 md:mb-0"></div>
            }
            value={streamableCopyright}
          >
            {(copyright) => (
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Quality Bearings Online – All rights reserved.
              </p>
            )}
          </Stream>

          <Stream
            fallback={
              <div className="flex animate-pulse gap-2">
                <div className="h-8 w-12 bg-gray-700"></div>
                <div className="h-8 w-12 bg-gray-700"></div>
                <div className="h-8 w-12 bg-gray-700"></div>
                <div className="h-8 w-12 bg-gray-700"></div>
              </div>
            }
            value={streamablePaymentIcons}
          >
            {(paymentIcons) => (
              <div className="flex gap-2">
                {paymentIcons || (
                  <>
                    <img src="/images/payment/amex.png" alt="American Express" className="h-6" />
                    <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-6" />
                    <img src="/images/payment/paypal.png" alt="PayPal" className="h-6" />
                    <img src="/images/payment/visa.png" alt="Visa" className="h-6" />
                    <img src="/images/payment/gpay.png" alt="Google Pay" className="h-6" />
                  </>
                )}
              </div>
            )}
          </Stream>
        </div>
      </div>
    </footer>
  );
});