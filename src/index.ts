import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekApi } from './components/model/WebLarekApi';
import { AppEvents, AppState } from './components/model/AppState';
import {
	BasketView,
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
const catalogCardView = new CatalogCardView((id) => openPreview(id));
const previewCardView = new PreviewCardView((id) => appState.toggleBasket(id));
const basketView = new BasketView(
	(id) => appState.removeFromBasket(id),
	() => openOrder()
);
const orderView = new OrderFormView(
	(payment, address) => {
		appState.updateOrder({ payment, address });
	},
	() => openContacts()
);
const contactsView = new ContactsFormView(
	(email, phone) => {
		appState.updateContacts({ email, phone });
	},
	() => submitOrder()
);
const successView = new SuccessView(() => modal.close());

events.on(AppEvents.ItemsChanged, () => {
	const cards = appState.catalog.map((product) => catalogCardView.render(product));
	appView.renderCatalog(cards);
});

events.on(AppEvents.BasketChanged, () => {
	appView.setBasketCount(appState.basketCount);
});

events.on(AppEvents.PreviewChanged, () => {
	const product = appState.preview;
	if (!product) {
		return;
	}
	appView.lockPage(true);
	modal.open(previewCardView.render(product, appState.inBasket(product.id)));
});

events.on(AppEvents.OrderChanged, () => {
	const errors = appState.validateOrder();
	if (document.querySelector('#modal-container.modal_active')) {
		appView.lockPage(true);
		modal.open(
			orderView.render({
				payment: appState.order.payment,
				address: appState.order.address,
				errors,
			})
		);
	}
});

events.on(AppEvents.ContactsChanged, () => {
	const errors = appState.validateContacts();
	if (document.querySelector('#modal-container.modal_active')) {
		appView.lockPage(true);
		modal.open(
			contactsView.render({
				email: appState.order.email,
				phone: appState.order.phone,
				errors,
			})
		);
	}
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
	modal.open(basketView.render(appState.basketItems, appState.basketTotal));
}

function openOrder() {
	const errors = appState.validateOrder();
	appView.lockPage(true);
	modal.open(
		orderView.render({
			payment: appState.order.payment,
			address: appState.order.address,
			errors,
		})
	);
}

function openContacts() {
	const orderErrors = appState.validateOrder();
	if (Object.keys(orderErrors).length) {
		appState.updateOrder({});
		return;
	}
	const contactErrors = appState.validateContacts();
	appView.lockPage(true);
	modal.open(
		contactsView.render({
			email: appState.order.email,
			phone: appState.order.phone,
			errors: contactErrors,
		})
	);
}

async function submitOrder() {
	const contactErrors = appState.validateContacts();
	if (Object.keys(contactErrors).length || !appState.canCheckout()) {
		appState.updateContacts({});
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
		const description = fallback.querySelector('.order-success__description');
		if (description) {
			description.textContent = 'Не удалось оформить заказ. Повторите попытку.';
		}
		appView.lockPage(true);
		modal.open(fallback);
	}
}

bootstrap();
