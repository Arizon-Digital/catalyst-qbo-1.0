"use client"

import { usePathname } from '~/i18n/routing';

export default function HrefLang() {
  const pathname = usePathname();

  if (typeof window !== "undefined") {
    let linkDefault = document.createElement('link');
    linkDefault.hreflang = 'x-default';
    linkDefault.rel = 'alternate';
    linkDefault.href = 'https://www.qualitybearingsonline.com/';
    linkDefault.id = 'default_hreflang';
    
    let scriptDefault = document.getElementById('default_hreflang');
    if (scriptDefault) {
      document.head.removeChild(scriptDefault);
    }
    document.head.appendChild(linkDefault);
    
    let linkCaDefault = document.createElement('link');
    linkCaDefault.hreflang = 'en-ca';
    linkCaDefault.rel = 'alternate';
    linkCaDefault.href = 'https://www.qualitybearingsonline.ca/';
    linkCaDefault.id = 'ca_hreflang';
    
    let scriptCA = document.getElementById('ca_hreflang');
    if (scriptCA) {
      document.head.removeChild(scriptCA);
    }
    document.head.appendChild(linkCaDefault);
  }
  
  return (<></>)
}