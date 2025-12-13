export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка';

export type PaymentMethod = 'online' | 'upon receipt';

export interface Product {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

export interface OrderData {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface OrderResult {
	id: string;
	total: number;
}

export interface IWebLarekAPI {
	getProducts: () => Promise<ApiListResponse<Product>>;
	getProduct: (id: string) => Promise<Product>;
	createOrder: (order: OrderData) => Promise<OrderResult>;
}
