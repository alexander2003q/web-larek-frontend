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

export interface ApiListResponse<T> {
	total: number;
	items: T[];
}

export interface OrderData {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

export interface OrderResult {
	id: string;
	total: number;
}

export interface FormErrors {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
}
