"use client";
import React, { useEffect } from "react";


const DoofinderScriptLoader = ({value}: {value: any}) => {
  console.log("value", value);
  useEffect(() => {
    if (typeof window !== "undefined") {
      let dfLayerOptions = {
        installationId: value,
        zone: 'eu1'
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
  }, [value]);

  return <div></div>;
};

export default DoofinderScriptLoader;