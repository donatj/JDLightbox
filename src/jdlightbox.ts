interface JDLightboxOptions {
	selector: string;
	lbAttr: string;
	fadeDuration: number;
	rootListener: HTMLElement;
	rootLevelElement: HTMLElement;
	bgClassName: string;
}

class JDLightbox {

	protected bg = document.createElement('div');
	protected fig = document.createElement('figure');

	protected options: JDLightboxOptions = {
		selector: 'a[data-jdlightbox=jdlightbox]',
		lbAttr: "href",
		fadeDuration: 400,
		rootListener: <HTMLElement>document.querySelector('html'),
		rootLevelElement: <HTMLElement>document.querySelector('html'),
		bgClassName: 'jdlightbox_modal_bg',
	};

	constructor(options: JDLightboxOptions) {
		this.options = { ...this.options, ...options };

		this.bg.classList.add(this.options.bgClassName);
		this.hide();

		this.bg.style.transition = this.options.fadeDuration + 'ms';

		this.bg.appendChild(this.fig);
		this.options.rootLevelElement.appendChild(this.bg);

		let that = this;

		that.bg.addEventListener('click', () => {
			this.hide();
		});

		this.options.rootListener.addEventListener('click', function (e) {
			if (e.metaKey) {
				return;
			}

			for (let target = <HTMLElement | null>e.target; target && target != this; target = target.parentElement) {
				if (target.matches(that.options.selector)) {
					e.preventDefault();
					that.show(target);
					break;
				}
			}
		});
	}

	private hide() {
		this.bg.style.display = 'none';
	}

	private show(target: HTMLElement) {
		this.fig.innerHTML = '';

		this.bg.style.display = '';
		this.bg.style.opacity = '0';

		if (target.hasAttribute('data-jdlightbox-iframe')) {
			const iframe = document.createElement('iframe');
			iframe.src = target.getAttribute(this.options.lbAttr) || '';
			iframe.width = '800';
			iframe.height = '600';
		} else {
			const img = document.createElement('img');
			img.src = target.getAttribute(this.options.lbAttr) || '';
			this.fig.appendChild(img);

			const caption = document.createElement('figcaption');
			caption.innerText = target.title;
			this.fig.appendChild(caption);
		}

		setTimeout(() => { this.bg.style.opacity = '1'; }, 1);

	}

}