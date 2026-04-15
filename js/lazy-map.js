/**
 * Lazy load Google Maps iframe on intersection
 */
import { $ } from './utils.js';

const mapContainer = $('#contactMap');
const placeholder = $('#mapPlaceholder');

if (mapContainer && placeholder) {
  const loadMap = () => {
    if (mapContainer.classList.contains('contact__map--loaded')) return;

    const iframe = document.createElement('iframe');
    iframe.src = 'https://maps.google.com/maps?q=214+Grand+St%2C+Brooklyn%2C+NY+11211&t=&z=15&ie=UTF8&iwloc=&output=embed';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox');
    iframe.setAttribute('title', 'Woofbox location on Google Maps');
    iframe.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;border:0;filter:grayscale(100%) invert(92%) contrast(83%);';

    // Graceful fallback if embed fails to load
    const showFallback = () => {
      if (mapContainer.contains(iframe)) iframe.remove();
      if (mapContainer.querySelector('.contact__map-fallback')) return;

      const msg = document.createElement('p');
      msg.className = 'contact__map-fallback';
      msg.textContent = 'Map could not be loaded.';
      msg.style.cssText = 'color:var(--color-text-muted);font-family:var(--font-sans);font-size:var(--text-sm);text-align:center;padding:2rem;';
      const link = document.createElement('a');
      link.href = 'https://www.google.com/maps/search/?api=1&query=214+Grand+St+Brooklyn+NY+11211';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open Google Maps';
      link.style.cssText = 'display:inline-block;margin-top:0.5rem;color:var(--color-coral);border-bottom:1px solid var(--color-coral);';
      msg.appendChild(document.createElement('br'));
      msg.appendChild(link);
      mapContainer.appendChild(msg);
    };

    iframe.addEventListener('error', showFallback);

    // Timeout fallback — if iframe doesn't load within 10 seconds, show fallback
    const timeoutId = setTimeout(showFallback, 10000);
    iframe.addEventListener('load', () => clearTimeout(timeoutId), { once: true });

    mapContainer.appendChild(iframe);
    mapContainer.classList.add('contact__map--loaded');
  };

  // Load on intersection
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMap();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(mapContainer);
  } else {
    // Fallback: load map when it scrolls into view via scroll event
    const onScroll = () => {
      const rect = mapContainer.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        loadMap();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Also load on placeholder click (for eager users)
  placeholder.addEventListener('click', loadMap);
}
