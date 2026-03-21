import { ensureElement } from '../../../utils/utils';
import { formatPrice } from '../utils';
import { Component } from '../base/Component';

interface BasketData {
	items: HTMLElement[];
	total: number;
}

export class BasketView extends Component<BasketData> {
	private readonly list: HTMLElement;
	private readonly totalPrice: HTMLElement;
	private readonly submitButton: HTMLButtonElement;

	constructor(private readonly onSubmit: () => void) {
		super('basket');
		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
		this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
		this.submitButton.onclick = () => this.onSubmit();
	}

	protected applyData(data: BasketData): void {
		this.list.replaceChildren(...data.items);
		this.totalPrice.textContent = formatPrice(data.total);
		this.submitButton.disabled = data.items.length === 0;
	}
}
