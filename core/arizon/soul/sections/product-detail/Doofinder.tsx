"use client";

import React, { useEffect } from "react";

const DoofinderScriptLoader = ({value, currencyCode}: {value: any, currencyCode: any}) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isInIframe = window.self !== window.top;
      if (isInIframe) return
    }
    if (typeof window !== "undefined") {
      let dfLayerOptions = {
        installationId: value,
        zone: 'eu1',
        currency: currencyCode
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

      (function(w, k) {w[k] = window[k] || function () { (window[k].q = window[k].q || []).push(arguments) }})(window, "doofinderApp")
        doofinderApp("config", "language", "en")
        doofinderApp("config", "currency", currencyCode) 
      }
  }, [currencyCode]);

  return <div></div>;
};

export default DoofinderScriptLoader;
