import { ensureElement } from '../../../utils/utils';
import { Product } from '../../../types';
import { BaseProductCardView } from './BaseProductCardView';

interface BasketItemData {
	product: Product;
	index: number;
}

export class BasketItemView extends BaseProductCardView<BasketItemData> {
	private readonly indexElement: HTMLElement;
	private currentProductId = '';

	constructor(private readonly onRemove: (id: string) => void) {
		super('card-basket');
		this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
		const deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
		deleteButton.onclick = () => this.onRemove(this.currentProductId);
	}

	protected applyData(data: BasketItemData): void {
		this.currentProductId = data.product.id;
		this.setCommonProductFields(data.product);
		this.indexElement.textContent = String(data.index + 1);
	}
}
