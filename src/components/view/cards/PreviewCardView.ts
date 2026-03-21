import { ensureElement } from '../../../utils/utils';
import { Product } from '../../../types';
import { categoryClassName } from '../utils';
import { BaseProductCardView } from './BaseProductCardView';

interface PreviewData {
	product: Product;
	inBasket: boolean;
}

export class PreviewCardView extends BaseProductCardView<PreviewData> {
	private readonly categoryElement: HTMLElement;
	private readonly imageElement: HTMLImageElement;
	private readonly descriptionElement: HTMLElement;
	private readonly basketButton: HTMLButtonElement;
	private currentProductId = '';
	private isDisabled = false;

	constructor(private readonly onToggleBasket: (id: string) => void) {
		super('card-preview');
		this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
		this.basketButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

		this.basketButton.onclick = () => {
			if (!this.isDisabled) {
				this.onToggleBasket(this.currentProductId);
			}
		};
	}

	setBasketState(inBasket: boolean): void {
		this.basketButton.textContent = inBasket ? 'Убрать' : 'Купить';
	}

	protected applyData(data: PreviewData): void {
		const { product, inBasket } = data;
		this.currentProductId = product.id;
		this.setCommonProductFields(product);
		this.categoryElement.textContent = product.category;
		this.categoryElement.className = `card__category ${categoryClassName(product.category)}`;
		this.imageElement.src = product.image;
		this.imageElement.alt = product.title;
		this.descriptionElement.textContent = product.description;
		this.isDisabled = product.price === null;
		this.basketButton.disabled = this.isDisabled;
		this.setBasketState(inBasket);
	}
}
