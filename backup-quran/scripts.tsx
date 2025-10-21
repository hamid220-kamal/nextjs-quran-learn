'use client'

import Script from 'next/script'

export default function QuranScripts() {
  return (
    <>
      <Script src="/simplified-meta-injection.js" strategy="afterInteractive" />
      <Script src="/brutal-direct-fix.js" strategy="afterInteractive" />
      <Script src="/final-fix.css" strategy="afterInteractive" />
      <Script id="read-btn-center" strategy="afterInteractive">
        {`
          document.addEventListener('DOMContentLoaded', function() {
            // Center all read buttons
            const buttonContainers = document.querySelectorAll('.read-btn-container');
            buttonContainers.forEach(container => {
              container.style.position = 'absolute';
              container.style.bottom = '20px';
              container.style.left = '0';
              container.style.right = '0';
              container.style.width = '100%';
              container.style.display = 'flex';
              container.style.justifyContent = 'center';
              container.style.alignItems = 'center';
              container.style.margin = '0 auto';
              container.style.zIndex = '10';
            });
            
            const readButtons = document.querySelectorAll('.read-btn');
            readButtons.forEach(button => {
              button.style.margin = '0 auto';
            });
          });
        `}
      </Script>
    </>
  )
}