"use client";

import React, { useEffect } from "react";

const CookieConsent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src='//consent.cookiebot.com/uc.js';
    script.id='Cookiebot';
    script.setAttribute('data-cbid', '1e0cfc39-7b56-4c7b-8192-1727b01e3fde');
    script.async= true;
    document.head.appendChild(script);
  }, []);

  return (<></>);
};

export default CookieConsent;
