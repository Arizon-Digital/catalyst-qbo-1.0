'use client';

import React, { useEffect } from 'react';

const FeefoReview = ({ sku }) => {
  useEffect(() => {
    const existingScript = document.getElementById('feefo-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'feefo-script';
    script.type = 'text/javascript';
    script.src = 'https://api.feefo.com/api/javascript/quality-bearings-online';
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('feefo-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div>
      <div
        id="feefo-product-review-widgetId"
        className="feefo-review-widget-product"
        data-product-sku={sku}
      ></div>
    </div>
  );
};

export default FeefoReview;