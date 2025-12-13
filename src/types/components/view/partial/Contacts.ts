export interface ContactsData {
	email: string;
	phone: string;
}

export interface ContactsSettings {
	email: string;
	phone: string;
	onChange: (data: ContactsData) => void;
}


