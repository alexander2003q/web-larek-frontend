import { IEvents } from '../base/events';
import { FormErrors, OrderData, PaymentMethod, Product } from '../../types';

export enum AppEvents {
	ItemsChanged = 'items:changed',
	BasketChanged = 'basket:changed',
	PreviewChanged = 'preview:changed',
	FormChanged = 'form:changed',
	OrderChanged = 'order:changed',
	ContactsChanged = 'contacts:changed',
}

interface OrderDraft {
	payment: PaymentMethod | null;
	address: string;
	email: string;
	phone: string;
}

const initialOrder: OrderDraft = {
	payment: null,
	address: '',
	email: '',
	phone: '',
};

export class AppState {
	private _catalog: Product[] = [];
	private _basket = new Set<string>();
	private _previewId: string | null = null;
	private _order: OrderDraft = { ...initialOrder };

	constructor(private readonly events: IEvents) {}

	setCatalog(items: Product[]) {
		this._catalog = items;
		this.events.emit(AppEvents.ItemsChanged);
	}

	get catalog(): Product[] {
		return this._catalog;
	}

	setPreview(productId: string | null) {
		this._previewId = productId;
		this.events.emit(AppEvents.PreviewChanged);
	}

	get preview(): Product | null {
		if (!this._previewId) {
			return null;
		}
		return this.getProduct(this._previewId) ?? null;
	}

	getProduct(productId: string): Product | undefined {
		return this._catalog.find((item) => item.id === productId);
	}

	inBasket(productId: string): boolean {
		return this._basket.has(productId);
	}

	toggleBasket(productId: string): void {
		if (this.inBasket(productId)) {
			this._basket.delete(productId);
		} else {
			this._basket.add(productId);
		}
		this.events.emit(AppEvents.BasketChanged);
	}

	removeFromBasket(productId: string): void {
		this._basket.delete(productId);
		this.events.emit(AppEvents.BasketChanged);
	}

	clearBasket(): void {
		this._basket.clear();
		this.events.emit(AppEvents.BasketChanged);
	}

	get basketItems(): Product[] {
		return Array.from(this._basket)
			.map((id) => this.getProduct(id))
			.filter((item): item is Product => Boolean(item));
	}

	get basketCount(): number {
		return this._basket.size;
	}

	get basketTotal(): number {
		return this.basketItems.reduce(
			(total, item) => total + (item.price ?? 0),
			0
		);
	}

	updateOrder(data: Partial<Pick<OrderDraft, 'payment' | 'address'>>) {
		this._order = { ...this._order, ...data };
		this.events.emit(AppEvents.FormChanged);
		this.events.emit(AppEvents.OrderChanged);
	}

	updateContacts(data: Partial<Pick<OrderDraft, 'email' | 'phone'>>) {
		this._order = { ...this._order, ...data };
		this.events.emit(AppEvents.FormChanged);
		this.events.emit(AppEvents.ContactsChanged);
	}

	get order() {
		return this._order;
	}

	validateOrder(): FormErrors {
		const errors: FormErrors = {};
		if (!this._order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this._order.address.trim()) {
			errors.address = 'Необходимо указать адрес';
		}
		return errors;
	}

	validateContacts(): FormErrors {
		const errors: FormErrors = {};
		if (!this._order.email.trim()) {
			errors.email = 'Необходимо указать email';
		}
		if (!this._order.phone.trim()) {
			errors.phone = 'Необходимо указать телефон';
		}
		return errors;
	}

	canCheckout(): boolean {
		const orderErrors = this.validateOrder();
		const contactErrors = this.validateContacts();
		return (
			!Object.keys(orderErrors).length && !Object.keys(contactErrors).length
		);
	}

	buildOrderPayload(): OrderData {
		if (!this._order.payment) {
			throw new Error('Payment is not selected');
		}
		return {
			payment: this._order.payment,
			address: this._order.address,
			email: this._order.email,
			phone: this._order.phone,
			items: this.basketItems.map((item) => item.id),
			total: this.basketTotal,
		};
	}

	resetAfterOrder(): void {
		this._basket.clear();
		this._order = { ...initialOrder };
		this.events.emit(AppEvents.BasketChanged);
		this.events.emit(AppEvents.FormChanged);
		this.events.emit(AppEvents.OrderChanged);
		this.events.emit(AppEvents.ContactsChanged);
	}
}
