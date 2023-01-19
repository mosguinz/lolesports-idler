var s = document.createElement('script');
s.src = chrome.runtime.getURL('scraper.js');
s.onload = () => { s.remove(); };

(document.head || document.documentElement).appendChild(s);
