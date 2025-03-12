'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

const HubspotChat = ({portalId}: {portalId: number}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeConversation, setActiveConversation] = useState(false);
  const eventRef = useRef(null);

useEffect(() => {
  const loadChatScriptByURL = () => {
    const url = `//js-eu1.hs-scripts.com/${portalId}.js`;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.async = true;
  
    document.body.appendChild(script);
  };
  
  loadChatScriptByURL();
  
  window.hsConversationsOnReady = [
    () => {},
  ];
}, []); 


  return (
    <div>
    </div>
  );
};

export default HubspotChat;
