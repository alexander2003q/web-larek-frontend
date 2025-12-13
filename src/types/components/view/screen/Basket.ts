import { CardBasketData } from '../partial/CardBasket';

export interface BasketData {
	totalPrice: number;
	products: CardBasketData[];
	title: string;
}

export interface BasketSettings {
	totalPrice: string;
	products: string;
	title: string;
	submit: string;
	onSubmit: () => void;
}


