

'use client';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { BcImage } from '~/components/bc-image';
import { Link as CustomLink } from '~/components/link';
import { Button } from '../button';
import { Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { getCurrencyListData, getCurrencyCodeFn, setCurrencyCodeFn } from "~/components/header/_actions/getCurrencyList";
import { useCommonContext } from '~/components/common-context/common-provider';
import { updateCartCurrency } from '../graphql-apis';


export const MobileNav = ({ links, logo }: Props) => {
  const [open, setOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [currency, setCurrency] = useState([]);
  const [currencyCode, setCurrencyCode] = useState('');
  const [showExclTax, setShowExclTax] = useState(false);
  const getCommonContext: any = useCommonContext();
  const t = useTranslations('Components.Header.Navigation');

  useEffect(() => {
    const getCurrencyData = async () => {
      let currencyData: any = await getCurrencyListData();
      let currencyOptions: any = currencyData?.map(
        ({code, name}: {code: string; name: string;}) => ({
          value: code,
          label: code,
        }),
      );
      setCurrency(currencyOptions);
      let currencyCookieData: string = (await getCurrencyCodeFn()) || 'CAD';
      setCurrencyCode(currencyCookieData);
    };
    getCurrencyData();
  }, []);

  const onCurrencyChange = async (currencyCode: string) => {
    await setCurrencyCodeFn(currencyCode);
    await updateCartCurrency(currencyCode);
    setCurrencyCode(currencyCode);
    getCommonContext.setCurrencyCodeFn(currencyCode);
    setShowExclTax(currencyCode === 'GBP');
    location.reload();
  };

  const toggleMenu = (menuPath: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenus(prev => ({
      ...prev,
      [menuPath]: !prev[menuPath]
    }));
  };

  const renderNestedMenu = (menuItem: Links, path: string) => {
    const isOpen = openMenus[path];
    
    return (
      <div key={menuItem.href} className="w-full">
        <div 
          onClick={(e) => toggleMenu(path, e)}
          className="group/button flex w-full items-center justify-between p-3 ps-0 font-semibold hover:text-primary cursor-pointer"
        >
          <span className="font-semibold text-#ffffff">{menuItem.label}</span>
          <ChevronDown
            aria-hidden="true"
            className={`transition duration-200 ${isOpen ? '-rotate-180' : ''}`}
          />
        </div>
        
        {isOpen && (
          <>
            <CustomLink
              href={menuItem.href}
              className="block p-2 ps-4 text-#ffffff hover:text-primary mb-2"
              onClick={() => setOpen(false)}
            >
              All {menuItem.label}
            </CustomLink>

            {menuItem.groups?.map((group, groupIndex) => (
              <div key={groupIndex} className="ps-4">
                <div
                  onClick={(e) => toggleMenu(`${path}-${groupIndex}`, e)}
                  className="flex items-center justify-between p-2 ps-0 font-semibold cursor-pointer text-#ffffff"
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`transition duration-200 ${
                      openMenus[`${path}-${groupIndex}`] ? '-rotate-180' : ''
                    }`}
                  />
                </div>
                {openMenus[`${path}-${groupIndex}`] && (
                  <>
                    <CustomLink
                      href={group.href || `/${group.label.toLowerCase()}`}
                      className="block p-2 ps-4 text-#ffffff-500 hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      All {group.label}
                    </CustomLink>
                    {group.links?.map(link => (
                      <CustomLink
                        key={link.href}
                        href={link.href}
                        className="block p-2 ps-4 text-#ffffff hover:text-primary"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </CustomLink>
                    ))}
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <SheetPrimitive.Root onOpenChange={setOpen} open={open}>
      <SheetPrimitive.Trigger asChild>
        <Button
          aria-controls="nav-menu"
          className="group bg-transparent p-3 text-black hover:bg-transparent hover:text-primary lg:hidden"
          variant="subtle"
        >
          <Menu />
        </Button>
      </SheetPrimitive.Trigger>
      <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <SheetPrimitive.Content className="fixed inset-y-0 left-0 z-50 h-full w-3/4 border-r p-6 pt-0 shadow-lg transition ease-in-out overflow-y-auto overscroll-contain data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm">
          <div className="flex h-[92px] items-center justify-between">
            {typeof logo === 'object' ? (
              <BcImage
                alt={logo.altText}
                className="max-h-16 object-contain"
                height={32}
                priority
                src={logo.src}
                width={155}
              />
            ) : (
              <span className="truncate text-2xl font-black">{logo}</span>
            )}
            <SheetPrimitive.Close className="p-3">
              <X className="h-6 w-6" />
            </SheetPrimitive.Close>
          </div>
          
          <div className="flex flex-col gap-2">
            {links.map((link, index) => renderNestedMenu(link, `menu-${index}`))}
            
            <CustomLink href="/about-us" className="block p-3 ps-0 text-#ffffff">About Us</CustomLink>
            {/* <CustomLink href="/10-year-anniversary" className="block p-3 ps-0 text-#ffffff">10 Year Anniversary</CustomLink> */}
            <CustomLink href="/contact-us" className="block p-3 ps-0 text-#ffffff">Contact Us</CustomLink>
            <CustomLink href="/customer-service" className="block p-3 ps-0 text-#ffffff">Customer Service</CustomLink>
            <CustomLink href="/delivery-information" className="block p-3 ps-0 text-#ffffff">Delivery Information</CustomLink>
            <CustomLink href="/faqs" className="block p-3 ps-0 text-#ffffff">FAQs</CustomLink>
            <CustomLink href="/privacy-policy" className="block p-3 ps-0 text-#ffffff">Privacy Policy</CustomLink>
            <CustomLink href="/customer-reviews" className="block p-3 ps-0 text-#ffffff">Customer Reviews</CustomLink>
            <CustomLink href="/terms-and-conditions" className="block p-3 ps-0 text-#ffffff">Terms & Conditions</CustomLink>
            <CustomLink href="/blog" className="block p-3 ps-0 text-#ffffff">Blog</CustomLink>

            {/* Currency Selection */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <span className="block p-3 ps-0 text-#ffffff font-semibold">Select Currency:</span>
              {currency.map((curr: { value: string, label: string }) => (
                <button
                  key={curr.value}
                  onClick={() => onCurrencyChange(curr.value)}
                  className={`block w-full text-left p-3 ps-4 ${
                    currencyCode === curr.value ? 'text-primary' : 'text-#ffffff'
                  } hover:text-primary`}
                >
                  {curr.label}
                </button>
              ))}
            </div>

            {/* Authentication Links */}
            <div className="mt-4 border-t border-gray-700 pt-4">
              <CustomLink href="/login/" className="block p-3 ps-0 text-#ffffff">Sign In</CustomLink>
              <CustomLink href="/register" className="block p-3 ps-0 text-#ffffff">Register</CustomLink>
            </div>

            <div className="mt-4 flex gap-4 p-3 ps-0">
              <a href="https://www.instagram.com/qualitybearings/" className="text-#fff hover:text-primary">
                <Instagram size={24} />
              </a>
              <a href="https://www.linkedin.com/company/quality-bearings-online-limited/" className="text-#fff hover:text-primary">
                <Linkedin size={24} />
              </a>
              <a href="https://www.facebook.com/qualitybearings" className="text-#fff hover:text-primary">
                <MessageCircle size={24} />
              </a>
            </div>
          </div>
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
};