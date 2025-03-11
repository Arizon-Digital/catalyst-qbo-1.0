import React, { useEffect } from 'react';

const returnform = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    script.src = '//js-eu1.hsforms.net/forms/embed/v2.js';
    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: '139717848',
          formId: 'f62645fd-94ba-4d1b-a0e2-991d5e1bc132',
          target: '#hubspotForm'
        });
      }
    });
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return <div id="hubspotForm"></div>;
};

export default returnform;