"use strict";
function adjacentIndex(index, count, direction) {
    const next = index + direction;
    return index >= 0 && next >= 0 && next < count ? next : null;
}
class JDLightbox {
    constructor(options = {}) {
        this.current = null;
        this.onClick = (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
                return;
            if (!(event.target instanceof Element))
                return;
            const link = event.target.closest(this.selector);
            if (!(link instanceof HTMLAnchorElement) || !link.getAttribute('href') || link.hasAttribute('download') || (link.target && link.target.toLowerCase() !== '_self'))
                return;
            event.preventDefault();
            this.show(link);
        };
        this.onKeyDown = (event) => {
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
                return;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                this.navigate(event.key === 'ArrowLeft' ? -1 : 1);
            }
        };
        this.onDialogClick = (event) => {
            if (event.target === this.dialog)
                this.dialog.close();
        };
        this.onClose = () => {
            // A close event can arrive after the dialog has already been reopened.
            if (this.dialog.open)
                return;
            this.current = null;
            this.content.replaceChildren();
            this.caption.textContent = '';
            this.original.removeAttribute('href');
        };
        this.selector = options.selector ?? 'a[data-jdlightbox]';
        this.dialog = document.createElement('dialog');
        this.dialog.className = 'jdlightbox';
        this.dialog.setAttribute('aria-label', 'Content viewer');
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'jdlightbox__close';
        close.setAttribute('aria-label', 'Close');
        close.textContent = '×';
        close.addEventListener('click', () => this.dialog.close());
        this.previous = this.createNavigationButton('Previous', '‹', -1);
        this.next = this.createNavigationButton('Next', '›', 1);
        this.content = document.createElement('div');
        this.content.className = 'jdlightbox__content';
        this.caption = document.createElement('p');
        this.caption.className = 'jdlightbox__caption';
        this.original = document.createElement('a');
        this.original.className = 'jdlightbox__original';
        this.original.target = '_blank';
        this.original.rel = 'noopener noreferrer';
        this.original.textContent = 'Open original';
        const viewer = document.createElement('div');
        viewer.className = 'jdlightbox__viewer';
        viewer.append(this.previous, this.content, this.next);
        this.dialog.append(close, viewer, this.caption, this.original);
        document.body.append(this.dialog);
        this.dialog.addEventListener('click', this.onDialogClick);
        this.dialog.addEventListener('close', this.onClose);
        this.dialog.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('click', this.onClick);
    }
    /** Remove the lightbox and its event listener. */
    destroy() {
        document.removeEventListener('click', this.onClick);
        if (this.dialog.open)
            this.dialog.close();
        this.dialog.remove();
    }
    createNavigationButton(label, text, direction) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'jdlightbox__navigation';
        button.setAttribute('aria-label', label);
        button.textContent = text;
        button.addEventListener('click', () => this.navigate(direction));
        return button;
    }
    links() {
        return Array.from(document.querySelectorAll(this.selector)).filter((link) => link instanceof HTMLAnchorElement && !!link.getAttribute('href') && !link.hasAttribute('download') && (!link.target || link.target.toLowerCase() === '_self'));
    }
    navigate(direction) {
        const links = this.links();
        const index = this.current ? links.indexOf(this.current) : -1;
        const next = adjacentIndex(index, links.length, direction);
        if (next !== null)
            this.show(links[next]);
    }
    show(link) {
        this.current = link;
        const links = this.links();
        const index = links.indexOf(link);
        this.previous.hidden = this.next.hidden = links.length < 2;
        this.previous.disabled = adjacentIndex(index, links.length, -1) === null;
        this.next.disabled = adjacentIndex(index, links.length, 1) === null;
        const title = link.title || link.querySelector('img')?.alt || '';
        this.content.replaceChildren();
        if (link.hasAttribute('data-jdlightbox-iframe')) {
            const frame = document.createElement('iframe');
            frame.src = link.href;
            frame.title = title || 'Embedded content';
            this.content.append(frame);
        }
        else {
            const image = document.createElement('img');
            image.src = link.href;
            image.alt = title;
            this.content.append(image);
        }
        this.caption.textContent = title;
        this.caption.hidden = !title;
        this.original.href = link.href;
        if (!this.dialog.open)
            this.dialog.showModal();
    }
}
