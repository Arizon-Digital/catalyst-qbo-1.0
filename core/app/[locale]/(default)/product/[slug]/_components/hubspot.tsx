import React, {useEffect} from "react";
 
const HubspotContactForm = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src='//js-eu1.hsforms.net/forms/embed/v2.js';
        document.body.appendChild(script);
        
        script.addEventListener('load', () => {
            // @TS-ignore
            if (window?.hbspt) {
                // @TS-ignore
                window?.hbspt.forms.create({
                    portalId: '139717848',
                    formId: 'cd97e866-8d59-4ca7-8252-23dacae92004',
                    target: '#hubspotForm',
                    region: "eu1",
                })
            }
        });
    }, []);
 
    return (
        <div id="hubspotForm"></div>
    );
 
}
 
export default HubspotContactForm;