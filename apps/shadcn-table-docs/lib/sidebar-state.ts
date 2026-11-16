/**
 * Desktop sidebar state kept in localStorage: the width the visitor dragged
 * (components/sidebar-resize-handle.tsx) and whether it is collapsed
 * (components/sidebar-collapse-button.tsx). Plain module so the server layout
 * can inline SIDEBAR_STATE_SCRIPT, which applies both before the first paint.
 */
export const SIDEBAR_WIDTH_KEY = 'docs-sidebar-width';
export const SIDEBAR_COLLAPSED_KEY = 'docs-sidebar-collapsed';
/** fumadocs' notebook sidebar width (md:layout:[--fd-sidebar-width:268px]). */
export const SIDEBAR_DEFAULT_WIDTH = 268;
export const SIDEBAR_MIN_WIDTH = 220;
export const SIDEBAR_MAX_WIDTH = 480;

export const SIDEBAR_STATE_SCRIPT = `try{var r=document.documentElement,w=Number(localStorage.getItem(${JSON.stringify(SIDEBAR_WIDTH_KEY)}));if(w>=${SIDEBAR_MIN_WIDTH}&&w<=${SIDEBAR_MAX_WIDTH})r.style.setProperty('--docs-sidebar-width',w+'px');if(localStorage.getItem(${JSON.stringify(SIDEBAR_COLLAPSED_KEY)})==='1')r.setAttribute('data-sidebar-collapsed','')}catch(e){}`;
