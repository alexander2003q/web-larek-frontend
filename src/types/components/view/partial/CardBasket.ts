export interface CardBasketData {
	id: string;
	cardNumber: number;
	title: string;
	price: number | null;
}

export interface CardBasketSettings {
	cardNumber: string;
	title: string;
	price: string;
	delete: string;
	onRemove: (id: string) => void;
}


