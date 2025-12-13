import { PaymentMethod, ProductCategory } from './WebLarekApi';

export interface ICatalogModelItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

export interface ICatalogModel {
	items: Map<string, ICatalogModelItem>;
	setItems: (products: ICatalogModelItem[]) => void;
	getItem: (id: string) => ICatalogModelItem | undefined;
}

export enum CatalogChanges {
	changeCatalog = 'catalog:change',
}

export interface IBasketModel {
	items: Set<string>;
	addItem: (id: string) => void;
	removeItem: (id: string) => void;
}

export enum BasketChanges {
	changeBasket = 'basket:change',
	addBasket = 'ui:basket-add',
	removeBasket = 'ui:basket-remove',
}

export interface IOrderModelData {
	payment: PaymentMethod;
	address: string;
}

export interface IOrderModel {
	data: IOrderModelData;
	setData: (data: IOrderModelData) => void;
}

export enum OrderChanges {
	changeOrder = 'order:change',
	submitOrder = 'order:submit',
}

export interface IContactsModelData {
	email: string;
	phone: string;
}

export interface IContactsModel {
	dats: IContactsModelData;
	setData: (data: IContactsModelData) => void;
}

export enum contactsChanges {
	changeContacts = 'contacts:change',
	submitContacts = 'contacts:submit',
}

export enum AppStateModals {
	preview = 'modal:preview',
	basket = 'modal:basket',
	order = 'modal:order',
	contacts = 'modal:contacts',
	success = 'modal:success',
}

export interface AppState {
	openModal: (modal: AppStateModals) => void;
}
