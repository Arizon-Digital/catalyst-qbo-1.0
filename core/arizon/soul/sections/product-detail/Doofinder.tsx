"use client";

import React, { useEffect, useState } from "react";
import { getPreferredCurrencyCode } from '~/lib/currency';

const DoofinderScriptLoader = ({value}: {value: any}) => {
  const [currency, setCurrency] = useState('CAD');
  useEffect(() => {
    const getCurrencyCode = async() => {
      let currencyCode: any = await getPreferredCurrencyCode();
      if(currencyCode != currency) {
        setCurrency(currencyCode);
      }
    }
    getCurrencyCode();
    if (typeof window !== "undefined") {
      let dfLayerOptions = {
        installationId: value,
        zone: 'eu1',
        currency: currency
      };

      // Dynamically inject the script
      (function (l, a, y, e, r, s) {
        r = l.createElement(a);
        r.async = 1;
        r.src = y;
        r.onload = function () {
          let checkDoofinder = setInterval(() => {
            if (window.doofinderLoader) {
              window.doofinderLoader.load(dfLayerOptions);
              clearInterval(checkDoofinder);
            }
          }, 100);
        };
        s = l.getElementsByTagName(a)[0];
        s.parentNode.insertBefore(r, s);
      })(document, 'script', 'https://eu1-config.doofinder.com/2.x/'+value+'.js');
    }
  }, [currency, setCurrency]);

  return <div></div>;
};

export default DoofinderScriptLoader;
