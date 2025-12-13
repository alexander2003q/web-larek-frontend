import { IView } from '../../base/View';

export interface ListData<T> {
	items: T[];
}

export interface ListSettings<T> {
	item: IView<T, unknown>;
	activeItemClass: string;
	itemClass: string;
}


