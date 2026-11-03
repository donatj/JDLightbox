interface JDLightboxOptions {
	/** Selector for links that should open in the lightbox. */
	selector?: string;
}

interface LightboxItem {
	href: string;
	title: string;
	thumbnailAlt: string;
	isFrame: boolean;
}

interface LightboxView {
	href: string;
	title: string;
	isFrame: boolean;
	showNavigation: boolean;
	canGoPrevious: boolean;
	canGoNext: boolean;
}

function adjacentIndex(index: number, count: number, direction: -1 | 1): number | null {
	const next = index + direction;
	return index >= 0 && index < count && next >= 0 && next < count ? next : null;
}

function lightboxView(item: LightboxItem, index: number, count: number): LightboxView {
	return {
		href: item.href,
		title: item.title || item.thumbnailAlt,
		isFrame: item.isFrame,
		showNavigation: count > 1,
		canGoPrevious: adjacentIndex(index, count, -1) !== null,
		canGoNext: adjacentIndex(index, count, 1) !== null,
	};
}

function isEligibleLink(link: Element | null): link is HTMLAnchorElement {
	return link instanceof HTMLAnchorElement && !!link.getAttribute('href') && !link.hasAttribute('download') && (!link.target || link.target.toLowerCase() === '_self');
}

class JDLightbox {
	private readonly selector: string;
	private readonly dialog: HTMLDialogElement;
	private readonly content: HTMLElement;
	private readonly caption: HTMLElement;
	private readonly original: HTMLAnchorElement;
	private readonly previous: HTMLButtonElement;
	private readonly next: HTMLButtonElement;
	private current: HTMLAnchorElement | null = null;

	constructor(options: JDLightboxOptions = {}) {
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
	destroy(): void {
		document.removeEventListener('click', this.onClick);
		if (this.dialog.open) this.dialog.close();
		this.dialog.remove();
	}

	private readonly onClick = (event: MouseEvent): void => {
		if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		if (!(event.target instanceof Element)) return;
		const link = event.target.closest(this.selector);
		if (!isEligibleLink(link)) return;

		event.preventDefault();
		this.show(link);
	};

	private createNavigationButton(label: string, text: string, direction: -1 | 1): HTMLButtonElement {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'jdlightbox__navigation';
		button.setAttribute('aria-label', label);
		button.textContent = text;
		button.addEventListener('click', () => this.navigate(direction));
		return button;
	}

	private links(): HTMLAnchorElement[] {
		return Array.from(document.querySelectorAll(this.selector)).filter(isEligibleLink);
	}

	private navigate(direction: -1 | 1): void {
		const links = this.links();
		const index = this.current ? links.indexOf(this.current) : -1;
		const next = adjacentIndex(index, links.length, direction);
		if (next !== null) this.show(links[next]);
	}

	private readonly onKeyDown = (event: KeyboardEvent): void => {
		if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			event.preventDefault();
			this.navigate(event.key === 'ArrowLeft' ? -1 : 1);
		}
	};

	private readonly onDialogClick = (event: MouseEvent): void => {
		if (event.target === this.dialog) this.dialog.close();
	};

	private readonly onClose = (): void => {
		// A close event can arrive after the dialog has already been reopened.
		if (this.dialog.open) return;
		this.current = null;
		this.content.replaceChildren();
		this.caption.textContent = '';
		this.original.removeAttribute('href');
	};

	private show(link: HTMLAnchorElement): void {
		this.current = link;
		const links = this.links();
		const item: LightboxItem = {
			href: link.href,
			title: link.title,
			thumbnailAlt: link.querySelector('img')?.alt || '',
			isFrame: link.hasAttribute('data-jdlightbox-iframe'),
		};
		this.render(lightboxView(item, links.indexOf(link), links.length));
		if (!this.dialog.open) this.dialog.showModal();
	}

	private render(view: LightboxView): void {
		this.previous.hidden = this.next.hidden = !view.showNavigation;
		this.previous.disabled = !view.canGoPrevious;
		this.next.disabled = !view.canGoNext;
		this.content.replaceChildren();
		if (view.isFrame) {
			const frame = document.createElement('iframe');
			frame.src = view.href;
			frame.title = view.title || 'Embedded content';
			this.content.append(frame);
		} else {
			const image = document.createElement('img');
			image.src = view.href;
			image.alt = view.title;
			this.content.append(image);
		}
		this.caption.textContent = view.title;
		this.caption.hidden = !view.title;
		this.original.href = view.href;
	}
}
