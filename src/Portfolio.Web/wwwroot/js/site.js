// @ts-check
// Browser-side helpers. C# decides which page to show; this file reports the address and does
// the few things only the browser can do (scroll, clipboard, downloads, printing).
(() => {
    window['site'] = {
        /** Starts reporting address changes. Returns the part of the address after #. @param {any} dotnet */
        init(dotnet) {
            window.addEventListener('hashchange', () => dotnet.invokeMethodAsync('OnAddress', location.hash));
            return location.hash;
        },

        /** Scrolls to a section, or to the top of the page when none is named. @param {string | null} anchor */
        show(anchor) {
            const target = anchor ? document.getElementById(anchor) : null;
            if (target) target.scrollIntoView();
            else window.scrollTo(0, 0);
        },

        /** @param {string} text */
        async copy(text) {
            try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked: nothing else to do */ }
        },

        /** @param {string} name @param {string} text */
        download(name, text) {
            const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
            const link = Object.assign(document.createElement('a'), { href: url, download: name });
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        },

        /** Prints one element on its own page, using the print stylesheet. @param {string} selector @param {string} title */
        print(selector, title) {
            const source = document.querySelector(selector);
            if (!source) return;
            const frame = document.createElement('iframe');
            frame.setAttribute('aria-hidden', 'true');
            frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
            document.body.appendChild(frame);
            const doc = /** @type {Document} */ (frame.contentDocument);
            const css = new URL('css/print.css', document.baseURI).href;
            doc.open();
            doc.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title></title><link rel="stylesheet" href="${css}"></head><body></body></html>`);
            doc.close();
            doc.title = title;
            doc.body.innerHTML = source.innerHTML;
            let printed = false;
            const go = () => {
                if (printed) return;
                printed = true;
                frame.contentWindow?.focus();
                frame.contentWindow?.print();
                setTimeout(() => frame.remove(), 2000);
            };
            const link = doc.querySelector('link');
            if (link) link.addEventListener('load', go);
            setTimeout(go, 1500);   // print anyway if the stylesheet is slow
        },
    };
})();
