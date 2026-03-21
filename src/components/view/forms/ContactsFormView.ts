import { ensureElement } from '../../../utils/utils';
import { FormErrors } from '../../../types';
import { Form } from '../base/Form';

interface ContactsFormData {
	email: string;
	phone: string;
	errors: FormErrors;
}

export class ContactsFormView extends Form<ContactsFormData> {
	private readonly emailInput: HTMLInputElement;
	private readonly phoneInput: HTMLInputElement;

	constructor(
		onFieldChange: (field: string, value: string) => void,
		onSubmit: () => void
	) {
		super('contacts', onFieldChange, onSubmit, 'button[type="submit"]');
		this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);
	}

	protected applyData(data: ContactsFormData): void {
		if (this.emailInput.value !== data.email) {
			this.emailInput.value = data.email;
		}
		if (this.phoneInput.value !== data.phone) {
			this.phoneInput.value = data.phone;
		}

		const error = data.errors.email ?? data.errors.phone ?? '';
		this.setError(error);
		this.setSubmitDisabled(Boolean(error));
	}
}
