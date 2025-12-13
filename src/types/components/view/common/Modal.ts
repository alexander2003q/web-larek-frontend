import { IView } from '../../base/View';

export interface ModalData<C> {
	content: C;
	isActive: boolean;
	isError?: boolean;
}

export interface ModalSettings<C> {
	close: string;
	content: string;
	footer: string;
	contentView: IView<C>;
	actions: HTMLElement[];
	activeClass: string;
	errorClass: string;
	onOpen?: () => void;
	onClose?: () => void;
}


