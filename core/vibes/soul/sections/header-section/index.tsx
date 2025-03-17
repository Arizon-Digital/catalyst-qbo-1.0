

'use client';

import { forwardRef, useEffect, useState, useRef } from 'react';
import { Phone, Mail, ChevronDown, Search, Menu, X, Trash2, ShoppingBag } from 'lucide-react';
import { clsx } from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTransition } from 'react';
import { useActionState } from 'react';


import { Banner } from '@/vibes/soul/primitives/banner';
import { Navigation } from '@/vibes/soul/primitives/navigation';
import { Link } from '~/components/link';
import { Logo } from '@/vibes/soul/primitives/logo';
import { Stream } from '@/vibes/soul/lib/streamable';
import { getCartData, getCartId } from '~/components/common-functions';
import ViewedItemsPopover from './Recently Viewed Products Popover';
import { BcImage } from '~/components/bc-image';
import { Button } from '~/components/ui/button/button';

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
    const [isOpen, setIsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    
    // Add this line to define customerAccessToken with a default value
    const [customerAccessToken, setCustomerAccessToken] = useState<string | null>(null);
    
    // Add miniCartIcon variable with the specific image URL
    const miniCartIcon = "https://www.qualitybearingsonline.ca/_next/static/media/mini-cart-icon.a78bafe5.png";

    // MiniCart states
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [removeError, setRemoveError] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<any>({ lineItems: { physicalItems: [] } });
    const [hasItems, setHasItems] = useState(false);
    const cartRef = useRef<HTMLDivElement>(null);
    const [cartId, setCartId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize cart and set up outside click handler
    useEffect(() => {
      const initCart = async () => {
        try {
          const cartIdData = await getCartId();
          setCartId(cartIdData);
          
          
        } catch (error) {
          console.error('Error getting cart ID:', error);
        }
      };

      initCart();

      const handleClickOutside = (event: MouseEvent) => {
        if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
          setIsCartOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
      if (mobileMenuOpen) setActiveDropdown(null);
    };

    const toggleDropdown = (index: number) => {
      setActiveDropdown(activeDropdown === index ? null : index);
    };

    // Load mini cart data
    const loadMiniBag = async () => {
      setIsCartOpen(true);
      setLoading(true);

      try {
        // Get real cart data from your API
        const cartData = await getCartData();
        console.log("Cart data loaded (full cart):", cartData); // Debug full cart data

        if (cartData?.lineItems?.physicalItems && cartData.lineItems.physicalItems.length > 0) {
          // Debug the first item to see its structure
          console.log("First cart item structure:", cartData.lineItems.physicalItems[0]);
          setCartItems(cartData);
          setHasItems(cartData?.lineItems?.physicalItems.length > 0);
        } else {
          setCartItems({ lineItems: { physicalItems: [] } });
          setHasItems(false);
        }
      } catch (error) {
        console.error('Error loading cart data:', error);
        setCartItems({ lineItems: { physicalItems: [] } });
        setHasItems(false);
      } finally {
        setLoading(false);
      }
    };

    // Handle removing item from cart
    const handleRemoveItem = async (e: React.FormEvent<HTMLFormElement>, lineItemEntityId: string) => {
      e.preventDefault();
      setLoading(true);

      try {
        // Import the removeItem function dynamically to avoid import errors
        const removeItemModule = await import('~/app/[locale]/(default)/cart/_actions/remove-item');
        const removeItem = removeItemModule.removeItem;

        // Call the removeItem function with the correct parameters
        const result = await removeItem({
          lineItemEntityId,
        });

        // After removal, reload the cart data
        await loadMiniBag();

        if (result.status === 'error') {
          setRemoveError(result.error || 'Failed to remove item');
          console.error('Error removing item:', result.error);
        } else {
          setRemoveError(null);
        }
      } catch (error) {
        console.error('Error removing item:', error);
        setRemoveError('Failed to remove item');

        // Fallback: If the import fails, manually reload the cart
        await loadMiniBag();
      } finally {
        setLoading(false);
      }
    };

    const navigationLinks = navigation?.links || [];
    const cartCount = navigation?.cartCount || 0;

    return (
      <>
        <div ref={ref} className="fixed top-0 left-0 right-0 w-full z-[9999] bg-white shadow-md">
          {banner && <Banner {...banner} />}

          <div className="bg-black text-white py-2 px-4">
            <div className="container mx-auto flex justify-end items-center">
              <div className="flex items-center gap-2 md:gap-6 flex-wrap justify-end font-oswald">
                <Link href="/about-us" className="flex items-center gap-1 text-white hover:text-gray-300 font-medium text-xs sm:text-sm">
                  <span>About Us</span>
                </Link>

                {navigation.currencies && navigation.currencies.length > 0 && navigation.currencyAction && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium hidden sm:inline">Select Currency:</span>
                    <CurrencySelector
                      currencies={navigation.currencies}
                      activeCurrencyId={navigation.activeCurrencyId}
                      currencyAction={navigation.currencyAction}
                    />
                  </div>
                )}

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

          <div className="bg-white">
            <div className="container mx-auto py-3 md:py-5 flex items-center justify-between px-4">
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

              <div className="flex-shrink-0">
                <Logo
                  className={clsx(navigation.mobileLogo != null ? 'hidden md:flex' : 'flex')}
                  height={navigation.logoHeight || 330}
                  href="/"
                  label={navigation.logoLabel || 'Quality Bearings Online'}
                  logo={navigation.logo}
                  width={navigation.logoWidth || 600}
                />
                {navigation.mobileLogo != null && (
                  <Logo
                    className="flex md:hidden"
                    height={navigation.mobileLogoHeight || 70}
                    href="/"
                    label={navigation.logoLabel || 'Quality Bearings Online'}
                    logo={navigation.mobileLogo}
                    width={navigation.mobileLogoWidth || 180}
                  />
                )}
              </div>

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
  className="absolute right-0 top-0 h-full px-3 md:px-4 rounded-r text-white bg-gradient-to-r from-blue-900 to-blue-900/70"
  aria-label={navigation.searchLabel || 'Search'}
>
 
                    <Search size={20} />
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-2 md:gap-6 lg:gap-8">

                {customerAccessToken ? (
                  <div className="flex items-center">
                    <div className='user-icon'>
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="6" r="4" stroke="#000000" strokeWidth="1"></circle>
                        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#000000" strokeWidth="1" fill="none"></path>
                        <line x1="4" y1="20" x2="20" y2="20" stroke="#000000" strokeWidth="1" strokeLinecap="round"></line>
                      </svg>
                    </div>
                    <div className='flex sign/registration'>
                      <Link
                        href="/account"
                        className="flex items-center p-0"
                        aria-label="My Account"
                      >
                        Account
                      </Link>
                      <form action={() => {
                        // Replace with your actual logout action
                        setCustomerAccessToken(null);
                        // Example: localStorage.removeItem('customerToken');
                      }}>
                        <Button
                          type="submit"
                          variant="subtle"
                          className="p-0 hover:bg-transparent"
                        >
                          Sign Out
                        </Button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className='user-icon'>
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="6" r="4" stroke="#000000" strokeWidth="1"></circle>
                        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#000000" strokeWidth="1" fill="none"></path>
                        <line x1="4" y1="20" x2="20" y2="20" stroke="#000000" strokeWidth="1" strokeLinecap="round"></line>
                      </svg>
                    </div>
                    <div className='flex flex-col sign/registration text-[#1c2541] font-light font-robotoslab'>
                      <Link aria-label="Login" className="flex items-center ml-1" href="/login">
                        Sign In
                      </Link>
                      <Link aria-label="Registration" className="ml-1" href="/register/">
                        Register
                      </Link>
                    </div>
                  </div>
                )}

                <div className="text-xs md:text-sm hidden sm:block">
                  <ViewedItemsPopover />
                </div>

                {/* MiniCart Component */}
                <div className="relative" ref={cartRef}>
                  <button
                    onClick={() => loadMiniBag()}
                    className="relative flex items-end gap-1 p-1 rounded-full mini-cart-btn"
                    aria-label="Shopping cart"
                  >
                    {miniCartIcon ? (
                      <BcImage
                        src={miniCartIcon}
                        alt="mini-cart"
                        width={50}
                        height={50}
                      />
                    ) : (
                      <ShoppingBag size={30} className="text-blue-900" />
                    )}
                    
                    <span className="absolute right-1.5 mini-cart-count top-3 h-[20px] w-[30px] flex items-center justify-center rounded-full bg-[#1c2541] text-white text-xs font-bold mini-cart-badge">
                      {navigation.cartCount || 0}
                    </span>
                    
                    <span className="text-[#1a2348] mini-cart-text block font-light text-sm font-robotoslab">Cart</span>
                  </button>

                  {isCartOpen && (
                    <div className="absolute right-0 top-12 w-96 z-50 bg-white rounded-lg border border-gray-200 shadow-sm card-cart">
                      <div className="p-4">
                        <div className="mb-4">
                          <h2 className="text-lg font-bold">Shopping Cart</h2>
                          {removeError && (
                            <p className="text-red-500 text-sm">{removeError}</p>
                          )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                          {hasItems && cartItems?.lineItems?.physicalItems?.length > 0 ? (
                            <>
                              {cartItems.lineItems.physicalItems.map((item: any, index: number) => (
                                <div key={`cart-item-${item.id || index}`} className="py-4 border-b">
                                  <div className="flex">
                                    <div className="w-20 h-20 bg-gray-100 rounded mr-3">
                                      {item.imageUrl ? (
                                        <Link href={item.productUrl || item.url || `/product/${item.productId || item.id}` || '#'}>
                                          <img
                                            src={item.imageUrl}
                                            alt={item.name || 'Product'}
                                            className="w-full h-full object-contain"
                                          />
                                        </Link>
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                          No Image
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm text-gray-600">{item.brand || ''}</div>
                                      <Link
                                        href={item.productUrl || item.url || `/product/${item.productId || item.id}` || '#'}
                                        className="text-blue-600 font-medium block"
                                      >
                                        {item.name || 'Product Name'}
                                      </Link>
                                      <div className="text-sm text-gray-600 mt-1">
                                        SKU: {item.entityId || ''}
                                      </div>
                                      <div className="mt-2">
                                        <span className="text-sm">{item.quantity || 0} x </span>
                                        <span className="font-bold">
                                          {item.extendedSalePrice?.currencyCode || 'C$'}
                                          {parseFloat(item.extendedSalePrice?.value || 0).toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      <form onSubmit={(e) => handleRemoveItem(e, item.entityId || item.id || '')}>
                                        <input type="hidden" name="lineItemEntityId" value={item.entityId || item.id || ''} />
                                        <button
                                          type="submit"
                                          className="text-gray-500 hover:text-red-500"
                                          aria-label="Remove item"
                                        >
                                          <Trash2 size={20} />
                                        </button>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              {loading ? (
                                <div className="text-center py-4">Loading cart data...</div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  Your cart is empty
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {hasItems && cartItems?.lineItems?.physicalItems?.length > 0 && (
                          <div className="mt-4 flex flex-row gap-[10px]">
                            <a
                              href="https://secure.qualitybearingsonline.ca/checkout"
                              className="w-full bg-[#ca9618] text-white font-bold text-sm text-center py-3 rounded-sm uppercase"
                            >
                              CHECKOUT NOW
                            </a>
                            <Link
                              href="/cart"
                              className="w-full bg-white border border-gray-300 text-gray-700 font-medium text-sm text-center py-3 rounded-sm uppercase"
                            >
                              VIEW CART
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

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

            <nav className="relative hidden lg:block" style={{ backgroundColor: '#1a2348' }}>
              <div className="container mx-auto">
                <ul className="m-0 p-0 list-none flex justify-center">
                  {navigationLinks.map((item, index) => (
                    <li key={index} className="static group font-oswald">
                      <Link
                        href={item.href || '#'}
                        className="block text-white py-4 px-3 xl:px-5 hover:bg-blue-900 transition-colors font-bold text-[15px] whitespace-nowrap"
                      >
                        {item.label}
                        {item.groups && item.groups.length > 0 && (
                          <ChevronDown className="inline-block ml-1" size={14} />
                        )}
                      </Link>

                      {item.groups && item.groups.length > 0 && (
                        <div className="absolute left-0 w-full hidden group-hover:block bg-white shadow-lg z-50 border-t border-gray-200 max-w-[90%] ml-[120px]">
                          <div className="container mx-auto py-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 font-robotoslab">
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
                                    {group.links && group.links.map((link, linkIndex) => (
                                      <Link
                                        key={linkIndex}
                                        href={link.href || '#'}
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
              </div>
            </nav>

            <div className="h-[6px] w-full" style={{
              background: '#ca9618'
            }}></div>
          </div>
        </div>

        <div className="h-[200px] w-full"></div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[9999] flex">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={toggleMobileMenu}
            ></div>

            <div className="relative flex-1 flex flex-col w-full max-w-xs bg-[#1a2348] overflow-y-auto">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-blue-900">Menu</h2>
              </div>

              <div className="divide-y divide-gray-100">
                {navigationLinks.map((item, index) => (
                  <div key={index} className="py-2">
                    <div className="flex items-center justify-between px-4">
                      <Link
                        href={item.href || '#'}
                        className="py-2 text-gray-900 font-bold text-[15px]"
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
                              {group.links && group.links.map((link, linkIndex) => (
                                <Link
                                  key={linkIndex}
                                  href={link.href || '#'}
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

        {/* Features section - updated with consistent styling */}
        <div className="border-t border-b border-gray-200 bg-white py-4 shadow-md hidden md:block mt-10">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center md:justify-between items-center px-4">
              <div className="w-full sm:w-1/2 md:w-1/5 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="flex items-center">
                  <img
                    src="https://www.qualitybearingsonline.com/content/NewSite/Customer-Service.png"
                    alt="Free Delivery"
                    className="w-12 h-12 mr-3"
                  />
                  <div className="text-[14px] font-bold">
                    <Link href="/customer-service/" className="hover:text-blue-800 font-robotoslab">
                      Free Delivery<br />
                      Over $300.00
                    </Link>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-1/2 md:w-1/5 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="flex items-center">
                  <img
                    src="https://www.qualitybearingsonline.com/content/NewSite/UK-Delivery.png"
                    alt="DHL & UPS Delivery"
                    className="w-12 h-12 mr-3"
                  />
                  <div className="text-[14px] font-bold">
                    <Link href="/delivery-information/" className="hover:text-blue-800 font-robotoslab">
                      1-3 Day DHL & UPS<br />
                      Delivery
                    </Link>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-1/2 md:w-1/5 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="flex items-center">
                  <img
                    className="w-12 h-12 mr-3"
                    src="https://store-03842.mybigcommerce.com/content/Queens_Award_Logo_black.png"
                    alt="Queen's Award For Enterprise"
                  />
                  <div className="text-[14px] font-bold">
                    <Link href="/blog/9/" className="hover:text-blue-800 font-robotoslab">
                      Queen's Award For<br />
                      Enterprise Winners
                    </Link>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-1/2 md:w-1/5 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="flex items-center">
                  <img
                    src="https://www.qualitybearingsonline.com/content/NewSite/qms.png"
                    alt="ISO Certificate"
                    className="w-12 h-12 mr-3"
                  />
                  <div className="text-[14px] font-bold">
                    <Link href="https://store-03842.mybigcommerce.com/content/ISO_9001_2015_Certificate.pdf" target="_blank" className="hover:text-blue-800 font-robotoslab">
                      ISO 9001 : 2015<br />
                      Cert. No.291342018
                    </Link>
                  </div>
                </div>
              </div>

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
      </>
    );
  },
);

HeaderSection.displayName = 'HeaderSection';

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
          className="z-[10000] max-h-80 overflow-y-scroll rounded-md bg-white p-2 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 w-32"
          sideOffset={16}
        >
          {currencies.map((currency) => (
            <DropdownMenu.Item
              className={clsx(
                'cursor-default rounded-md bg-transparent px-2.5 py-2 text-sm font-medium text-gray-600 outline-none transition-colors hover:bg-gray-100hover:text-gray-900',
                {
                  'text-gray-900 font-semibold': currency.id === activeCurrencyId,
                },
              )}
              key={currency.id}
              onSelect={() => {
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