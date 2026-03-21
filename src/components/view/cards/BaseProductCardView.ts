import { ensureElement } from '../../../utils/utils';
import { Product } from '../../../types';
import { formatPrice } from '../utils';
import { Component } from '../base/Component';

export abstract class BaseProductCardView<TData> extends Component<TData> {
	private readonly titleElement: HTMLElement;
	private readonly priceElement: HTMLElement;

	constructor(templateId: string) {
		super(templateId);
		this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
	}

	protected setCommonProductFields(product: Product): void {
		this.titleElement.textContent = product.title;
		this.priceElement.textContent = formatPrice(product.price);
	}
}
