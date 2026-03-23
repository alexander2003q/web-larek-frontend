import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekApi } from './components/model/WebLarekApi';
import { AppEvents, AppState } from './components/model/AppState';
import { PaymentMethod } from './types';
import {
	BasketView,
	BasketItemView,
	CatalogCardView,
	ContactsFormView,
	OrderFormView,
	PreviewCardView,
	SuccessView,
} from './components/view/Templates';
import { AppView } from './components/view/AppView';
import { Modal } from './components/view/Modal';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
const appState = new AppState(events);

document
	.querySelectorAll('.modal:not(#modal-container)')
	.forEach((modal) => modal.remove());

const appView = new AppView(() => openBasket());
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), () =>
	appView.lockPage(false)
);
const previewCardView = new PreviewCardView(() =>
	events.emit(AppEvents.PreviewBasketToggleRequested)
);
const basketView = new BasketView(() => openOrder());
const orderView = new OrderFormView(
	(field, value) => {
		if (field === 'payment') {
			appState.updateOrder({ payment: value as PaymentMethod });
		}
		if (field === 'address') {
			appState.updateOrder({ address: value });
		}
	},
	() => openContacts()
);
const contactsView = new ContactsFormView(
	(field, value) => {
		if (field === 'email') {
			appState.updateContacts({ email: value });
		}
		if (field === 'phone') {
			appState.updateContacts({ phone: value });
		}
	},
	() => submitOrder()
);
const successView = new SuccessView(() => modal.close());

events.on(AppEvents.ItemsChanged, () => {
	const cards = appState.catalog.map((product) =>
		new CatalogCardView(() => openPreview(product.id)).render(product)
	);
	appView.renderCatalog(cards);
});

events.on(AppEvents.BasketChanged, () => {
	appView.setBasketCount(appState.basketCount);
	if (!isModalOpen()) {
		return;
	}
	const modalContent = getModalContent();
	if (modalContent === basketView.element) {
		renderBasket();
	}
	if (modalContent === previewCardView.element) {
		const preview = appState.preview;
		if (!preview) {
			return;
		}
		previewCardView.setBasketState(appState.inBasket(preview.id));
	}
});

events.on(AppEvents.PreviewBasketToggleRequested, () => {
	const preview = appState.preview;
	if (!preview) {
		return;
	}
	appState.toggleBasket(preview.id);
});

events.on(AppEvents.PreviewChanged, () => {
	const product = appState.preview;
	if (!product) {
		return;
	}
	appView.lockPage(true);
	modal.open(
		previewCardView.render({
			product,
			inBasket: appState.inBasket(product.id),
		})
	);
});

events.on(AppEvents.FormChanged, () => {
	orderView.render({
		payment: appState.order.payment,
		address: appState.order.address,
		errors: appState.validateOrder(),
	});
	contactsView.render({
		email: appState.order.email,
		phone: appState.order.phone,
		errors: appState.validateContacts(),
	});
});

async function bootstrap() {
	try {
		const { items } = await api.getProducts();
		appState.setCatalog(items);
		appView.setBasketCount(0);
	} catch (error) {
		appView.renderCatalog([]);
		appView.lockPage(true);
		const fallback = successView.render(0);
		const description = fallback.querySelector('.order-success__description');
		if (description) {
			description.textContent = 'Не удалось загрузить каталог. Повторите попытку позже.';
		}
		modal.open(fallback);
	}
}

function openPreview(productId: string) {
	appState.setPreview(productId);
}

function openBasket() {
	appView.lockPage(true);
	renderBasket();
}

function openOrder() {
	appView.lockPage(true);
	modal.open(
		orderView.render({
			payment: appState.order.payment,
			address: appState.order.address,
			errors: appState.validateOrder(),
		})
	);
}

function openContacts() {
	const orderErrors = appState.validateOrder();
	if (Object.keys(orderErrors).length) {
		orderView.render({
			payment: appState.order.payment,
			address: appState.order.address,
			errors: orderErrors,
		});
		return;
	}
	appView.lockPage(true);
	modal.open(
		contactsView.render({
			email: appState.order.email,
			phone: appState.order.phone,
			errors: appState.validateContacts(),
		})
	);
}

async function submitOrder() {
	const contactErrors = appState.validateContacts();
	if (Object.keys(contactErrors).length || !appState.canCheckout()) {
		contactsView.render({
			email: appState.order.email,
			phone: appState.order.phone,
			errors: contactErrors,
		});
		return;
	}

	const paidTotal = appState.basketTotal;
	try {
		await api.createOrder(appState.buildOrderPayload());
		appState.resetAfterOrder();
		appState.setPreview(null);
		appView.lockPage(true);
		modal.open(successView.render(paidTotal));
	} catch (error) {
		const fallback = successView.render(0);
		successView.setDescription('Не удалось оформить заказ. Повторите попытку.');
		appView.lockPage(true);
		modal.open(fallback);
	}
}

function renderBasket() {
	const itemElements = appState.basketItems.map((product, index) =>
		new BasketItemView(() => appState.removeFromBasket(product.id)).render({
			product,
			index,
		})
	);

	modal.open(
		basketView.render({
			items: itemElements,
			total: appState.basketTotal,
		})
	);
}

function isModalOpen(): boolean {
	return Boolean(document.querySelector('#modal-container.modal_active'));
}

function getModalContent(): Element | null {
	const content = document.querySelector('#modal-container .modal__content');
	return content?.firstElementChild ?? null;
}

bootstrap();
