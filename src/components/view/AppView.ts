import { ensureElement } from '../../utils/utils';

export class AppView {
	private readonly gallery = ensureElement<HTMLElement>('.gallery');
	private readonly basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
	private readonly basketButton = ensureElement<HTMLButtonElement>('.header__basket');
	private readonly pageWrapper = ensureElement<HTMLElement>('.page__wrapper');

	constructor(onBasketClick: () => void) {
		this.basketButton.addEventListener('click', onBasketClick);
	}

	renderCatalog(cards: HTMLElement[]) {
		this.gallery.replaceChildren(...cards);
	}

	setBasketCount(count: number) {
		this.basketCounter.textContent = String(count);
	}

	lockPage(isLocked: boolean) {
		this.pageWrapper.classList.toggle('page__wrapper_locked', isLocked);
	}
}
