export interface OrderFormData {
	isActive: boolean;
	isDisabled: boolean;
	isError: boolean;
}

export interface OrderFormSettings {
	action: string;
	onNext: () => void;
}
