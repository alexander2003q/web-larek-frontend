import { ensureElement } from '../../utils/utils';
import { Component } from './base/Component';

export class SuccessView extends Component<number> {
	private readonly description: HTMLElement;

	constructor(private readonly onClose: () => void) {
		super('success');
		this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
		const closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
		closeButton.onclick = () => this.onClose();
	}

	setDescription(text: string): void {
		this.description.textContent = text;
	}

	protected applyData(total: number): void {
		this.setDescription(`Списано ${total.toLocaleString('ru-RU')} синапсов`);
	}
}
