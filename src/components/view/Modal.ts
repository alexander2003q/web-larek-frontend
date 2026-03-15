import { ensureElement } from '../../utils/utils';

export class Modal {
	private readonly closeButton: HTMLButtonElement;
	private readonly content: HTMLElement;
	private readonly activeClass = 'modal_active';

	constructor(private readonly root: HTMLElement, private readonly onClose?: () => void) {
		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.root);
		this.content = ensureElement<HTMLElement>('.modal__content', this.root);

		this.closeButton.addEventListener('click', () => this.close());
		this.root.addEventListener('click', (evt) => {
			if (evt.target === this.root) {
				this.close();
			}
		});
	}

	open(content: HTMLElement) {
		if (this.content.firstElementChild !== content) {
			this.content.replaceChildren(content);
		}
		this.root.classList.add(this.activeClass);
	}

	close() {
		this.root.classList.remove(this.activeClass);
		this.content.replaceChildren();
		this.onClose?.();
	}
}
