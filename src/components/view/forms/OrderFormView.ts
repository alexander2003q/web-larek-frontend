import { ensureElement } from '../../../utils/utils';
import { FormErrors, PaymentMethod } from '../../../types';
import { Form } from '../base/Form';

interface OrderFormData {
	payment: PaymentMethod | null;
	address: string;
	errors: FormErrors;
}

export class OrderFormView extends Form<OrderFormData> {
	private readonly onlineButton: HTMLButtonElement;
	private readonly cashButton: HTMLButtonElement;
	private readonly addressInput: HTMLInputElement;

	constructor(
		onFieldChange: (field: string, value: string) => void,
		onSubmit: () => void
	) {
		super('order', onFieldChange, onSubmit, '.order__button');
		this.onlineButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.form);
		this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.form);
		this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);

		this.onlineButton.onclick = (evt) => {
			evt.preventDefault();
			this.emitFieldChange('payment', 'online');
		};
		this.cashButton.onclick = (evt) => {
			evt.preventDefault();
			this.emitFieldChange('payment', 'upon receipt');
		};
	}

	protected applyData(data: OrderFormData): void {
		if (this.addressInput.value !== data.address) {
			this.addressInput.value = data.address;
		}
		this.onlineButton.classList.toggle('button_alt-active', data.payment === 'online');
		this.cashButton.classList.toggle('button_alt-active', data.payment === 'upon receipt');

		const error = data.errors.payment ?? data.errors.address ?? '';
		this.setError(error);
		this.setSubmitDisabled(Boolean(error));
	}
}
