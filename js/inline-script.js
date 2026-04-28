/**
 * Inline script logic — keeps no-js → js class toggle
 * In production builds, this is inlined in the HTML <head>
 */
document.documentElement.classList.replace('no-js', 'js');
document.documentElement.classList.add('dark');
