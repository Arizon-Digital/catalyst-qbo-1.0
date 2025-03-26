"use client";

import React, { useEffect } from "react";

const CookieConsent = ({value}:{value:string}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src='//consent.cookiebot.com/uc.js';
    script.id='Cookiebot';
    script.setAttribute('data-cbid', value);
    script.async= true;
    document.head.appendChild(script);
  }, []);

  return (<></>);
};

export default CookieConsent;
