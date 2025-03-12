'use client';

import { forwardRef, useEffect, useState } from 'react';
import Headroom from 'react-headroom';
import { Phone, Mail, ChevronDown, Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTransition } from 'react';
import { useActionState } from 'react';

import { Banner } from '@/vibes/soul/primitives/banner';
import { Navigation } from '@/vibes/soul/primitives/navigation';
import { Link } from '~/components/link';
import { Logo } from '@/vibes/soul/primitives/logo';
import { Stream } from '@/vibes/soul/lib/streamable';

// This matches the CurrencyAction type from your Navigation component
type CurrencyAction = (state: any, payload: FormData) => any | Promise<any>;

interface Currency {
  id: string;
  label: string;
}

interface Props {
  navigation: React.ComponentPropsWithoutRef<typeof Navigation>;
  banner?: React.ComponentPropsWithoutRef<typeof Banner>;
}

export const HeaderSection = forwardRef<React.ComponentRef<'div'>, Props>(
  ({ navigation, banner }, ref) => {
    const [bannerElement, setBannerElement] = useState<HTMLElement | null>(null);
    const [bannerHeight, setBannerHeight] = useState(0);
    const [isFloating, setIsFloating] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    useEffect(() => {
      if (!bannerElement) return;

      const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
          setBannerHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(bannerElement);

      return () => {
        resizeObserver.disconnect();
      };
    }, [bannerElement]);

    // Close mobile menu when resizing to desktop
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
      // Reset active dropdown when closing menu
      if (mobileMenuOpen) setActiveDropdown(null);
    };

    const toggleDropdown = (index: number) => {
      setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
      <div ref={ref}>
        {banner && <Banner ref={setBannerElement} {...banner} />}

        <Headroom
          onUnfix={() => setIsFloating(false)}
          onUnpin={() => setIsFloating(true)}
          pinStart={bannerHeight}
          disable={mobileMenuOpen} // Disable headroom when mobile menu is open
        >
          {/* Top black bar */}
          <div className="bg-black text-white py-2 px-4">
            <div className="container mx-auto flex justify-end items-center">
              <div className="flex items-center gap-2 md:gap-6 flex-wrap justify-end">
                {/* Currency selector */}
                {navigation.currencies && navigation.currencies.length > 1 && navigation.currencyAction && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium hidden sm:inline">Select Currency:</span>
                    <CurrencySelector
                      currencies={navigation.currencies}
                      activeCurrencyId={navigation.activeCurrencyId}
                      currencyAction={navigation.currencyAction}
                    />
                  </div>
                )}

                <Link href="/about-us" className="flex items-center gap-1 text-white hover:text-gray-300 font-medium text-xs sm:text-sm">
                  <span>About Us</span>
                </Link>

                <Link href="/contact-us" className="flex items-center gap-1 text-white hover:text-gray-300 font-medium text-xs sm:text-sm">
                  <Mail size={14} className="hidden sm:inline" />
                  <span>Contact Us</span>
                </Link>

                <Link href="tel:+14388002658" className="flex items-center gap-1 text-white hover:text-gray-300 font-medium text-xs sm:text-sm">
                  <Phone size={14} className="hidden sm:inline" />
                  <span className="hidden sm:inline">CAN:</span>
                  <span>438 800 2658</span>
                </Link>
              </div>
            </div>
          </div>

          <div className={clsx(
            "bg-white transition-shadow relative",
            isFloating && "shadow-lg"
          )}>
            {/* Main header with logo, search, account and cart */}
            <div className="container mx-auto py-3 md:py-5 flex items-center justify-between px-4">
              {/* Hamburger menu for mobile */}
              <button
                className="lg:hidden flex items-center mr-2"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-blue-900" />
                ) : (
                  <Menu size={24} className="text-blue-900" />
                )}
              </button>

              {/* Logo section - Updated with larger sizes */}
              <div className="flex-shrink-0">
                <Logo
                  className={clsx(navigation.mobileLogo != null ? 'hidden md:flex' : 'flex')}
                  height={navigation.logoHeight || 130}
                  href="/"  
                  label={navigation.logoLabel || 'Quality Bearings Online'}
                  logo={navigation.logo}
                  width={navigation.logoWidth || 280}
                />
                {navigation.mobileLogo != null && (
                  <Logo
                    className="flex md:hidden"
                    height={navigation.mobileLogoHeight || 70} // Increased to 70px for mobile
                    href="/"
                    label={navigation.logoLabel || 'Quality Bearings Online'}
                    logo={navigation.mobileLogo}
                    width={navigation.mobileLogoWidth || 180}
                  />
                )}
              </div>

              {/* Search bar - hidden on smallest screens */}
              <div className="hidden sm:flex flex-grow max-w-xl mx-4">
                <form
                  action={navigation.searchHref || '/search'}
                  method="get"
                  className="relative w-full"
                >
                  <input
                    type="text"
                    name={navigation.searchParamName || 'query'}
                    placeholder={navigation.searchInputPlaceholder || 'Search by reference'}
                    className="w-full border border-gray-300 rounded-l px-4 py-2 md:py-3 focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full bg-blue-900 text-white px-3 md:px-4 rounded-r"
                    aria-label={navigation.searchLabel || 'Search'}
                  >
                    <Search size={20} />
                  </button>
                </form>
              </div>


              <div className="flex items-center gap-2 md:gap-6 lg:gap-8">

                <Link href="/login" className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <User size={24} className="text-blue-900" />
                  </div>
                  <div className="text-xs md:text-sm hidden sm:block">
                    <div className="font-medium">Sign In</div>
                    <div>Register</div>
                  </div>
                </Link>

                {/* Recently viewed - hide text on mobile */}
                <Link href="/recently-viewed" className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <svg viewBox="0 0 24 24" width="24" height="24" className="text-blue-900" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="18" rx="2" />
                      <line x1="8" y1="10" x2="16" y2="10" />
                      <line x1="8" y1="14" x2="16" y2="14" />
                      <line x1="8" y1="18" x2="16" y2="18" />
                    </svg>
                  </div>
                  <div className="text-xs md:text-sm hidden sm:block">
                    <div className="font-medium">Recently</div>
                    <div>Viewed</div>
                  </div>
                </Link>

                {/* Cart with count */}
                <Link href="/cart" className="flex items-center gap-2">
                  <div className="flex-shrink-0 relative">
                    <ShoppingCart size={24} className="text-blue-900" />
                    <Stream value={navigation.cartCount || 2}>
                      {(count) => (
                        count && count > 0 ? (
                          <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                            {count}
                          </span>
                        ) : null
                      )}
                    </Stream>
                  </div>
                  <div className="text-xs md:text-sm hidden sm:block">
                    <div className="font-medium">Cart</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Search bar for mobile - full width under header */}
            <div className="sm:hidden px-4 pb-3">
              <form
                action={navigation.searchHref || '/search'}
                method="get"
                className="relative w-full"
              >
                <input
                  type="text"
                  name={navigation.searchParamName || 'query'}
                  placeholder={navigation.searchInputPlaceholder || 'Search by reference'}
                  className="w-full border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-800"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full bg-blue-900 text-white px-3 rounded-r"
                  aria-label={navigation.searchLabel || 'Search'}
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Blue Category Navigation with full-width dropdown */}
            <nav className="bg-blue-950 relative hidden lg:block">
              <div className="container mx-auto">
                <Stream value={navigation.links || []}>
                  {(links) => (
                    <ul className="m-0 p-0 list-none flex justify-center">
                      {links.map((item, index) => (
                        <li key={index} className="static group">
                          <Link
                            href={item.href}
                            className="block text-white py-4 px-3 xl:px-5 hover:bg-blue-900 transition-colors font-medium text-sm whitespace-nowrap"
                          >
                            {item.label}
                            {item.groups && item.groups.length > 0 && <ChevronDown className="inline-block ml-1" size={14} />}
                          </Link>

                          {item.groups && item.groups.length > 0 && (
                            <div className="absolute left-0 w-full hidden group-hover:block bg-white shadow-lg z-50 border-t border-gray-200">
                              <div className="container mx-auto py-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                  {item.groups.map((group, groupIndex) => (
                                    <div key={groupIndex} className="mb-4">
                                      {group.label && (
                                        <Link
                                          href={group.href || '#'}
                                          className="block font-bold text-gray-800 mb-3 text-base hover:text-blue-800"
                                        >
                                          {group.label}
                                        </Link>
                                      )}
                                      <div>
                                        {group.links.map((link, linkIndex) => (
                                          <Link
                                            key={linkIndex}
                                            href={link.href}
                                            className="block text-gray-600 py-1 text-sm hover:text-blue-800"
                                          >
                                            {link.label}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </Stream>
              </div>
            </nav>

            {/* Mobile Navigation Menu - Slide in from left */}
            {mobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                {/* Backdrop - darken the background */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={toggleMobileMenu}
                ></div>

                {/* Slide-in menu */}
                <div className="relative flex-1 flex flex-col w-full max-w-xs bg-white overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-blue-900">Menu</h2>
                  </div>

                  <Stream value={navigation.links || []}>
                    {(links) => (
                      <div className="divide-y divide-gray-100">
                        {links.map((item, index) => (
                          <div key={index} className="py-2">
                            <div className="flex items-center justify-between px-4">
                              <Link
                                href={item.href || '#'}
                                className="py-2 text-gray-900 font-medium"
                                onClick={item.href ? () => setMobileMenuOpen(false) : undefined}
                              >
                                {item.label}
                              </Link>

                              {item.groups && item.groups.length > 0 && (
                                <button
                                  className="p-2 text-gray-500"
                                  onClick={() => toggleDropdown(index)}
                                  aria-expanded={activeDropdown === index}
                                >
                                  <ChevronDown
                                    className={clsx(
                                      "h-5 w-5 transition-transform",
                                      activeDropdown === index ? "rotate-180" : ""
                                    )}
                                  />
                                </button>
                              )}
                            </div>

                            {activeDropdown === index && item.groups && (
                              <div className="mt-2 pl-4 pr-2 pb-2">
                                {item.groups.map((group, groupIndex) => (
                                  <div key={groupIndex} className="mb-3">
                                    {group.label && (
                                      <Link
                                        href={group.href || '#'}
                                        className="block font-semibold text-gray-800 mb-2 hover:text-blue-800"
                                        onClick={group.href ? () => setMobileMenuOpen(false) : undefined}
                                      >
                                        {group.label}
                                      </Link>
                                    )}
                                    <div className="space-y-1 pl-2">
                                      {group.links.map((link, linkIndex) => (
                                        <Link
                                          key={linkIndex}
                                          href={link.href}
                                          className="block text-gray-600 py-1 text-sm hover:text-blue-800"
                                          onClick={() => setMobileMenuOpen(false)}
                                        >
                                          {link.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Stream>

                  {/* Additional mobile menu links */}
                  <div className="mt-auto border-t border-gray-200 pt-4 pb-6 px-4">
                    <Link href="/about-us" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                      About Us
                    </Link>
                    <Link href="/contact-us" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                      Contact Us
                    </Link>
                    <Link href="tel:+14388002658" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                      Call Us: 438 800 2658
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Gold border below navigation */}
            <div className="h-[6px] w-full" style={{
              background: '#ca9618'
            }}></div>
          </div>
        </Headroom>

        {/* Banner Section - Hidden on mobile */}
        <div className="border-t border-b border-gray-200 bg-white py-4 shadow-md hidden md:block">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center md:justify-between items-center px-4">
              {/* Free Delivery */}
              <div className="w-full sm:w-1/2 md:w-1/5 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="flex items-center">
                  <img
                    src="https://www.qualitybearingsonline.com/content/NewSite/Customer-Service.png"
                    alt="Customer Service"
                    className="w-12 h-12 mr-3"
                  />
                  <div className="text-sm font-medium">
                    <Link href="/customer-service/" className="hover:text-blue-800">
                      Free Delivery<br />
                      Over $300.00
                    </Link>
                  </div>
                </div>
              </div>

              {/* 1-3 Day Delivery */}
              <div className="w-full sm:w-1/2 md:w-1/5 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="flex items-center">
                  <img
                    src="https://www.qualitybearingsonline.com/content/NewSite/UK-Delivery.png"
                    alt="USA Delivery"
                    className="w-12 h-12 mr-3"
                  />
                  <div className="text-sm font-medium">
                    <Link href="/delivery-information/" className="hover:text-blue-800">
                      1-3 Day DHL & UPS<br />
                      Delivery
                    </Link>
                  </div>
                </div>
              </div>

              {/* Queen's Award */}
              <div className="w-full sm:w-1/2 md:w-1/5 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="flex items-center">
                  <img
                    className="w-12 h-12 mr-3"
                    src="https://store-03842.mybigcommerce.com/content/Queens_Award_Logo_black.png"
                    alt="Queen's Award For Enterprise For International Trade"
                  />
                  <div className="text-sm font-medium">
                    <Link href="/blog/9/" className="hover:text-blue-800">
                      Queen's Award For<br />
                      Enterprise Winners
                    </Link>
                  </div>
                </div>
              </div>

              {/* ISO Certificate */}
              <div className="w-full sm:w-1/2 md:w-1/5 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="flex items-center">
                  <img
                    src="https://www.qualitybearingsonline.com/content/NewSite/qms.png"
                    alt="ISO Certificate"
                    className="w-12 h-12 mr-3"
                  />
                  <div className="text-sm font-medium">
                    <Link href="https://store-03842.mybigcommerce.com/content/ISO_9001_2015_Certificate.pdf" target="_blank" className="hover:text-blue-800">
                      ISO 9001 : 2015<br />
                      Cert. No.291342018
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feefo Rating */}
              <div className="w-full sm:w-1/2 md:w-1/5 flex justify-center md:justify-start">
                <div className="flex items-center">
                  <Link href="https://www.feefo.com/reviews/quality-bearings-online" target="_blank" rel="noopener noreferrer">
                    <img
                      className="h-10"
                      alt="Feefo logo"
                      src="https://api.feefo.com/api/logo?merchantidentifier=quality-bearings-online&template=Service-Stars-Yellow-150x38.png"
                      title="Our customer Feefo rating"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

// This is copied directly from the Navigation component and modified for the black bar
function CurrencySelector({
  currencies,
  activeCurrencyId,
  currencyAction,
}: {
  currencies: Currency[];
  activeCurrencyId?: string;
  currencyAction: CurrencyAction;
}) {
  const [isPending, startTransition] = useTransition();
  const [lastResult, formAction] = useActionState(currencyAction, null);
  const activeCurrency = currencies.find((currency) => currency.id === activeCurrencyId);

  useEffect(() => {
    if (lastResult?.error) console.log(lastResult.error);
  }, [lastResult?.error]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="flex items-center gap-1 text-white uppercase transition-opacity [&:disabled]:opacity-30 font-medium text-xs sm:text-sm"
        disabled={isPending}
      >
        {activeCurrency?.label ?? currencies[0].label}
        <ChevronDown size={14} strokeWidth={1.5} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 max-h-80 overflow-y-scroll rounded-md bg-white p-2 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 w-32"
          sideOffset={16}
        >
          {currencies.map((currency) => (
            <DropdownMenu.Item
              className={clsx(
                'cursor-default rounded-md bg-transparent px-2.5 py-2 text-sm font-medium text-gray-600 outline-none transition-colors hover:bg-gray-100 hover:text-gray-900',
                {
                  'text-gray-900 font-semibold': currency.id === activeCurrencyId,
                },
              )}
              key={currency.id}
              onSelect={() => {
                // eslint-disable-next-line @typescript-eslint/require-await
                startTransition(async () => {
                  const formData = new FormData();
                  formData.append('id', currency.id);
                  formAction(formData);
                });
              }}
            >
              {currency.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

HeaderSection.displayName = 'HeaderSection';