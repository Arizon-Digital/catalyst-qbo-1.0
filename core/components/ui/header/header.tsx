'use client';

import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { ChevronDown, X } from 'lucide-react';
import { Phone, Inbox } from 'lucide-react';
import ScrollToTop from './scrolltop';
import { ComponentPropsWithoutRef, ReactNode, useState, useEffect } from 'react';
import { BcImage } from '~/components/bc-image';
import { Link as CustomLink } from '~/components/link';
import { cn } from '~/lib/utils';
import { type Locale, LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import Minicart, { MiniCart } from '../header/minicart';
import ViewedItemsPopover from './ViewedItemsPopover';
import DoofinderScriptLoader from '~/app/[locale]/(default)/product/[slug]/_components/Doofinder';
import HubspotChat from '~/app/[locale]/(default)/product/[slug]/_components/Chatbot';
import { GetCurrencyList } from './currency';


import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import HrefLang from '~/app/[locale]/hreflang';

interface Link {
  label: string;
  href: string;
}

interface Group {
  label: string;
  href: string;
  links?: Link[];
}

interface Image {
  src: string;
  altText: string;
}

interface Links {
  label: string;
  href: string;
  groups?: Group[];
}

interface Props extends ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> {
  account?: ReactNode;
  activeLocale?: string;
  locales: Locale[];
  cart?: ReactNode;
  links: Links[];
  locale?: ReactNode;
  logo?: string | Image;
  search?: ReactNode;
  dooFinderKey?: string;
}

const Header = ({
  account,
  activeLocale,
  cart,
  className,
  links,
  locales,
  logo,
  search,
  dooFinderKey,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCartClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`${
          isScrolled
            ? 'animate-slideDown fixed left-0 right-0 top-0 z-[1000] w-full shadow-lg'
            : 'relative'
        } bg-white transition-all duration-300`}
      >
        {/* Top navbar */}
        <div className="relative z-[1] w-full border-b border-gray-100 bg-white">
          <div className="navbar navbar-black [&_select-currency]:p-0 [&_select-currency]:h-[unset] justify-start pl-[57.9%]">
            <a className="contact-link" href="/about-us">
              <i className="contact-link"></i> About Us
            </a>
            <div className="relative z-10 hover:!text-[#ca9618] flex items-center [&_.select-currency]:!pr-[12px]  !pl-[12px] !border-l !border-l-[#fff3] ">
              <GetCurrencyList />
            </div>
            <a href="/contact-us" className="contact-link">
              <Inbox size={15} /> Contact Us
            </a>
            <a href="tel:438 800 2658" className="contact-link">
              <Phone size={15} /> CAN: 438 800 2658      </a>
          </div>
          <div className="navbar-tab flex h-[50px] flex-row items-center justify-center bg-[#1a2348] md:hidden">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="">
                  <div className="flex items-center gap-[10px] hover:cursor-pointer">
                    <div>
                      <Phone stroke="white" fill="white" strokeWidth={0} />
                    </div>
                    <div className="text-[18px] font-[700] leading-[1.5] text-[#ffffff]">
                      Call Us
                    </div>
                  </div>
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent relative z-[99999999999] !p-0 text-[#131313] !shadow-[0_10px_38px_2000px_#0e121659,_0_10px_20px_2000px_#0e121633] !max-w-[80vw]">
                  <div className=" border-b border-b-[#ccc] bg-[#fafafa]">
                    <div className='flex items-center justify-between mx-[2%] p-[12px]'>
                    <Dialog.Title className="flex-1 text-center text-[#000000] text-[30px] font-[700]">
                      Give Us A Call
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="" aria-label="Close">
                        <X />
                      </button>
                    </Dialog.Close>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-[5px] p-[40px_15px] bg-[#f1f1f2]">
                    <div className='text-left'>
                      <Link href="tel:4388003614" className='hover:text-blue-800'>
                    <Dialog.Description className="text-[1rem] text-[#131313] font-[700]">CAN: <span className='text-[#282828] font-[300]'>438 800 3614</span></Dialog.Description>
                    </Link>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>

        {/* Main header */}
        <header className="z-900 w-full border-b border-gray-100">
          <div className="header-2 relative flex items-center justify-center p-[0] nmd:static nmd:gap-[25px] nmd:py-[25px] cursor-pointer">
            <CustomLink
              className="header-logo-a flex w-full nmd:w-[calc((400/1600)*100vw)] mobilelogo cursor-pointer"
              href="/"
            >
              {typeof logo === 'object' ? (
                <BcImage
                  alt={logo.altText}
                  className="header-logo h-[50px] w-full min-w-[173px]  object-contain nmd:h-[100px] cursor-pointer"
                  height={108}
                  priority
                  src={logo.src}
                  width={384}

                />
              ) : (
                <span className="">{logo}</span>
              )}
            </CustomLink>

            <div className="header-elements absolute flex w-full items-center gap-[20px] nmd:static nmd:w-auto">
              <div className="header-search hidden nmd:block">{search}</div>
              <div className="flex items-center gap-[20px] nmd:w-auto">
                <nav className="account header-account hidden nmd:block">{account}</nav>
                <div className="header-cart flex w-full items-center nmd:w-auto">
                  <div className="header-cart-div absolute right-0 flex items-center pr-[10px] nmd:static nmd:pr-0">
                    <nav className="header-viewedItems hidden nmd:block">
                      <div className="text">
                        <ViewedItemsPopover />
                      </div>
                    </nav>
                    { <nav className="header-cart-icon pl-10px nmd:p-0">
                      <button onClick={handleCartClick}>
                        {cart}
                      </button>
                    </nav> }
                    <div className="flex flex-col flex-wrap items-center gap-0 pl-[5px]">
                      <div className="text">
                        <ScrollToTop />
                        {<DoofinderScriptLoader value={dooFinderKey} />}
                        <HubspotChat portalId={139717848} />
                        <HrefLang />
                      </div>
                      <div className="texts" />
                      {activeLocale && locales.length > 0 ? (
                        <LocaleSwitcher activeLocale={activeLocale} locales={locales} />
                      ) : null}
                    </div>
                  </div>
                  <MobileNav links={links} logo={logo} />
                </div>
              </div>
            </div>
          </div>
          <div className="header-search-2 nmd:hidden">{search}</div>
        </header>
      </div>

      {isScrolled && <div className="h-[150px]" />}

      <div className="relative border-b border-gray-100 bg-white">
        <NavigationMenuPrimitive.Root id="nav-menu-root" className="hidden lg:block nav-root-ele">
          <NavigationMenuPrimitive.List
            id="nav-menu-list"
            className="flex items-center justify-center gap-2 lg:gap-4 flex-wrap navbar-list-blue"
          >
            {links.map((link) =>
              link.groups && link.groups.length > 0 ? (
                <NavigationMenuPrimitive.Item id={`nav-menu-item-${link.href}`} key={link.href}>
                  <NavigationMenuPrimitive.Trigger
                    id={`nav-menu-trigger-${link.href}`}
                    className="group/button flex items-center font-semibold hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 py-1 px-1"
                  >
                    <CustomLink
                      id={`nav-menu-link-${link.href}`}
                      className="font-[700] text-[15px] p-0.5"
                      href={link.href}
                    >
                      {link.label}
                    </CustomLink>
                    <ChevronDown
                      id={`nav-menu-chevron-${link.href}`}
                      aria-hidden="true"
                      className="cursor-pointer transition duration-200 h-4 w-4"
                    />
                  </NavigationMenuPrimitive.Trigger>

                  <NavigationMenuPrimitive.Content
                    id={`nav-menu-content-${link.href}`}
                    className="absolute left-0 z-[70] w-full bg-white shadow-lg"
                  >
                    <div className="mx-auto flex max-w-7xl flex-wrap justify-start gap-6 px-4 py-4">
                      {link.groups.map((group, index) => (
                        <ul
                          id={`nav-menu-group-${group.href}`}
                          className="flex w-56 flex-col"
                          key={`${index}-${group.href}`}
                        >
                          <li id={`nav-menu-group-item-${group.href}`}>
                            <NavigationMenuPrimitive.Link asChild>
                              <CustomLink
                                id={`nav-menu-group-link-${group.href}`}
                                className="mb-2 block border-b border-gray-100 p-2 font-semibold"
                                href={group.href}
                              >
                                {group.label}
                              </CustomLink>
                            </NavigationMenuPrimitive.Link>
                          </li>
                          {group.links?.map((nestedLink) => (
                            <li
                              id={`nav-menu-nested-item-${nestedLink.href}`}
                              key={nestedLink.href}
                            >
                              <NavigationMenuPrimitive.Link asChild>
                                <CustomLink
                                  id={`nav-menu-nested-link-${nestedLink.href}`}
                                  className="block p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  href={nestedLink.href}
                                >
                                  {nestedLink.label}
                                </CustomLink>
                              </NavigationMenuPrimitive.Link>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </NavigationMenuPrimitive.Content>
                </NavigationMenuPrimitive.Item>
              ) : (
                <NavigationMenuPrimitive.Item id={`nav-menu-item-${link.href}`} key={link.href}>
                  <NavigationMenuPrimitive.Link asChild>
                    <CustomLink
                      id={`nav-menu-link-${link.href}`}
                      className="p-3 font-semibold"
                      href={link.href}
                    >
                      {link.label}
                    </CustomLink>
                  </NavigationMenuPrimitive.Link>
                </NavigationMenuPrimitive.Item>
              ),
            )}
          </NavigationMenuPrimitive.List>

          <NavigationMenuPrimitive.Viewport
            id="nav-menu-viewport"
            className="absolute start-0 top-full z-[65] w-full bg-white shadow-lg"
          />
        </NavigationMenuPrimitive.Root>
      </div>

      {/* Banner Section */}
      <section className="header-banner border-t border-gray-200 bg-white">
        <div className="row container">
          <article className="hb-item">
            <div className="hb-card">
              <figure className="hb-image">
                <a href="/customer-service/" title="Free Delivery Over $300.00">
                  <img
                    src="https://www.qualitybearingsonline.com/content/NewSite/Customer-Service.png"
                    alt="Customer Service"
                  />
                </a>
              </figure>
              <div className="hb-text">
                <a href="/customer-service/" title="Free Delivery Over $300.00">
                  Free Delivery <br />
                  Over $300.00
                </a>
              </div>
            </div>
          </article>
          <article className="hb-item">
            <div className="hb-card">
              <figure className="hb-image">
                <a href="/delivery-information/" title="1-3 Day Delivery Available">
                  <img
                    src="https://www.qualitybearingsonline.com/content/NewSite/UK-Delivery.png"
                    alt="USA Delivery"
                  />
                </a>
              </figure>
              <div className="hb-text">
                <a href="/delivery-information/" title="1-3 Day DHL &amp; UPS Delivery">
                  1-3 Day DHL &amp; UPS
                  <br />
                  Delivery
                </a>
              </div>
            </div>
          </article>
          <article className="hb-item">
            <div className="hb-card">
              <figure className="hb-image">
                <a
                  href="/blogcelebrating-our-10-year-anniversary-crowned-with-the-queens-award/"
                  title="Queen's Award For Enterprise For International Trade"
                >
                  <img
                    className="queenlogo"
                    src="https://store-03842.mybigcommerce.com/content/Queens_Award_Logo_black.png"
                    alt="Queen's Award For Enterprise For International Trade"
                  />
                </a>
              </figure>
              <div className="hb-text">
                <a
                  target="_self"
                  href="/blog/9/"
                  title="Queen's Award For Enterprise For International Trade"
                >
                  Queen's Award For
                  <br />
                  Enterprise Winners
                </a>
              </div>
            </div>
          </article>
          <article className="hb-item">
            <div className="hb-card">
              <figure className="hb-image">
                <a
                  href="https://www.qualitybearingsonline.com/content/29134-copy-cert-quality-bearings-online-ltd-9001-050418.pdf"
                  target="_new"
                  title="ISO 9001 PDF"
                >
                  <img
                    src="https://www.qualitybearingsonline.com/content/NewSite/qms.png"
                    alt="ISO Certificate"
                  />
                </a>
              </figure>
              <div className="hb-text">
                <a
                  href="https://store-03842.mybigcommerce.com/content/ISO_9001_2015_Certificate.pdf"
                  target="_new"
                  title="ISO 9001 PDF"
                >
                  ISO 9001 : 2015
                  <br />
                  Cert. No.291342018
                </a>
              </div>
            </div>
          </article>
          <article className="hb-item">
            <div className="hb-card">
              <figure className="hb-image hb-image-full">
                <a
                  href="https://www.feefo.com/reviews/quality-bearings-online"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tagrocket-clicked-outboundlink="1"
                >
                  <img
                    className="feefo"
                    alt="Feefo logo"
                    src="https://api.feefo.com/api/logo?merchantidentifier=quality-bearings-online&amp;template=Service-Stars-Yellow-150x38.png"
                    title="Our customer Feefo rating"
                  />
                </a>
              </figure>
            </div>
          </article>
        </div>
      </section>
      <div id="feefo-service-review-floating-widgetId"></div>
    </>
  );
};

Header.displayName = 'Header';

export { Header, type Links };
