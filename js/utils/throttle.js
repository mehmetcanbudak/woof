export const throttleRAF = (fn) => {
  let ticking = false;
  return (...args) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

export const throttle = (fn, ms) => {
  let lastTime = 0;
  let timeoutId = null;
  let lastArgs = null;

  return (...args) => {
    lastArgs = args;
    const now = Date.now();
    const remaining = ms - (now - lastTime);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        fn(...lastArgs);
      }, remaining);
    }
  };
};