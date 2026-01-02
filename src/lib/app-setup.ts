
/**
 * Ensures all favicon-related elements use the custom favicon.
 * Handles .ico and .svg fallbacks.
 */
export const setupFavicons = () => {
    const links = document.querySelectorAll("link[rel*='icon']") as NodeListOf<HTMLLinkElement>;
    links.forEach(link => {
        // Use ICO for traditional favicon and SVG for others
        if (link.rel === 'icon' && !link.type) {
            link.href = '/custom-favicon.ico';
        } else if (link.sizes) {
            // For sized icons, use the ICO
            link.href = '/custom-favicon.ico';
        } else {
            // For SVG specific
            link.href = '/custom-favicon.svg';
        }
    });

    const appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
    if (appleIcon) appleIcon.href = '/custom-favicon.ico';

    const shortcutIcon = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
    if (shortcutIcon) shortcutIcon.href = '/custom-favicon.ico';

    const msIcon = document.querySelector("meta[name='msapplication-TileImage']") as HTMLMetaElement;
    if (msIcon) msIcon.content = '/custom-favicon.svg';
};

/**
 * Injects PDF-specific styles into the document head.
 */
export const setupPdfOptimizations = () => {
    const style = document.createElement('style');
    style.textContent = `
    @media print {
      /* Ensure icons align properly in print/PDF */
      .pdf-contact-icon, [data-pdf-contact-icon="true"] {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        vertical-align: middle !important;
        transform: translateY(0) !important;
      }
      
      /* Fix for section icons and bullets */
      .pdf-section-icon, .pdf-bullet-char {
        display: inline-flex !important;
        align-items: center !important;
        vertical-align: middle !important;
        margin-top: 0 !important;
      }
    }
  `;
    document.head.appendChild(style);
};

export const logPerformance = () => {
    if (window.performance) {
        const pageLoadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        // Only log in development
        if (import.meta.env.DEV) {
            console.debug(`Page loaded in: ${pageLoadTime}ms`);
        }
    }
};
