import { ensureElement } from '../../../utils/utils';
import { Component } from './Component';

type OnFieldChange = (field: string, value: string) => void;

export abstract class Form<TData = void> extends Component<TData> {
	protected readonly form: HTMLFormElement;
	private readonly submitButton: HTMLButtonElement;
	private readonly errorsBlock: HTMLElement;

	constructor(
		templateId: string,
		private readonly onFieldChange: OnFieldChange,
		private readonly onSubmit: () => void,
		submitButtonSelector: string
	) {
		super(templateId);
		this.form = this.container as HTMLFormElement;
		this.submitButton = ensureElement<HTMLButtonElement>(submitButtonSelector, this.form);
		this.errorsBlock = ensureElement<HTMLElement>('.form__errors', this.form);

		this.form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.onSubmit();
		});

		this.form.addEventListener('input', (evt) => {
			const target = evt.target;
			if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
				this.emitFieldChange(target.name, target.value);
			}
		});
	}

	setError(message: string): void {
		this.errorsBlock.textContent = message;
	}

	setSubmitDisabled(isDisabled: boolean): void {
		this.submitButton.disabled = isDisabled;
	}

	protected emitFieldChange(field: string, value: string): void {
		this.onFieldChange(field, value);
	}
}
