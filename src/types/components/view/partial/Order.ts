import { PaymentMethod } from '../../model/WebLarekApi';

export interface OrderData {
	payment: PaymentMethod;
	address: string;
}

export interface OrderSettings {
	payment: string;
	address: string;
	onChange: (data: OrderData) => void;
}


