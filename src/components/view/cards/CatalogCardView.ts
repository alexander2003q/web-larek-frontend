import { ensureElement } from '../../../utils/utils';
import { Product } from '../../../types';
import { categoryClassName } from '../utils';
import { BaseProductCardView } from './BaseProductCardView';

export class CatalogCardView extends BaseProductCardView<Product> {
	private readonly categoryElement: HTMLElement;
	private readonly imageElement: HTMLImageElement;
	private currentProductId = '';

	constructor(private readonly onClick: (id: string) => void) {
		super('card-catalog');
		this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.container.onclick = () => {
			this.onClick(this.currentProductId);
		};
	}

	protected applyData(product: Product): void {
		this.currentProductId = product.id;
		this.setCommonProductFields(product);
		this.categoryElement.textContent = product.category;
		this.categoryElement.className = `card__category ${categoryClassName(product.category)}`;
		this.imageElement.src = product.image;
		this.imageElement.alt = product.title;
	}
}
