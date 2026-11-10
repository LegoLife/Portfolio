// @ts-check
// Browser-side helpers for the desktop. C# owns window state; this file only moves
// elements while the pointer is down, then reports the result so C# can apply its rules.
(() => {
    const MIN_W = 320, MIN_H = 220;
    /** @type {any} */
    let dotnet = null;

    const prefs = {
        /** @param {string} key @param {string} fallback */
        get(key, fallback) {
            try { return localStorage.getItem('jakeos.' + key) ?? fallback; } catch { return fallback; }
        },
        /** @param {string} key @param {string} value */
        set(key, value) {
            try { localStorage.setItem('jakeos.' + key, value); } catch { /* private mode: the choice just won't be remembered */ }
        },
    };

    const isCompact = () => window.matchMedia('(max-width: 720px)').matches;

    /**
     * Follows the pointer until it is released.
     * @param {PointerEvent} down
     * @param {(dx: number, dy: number) => void} onMove
     * @param {(moved: boolean) => void} onEnd
     */
    function track(down, onMove, onEnd) {
        let moved = false;
        document.body.classList.add('is-dragging');
        /** @param {PointerEvent} e */
        const move = e => {
            const dx = e.clientX - down.clientX, dy = e.clientY - down.clientY;
            if (!moved && Math.abs(dx) + Math.abs(dy) < 3) return;
            moved = true;
            onMove(dx, dy);
        };
        const end = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', end);
            window.removeEventListener('pointercancel', end);
            document.body.classList.remove('is-dragging');
            onEnd(moved);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', end);
        window.addEventListener('pointercancel', end);
    }

    /** @param {PointerEvent} e */
    function onPointerDown(e) {
        if (e.button !== 0 || !(e.target instanceof Element)) return;

        const sticker = /** @type {HTMLElement | null} */ (e.target.closest('.sticker'));
        if (sticker) {
            e.preventDefault();
            const x = sticker.offsetLeft, y = sticker.offsetTop;
            sticker.classList.add('is-held');
            track(e, (dx, dy) => {
                sticker.style.left = (x + dx) + 'px';
                sticker.style.top = (y + dy) + 'px';
                sticker.style.right = 'auto';
                sticker.style.bottom = 'auto';
            }, () => sticker.classList.remove('is-held'));
            return;
        }

        if (isCompact()) return;   // on phones every window is full screen
        const grip = e.target.closest('.win-grip');
        const bar = e.target.closest('.win-bar');
        if ((!grip && !bar) || e.target.closest('button, a, input')) return;
        const win = /** @type {HTMLElement | null} */ (e.target.closest('.win'));
        if (!win || win.classList.contains('is-max')) return;

        e.preventDefault();
        const start = { x: win.offsetLeft, y: win.offsetTop, w: win.offsetWidth, h: win.offsetHeight };
        const now = { ...start };
        track(e, (dx, dy) => {
            if (grip) {
                now.w = Math.max(MIN_W, start.w + dx);
                now.h = Math.max(MIN_H, start.h + dy);
                win.style.width = now.w + 'px';
                win.style.height = now.h + 'px';
            } else {
                now.x = start.x + dx;
                now.y = Math.max(0, start.y + dy);
                win.style.left = now.x + 'px';
                win.style.top = now.y + 'px';
            }
        }, async moved => {
            if (!moved || !dotnet) return;
            // C# may clamp the result; draw what it decided.
            const [x, y, w, h] = await dotnet.invokeMethodAsync('OnWindowMoved', win.dataset.win, now.x, now.y, now.w, now.h);
            win.style.left = x + 'px';
            win.style.top = y + 'px';
            win.style.width = w + 'px';
            win.style.height = h + 'px';
        });
    }

    window['desktop'] = {
        /** @param {any} ref */
        init(ref) {
            dotnet = ref;
            document.addEventListener('pointerdown', onPointerDown);
            let pending = 0;
            window.addEventListener('resize', () => {
                cancelAnimationFrame(pending);
                pending = requestAnimationFrame(() => dotnet.invokeMethodAsync('OnViewport', window.innerWidth, window.innerHeight));
            });
            // [width, height, theme, stickers, app named in the address after #]
            return [
                String(window.innerWidth),
                String(window.innerHeight),
                document.documentElement.dataset.theme || 'day',
                prefs.get('stickers', 'on'),
                decodeURIComponent(location.hash.replace(/^#\/?/, '')),
            ];
        },

        /** @param {string} theme */
        setTheme(theme) {
            document.documentElement.dataset.theme = theme;
            prefs.set('theme', theme);
        },

        store: prefs.set,

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

        /** @param {string} selector */
        scrollToEnd(selector) {
            const el = document.querySelector(selector);
            if (el) el.scrollTop = el.scrollHeight;
        },

        /** Keeps Tab and the arrow keys inside the terminal input so C# can use them. @param {string} selector */
        terminalKeys(selector) {
            const input = document.querySelector(selector);
            input?.addEventListener('keydown', e => {
                const key = /** @type {KeyboardEvent} */ (e).key;
                if (key === 'Tab' || key === 'ArrowUp' || key === 'ArrowDown') e.preventDefault();
            });
        },
    };
})();
