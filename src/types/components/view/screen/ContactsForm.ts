export interface ContactsFormData {
	isActive: boolean;
	isDisabled: boolean;
	isError: boolean;
}

export interface ContactsFormSettings {
	action: string;
	onSubmit: () => void;
}

