import { ensureElement } from '../../utils/utils';
import { FormErrors, PaymentMethod, Product } from '../../types';
import { categoryClassName, cloneById, formatPrice } from './utils';

export class CatalogCardView {
	constructor(private readonly onClick: (id: string) => void) {}

	render(product: Product): HTMLElement {
		const card = cloneById<HTMLButtonElement>('card-catalog');
		const category = ensureElement<HTMLElement>('.card__category', card);
		const title = ensureElement<HTMLElement>('.card__title', card);
		const image = ensureElement<HTMLImageElement>('.card__image', card);
		const price = ensureElement<HTMLElement>('.card__price', card);

		category.textContent = product.category;
		category.className = `card__category ${categoryClassName(product.category)}`;
		title.textContent = product.title;
		image.src = product.image;
		image.alt = product.title;
		price.textContent = formatPrice(product.price);
		card.addEventListener('click', () => this.onClick(product.id));

		return card;
	}
}

export class PreviewCardView {
	constructor(private readonly onToggleBasket: (id: string) => void) {}

	render(product: Product, inBasket: boolean): HTMLElement {
		const card = cloneById<HTMLElement>('card-preview');
		const category = ensureElement<HTMLElement>('.card__category', card);
		const title = ensureElement<HTMLElement>('.card__title', card);
		const image = ensureElement<HTMLImageElement>('.card__image', card);
		const description = ensureElement<HTMLElement>('.card__text', card);
		const price = ensureElement<HTMLElement>('.card__price', card);
		const button = ensureElement<HTMLButtonElement>('.card__button', card);

		category.textContent = product.category;
		category.className = `card__category ${categoryClassName(product.category)}`;
		title.textContent = product.title;
		image.src = product.image;
		image.alt = product.title;
		description.textContent = product.description;
		price.textContent = formatPrice(product.price);
		button.textContent = inBasket ? 'Убрать' : 'Купить';
		button.disabled = product.price === null;
		button.addEventListener('click', () => this.onToggleBasket(product.id));

		return card;
	}
}

export class BasketView {
	constructor(
		private readonly onRemove: (id: string) => void,
		private readonly onSubmit: () => void
	) {}

	render(products: Product[], total: number): HTMLElement {
		const root = cloneById<HTMLElement>('basket');
		const list = ensureElement<HTMLElement>('.basket__list', root);
		const submit = ensureElement<HTMLButtonElement>('.basket__button', root);
		const totalPrice = ensureElement<HTMLElement>('.basket__price', root);

		const items = products.map((product, index) => {
			const row = cloneById<HTMLElement>('card-basket');
			ensureElement<HTMLElement>('.basket__item-index', row).textContent = String(index + 1);
			ensureElement<HTMLElement>('.card__title', row).textContent = product.title;
			ensureElement<HTMLElement>('.card__price', row).textContent = formatPrice(product.price);
			ensureElement<HTMLButtonElement>('.basket__item-delete', row).addEventListener(
				'click',
				() => this.onRemove(product.id)
			);
			return row;
		});

		list.replaceChildren(...items);
		totalPrice.textContent = `${total.toLocaleString('ru-RU')} синапсов`;
		submit.disabled = products.length === 0;
		submit.addEventListener('click', this.onSubmit);
		return root;
	}
}

export class OrderFormView {
	private form: HTMLFormElement | null = null;
	private onlineButton: HTMLButtonElement | null = null;
	private cashButton: HTMLButtonElement | null = null;
	private addressInput: HTMLInputElement | null = null;
	private submitButton: HTMLButtonElement | null = null;
	private errorsBlock: HTMLElement | null = null;
	private currentPayment: PaymentMethod | null = null;

	constructor(
		private readonly onChange: (payment: PaymentMethod | null, address: string) => void,
		private readonly onSubmit: () => void
	) {}

	render(data: { payment: PaymentMethod | null; address: string; errors: FormErrors }): HTMLElement {
		if (!this.form) {
			this.form = cloneById<HTMLFormElement>('order');
			this.onlineButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.form);
			this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.form);
			this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);
			this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.form);
			this.errorsBlock = ensureElement<HTMLElement>('.form__errors', this.form);

			this.onlineButton.addEventListener('click', (evt) => {
				evt.preventDefault();
				this.currentPayment = 'online';
				this.onChange(this.currentPayment, this.addressInput?.value ?? '');
			});

			this.cashButton.addEventListener('click', (evt) => {
				evt.preventDefault();
				this.currentPayment = 'upon receipt';
				this.onChange(this.currentPayment, this.addressInput?.value ?? '');
			});

			this.addressInput.addEventListener('input', () => {
				this.onChange(this.currentPayment, this.addressInput?.value ?? '');
			});

			this.form.addEventListener('submit', (evt) => {
				evt.preventDefault();
				this.onSubmit();
			});
		}

		this.currentPayment = data.payment;
		if (this.addressInput && this.addressInput.value !== data.address) {
			this.addressInput.value = data.address;
		}
		this.onlineButton?.classList.toggle('button_alt-active', data.payment === 'online');
		this.cashButton?.classList.toggle('button_alt-active', data.payment === 'upon receipt');

		const hasErrors = Boolean(data.errors.payment || data.errors.address);
		if (this.submitButton) {
			this.submitButton.disabled = hasErrors;
		}
		if (this.errorsBlock) {
			this.errorsBlock.textContent = data.errors.payment ?? data.errors.address ?? '';
		}

		return this.form;
	}
}

export class ContactsFormView {
	private form: HTMLFormElement | null = null;
	private emailInput: HTMLInputElement | null = null;
	private phoneInput: HTMLInputElement | null = null;
	private submitButton: HTMLButtonElement | null = null;
	private errorsBlock: HTMLElement | null = null;

	constructor(
		private readonly onChange: (email: string, phone: string) => void,
		private readonly onSubmit: () => void
	) {}

	render(data: { email: string; phone: string; errors: FormErrors }): HTMLElement {
		if (!this.form) {
			this.form = cloneById<HTMLFormElement>('contacts');
			this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
			this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);
			this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
			this.errorsBlock = ensureElement<HTMLElement>('.form__errors', this.form);

			const emitChange = () => this.onChange(this.emailInput?.value ?? '', this.phoneInput?.value ?? '');
			this.emailInput.addEventListener('input', emitChange);
			this.phoneInput.addEventListener('input', emitChange);

			this.form.addEventListener('submit', (evt) => {
				evt.preventDefault();
				this.onSubmit();
			});
		}

		if (this.emailInput && this.emailInput.value !== data.email) {
			this.emailInput.value = data.email;
		}
		if (this.phoneInput && this.phoneInput.value !== data.phone) {
			this.phoneInput.value = data.phone;
		}

		const hasErrors = Boolean(data.errors.email || data.errors.phone);
		if (this.submitButton) {
			this.submitButton.disabled = hasErrors;
		}
		if (this.errorsBlock) {
			this.errorsBlock.textContent = data.errors.email ?? data.errors.phone ?? '';
		}

		return this.form;
	}
}

export class SuccessView {
	constructor(private readonly onClose: () => void) {}

	render(total: number): HTMLElement {
		const success = cloneById<HTMLElement>('success');
		const description = ensureElement<HTMLElement>('.order-success__description', success);
		const close = ensureElement<HTMLButtonElement>('.order-success__close', success);

		description.textContent = `Списано ${total.toLocaleString('ru-RU')} синапсов`;
		close.addEventListener('click', this.onClose);
		return success;
	}
}
