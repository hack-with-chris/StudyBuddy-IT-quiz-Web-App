import { useEffect } from 'react';

const BotpressChat = () => {
  useEffect(() => {
    // 1. Create the main Botpress engine script
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.6/inject.js';
    script1.async = true;

    // 2. Tell the browser to load the second script ONLY AFTER the first one finishes
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://files.bpcontent.cloud/2026/06/09/16/20260609165157-RD53SWYT.js';
      script2.defer = true;
      script2.id = 'botpress-config-script'; // Adding an ID makes it easier to clean up later
      document.body.appendChild(script2);
    };

    // 3. Append the first script to the body to kick off the process
    document.body.appendChild(script1);

    // 4. Cleanup function when the component unmounts
    return () => {
      // Safely find and remove both scripts to prevent duplicates if you navigate away and back
      const injectedScript1 = document.querySelector(`script[src="${script1.src}"]`);
      const injectedScript2 = document.getElementById('botpress-config-script');
      
      if (injectedScript1) document.body.removeChild(injectedScript1);
      if (injectedScript2) document.body.removeChild(injectedScript2);
    };
  }, []);

  return null;
};

export default BotpressChat;