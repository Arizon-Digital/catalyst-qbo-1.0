'use client';

import { forwardRef, useEffect, useState } from 'react';
import Headroom from 'react-headroom';
import { Phone, Mail, ChevronDown, Search, User, ShoppingCart } from 'lucide-react';
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
    
    return (
      <div ref={ref}>
        {banner && <Banner ref={setBannerElement} {...banner} />}
        
        <Headroom
          onUnfix={() => setIsFloating(false)}
          onUnpin={() => setIsFloating(true)}
          pinStart={bannerHeight}
        >
          {/* Top black bar */}
          <div className="bg-black text-white py-2 px-4">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <Link href="/about-us" className="text-white hover:text-gray-300 font-medium">About Us</Link>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Currency selector */}
                {navigation.currencies && navigation.currencies.length > 1 && navigation.currencyAction && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Select Currency:</span>
                    <CurrencySelector 
                      currencies={navigation.currencies} 
                      activeCurrencyId={navigation.activeCurrencyId} 
                      currencyAction={navigation.currencyAction} 
                    />
                  </div>
                )}
                
                <Link href="/contact-us" className="flex items-center gap-1 text-white hover:text-gray-300 font-medium">
                  <Mail size={16} />
                  <span>Contact Us</span>
                </Link>
                
                <Link href="tel:+14388002658" className="flex items-center gap-1 text-white hover:text-gray-300 font-medium">
                  <Phone size={16} />
                  <span>CAN: 438 800 2658</span>
                </Link>
              </div>
            </div>
          </div>
          
          <div className={clsx(
            "bg-white transition-shadow",
            isFloating && "shadow-lg"
          )}>
            {/* Main header with logo, search, account and cart */}
            <div className="container mx-auto py-5 flex items-center justify-between px-4">
              {/* Logo section */}
              <div className="flex-shrink-0 mr-6">
                <Link href={navigation.logoHref || '/'} className="block">
                  <img 
                    src="/quality-bearings-online-logo.png" 
                    alt="Quality Bearings Online"
                    width={250}
                    height={60}
                    className="h-16 w-auto"
                  />
                </Link>
              </div>
              
              {/* Search bar */}
              <div className="flex-grow max-w-xl mx-4">
                <form 
                  action={navigation.searchHref || '/search'}
                  method="get"
                  className="relative"
                >
                  <input
                    type="text"
                    name={navigation.searchParamName || 'query'}
                    placeholder={navigation.searchInputPlaceholder || 'Search by reference'}
                    className="w-full border border-gray-300 rounded-l px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-0 top-0 h-full bg-blue-900 text-white px-4 rounded-r"
                    aria-label={navigation.searchLabel || 'Search'}
                  >
                    <Search size={22} />
                  </button>
                </form>
              </div>
              
              {/* User authentication and cart */}
              <div className="flex items-center gap-8">
                {/* Sign In/Register */}
                <Link href="/account" className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <User size={28} className="text-blue-900" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Sign In</div>
                    <div>Register</div>
                  </div>
                </Link>
                
                {/* Recently viewed */}
                <Link href="/recently-viewed" className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <svg viewBox="0 0 24 24" width="28" height="28" className="text-blue-900" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="18" rx="2" />
                      <line x1="8" y1="10" x2="16" y2="10" />
                      <line x1="8" y1="14" x2="16" y2="14" />
                      <line x1="8" y1="18" x2="16" y2="18" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Recently</div>
                    <div>Viewed</div>
                  </div>
                </Link>
                
                {/* Cart with count */}
                <Link href="/cart" className="flex items-center gap-4">
                  <div className="flex-shrink-0 relative">
                    <ShoppingCart size={28} className="text-blue-900" />
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
                  <div className="text-sm">
                    <div className="font-medium">Cart</div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Blue Category Navigation with full-width dropdown */}
            <nav className="bg-blue-950 relative">
              <div className="container mx-auto">
                <Stream value={navigation.links || []}>
                  {(links) => (
                    <ul className="m-0 p-0 list-none flex justify-start">
                      {links.map((item, index) => (
                        <li key={index} className="static group">
                          <Link 
                            href={item.href} 
                            className="block text-white py-4 px-5 hover:bg-blue-900 transition-colors font-medium text-sm"
                          >
                            {item.label}
                            {item.groups && item.groups.length > 0 && <ChevronDown className="inline-block ml-1" size={14} />}
                          </Link>
                          
                          {item.groups && item.groups.length > 0 && (
                            <div className="absolute left-0 w-full hidden group-hover:block bg-white shadow-lg z-50 border-t border-gray-200">
                              <div className="container mx-auto py-6">
                                <div className="grid grid-cols-4 gap-6">
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
            
            {/* Gold border below navigation */}
            <div className="h-[6px] w-full" style={{
              background: '#ca9618'
            }}></div>
          </div>
        </Headroom>
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
        className="flex items-center gap-1 text-white uppercase transition-opacity [&:disabled]:opacity-30 font-medium"
        disabled={isPending}
      >
        {activeCurrency?.label ?? currencies[0].label}
        <ChevronDown size={16} strokeWidth={1.5} />
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