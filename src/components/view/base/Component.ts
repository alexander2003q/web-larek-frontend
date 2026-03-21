import { cloneById } from '../utils';

export abstract class Component<TData = void> {
	protected readonly container: HTMLElement;

	constructor(templateId: string) {
		this.container = cloneById<HTMLElement>(templateId);
	}

	render(data: TData): HTMLElement {
		this.applyData(data);
		return this.container;
	}

	get element(): HTMLElement {
		return this.container;
	}

	protected abstract applyData(data: TData): void;
}
