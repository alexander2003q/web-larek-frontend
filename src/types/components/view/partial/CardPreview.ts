import { ProductCategory } from '../../model/WebLarekApi';

export interface CardPreviewData {
	id: string;
	title: string;
	image: string;
	category: ProductCategory;
	description: string;
	price: number | null;
}

export interface CardPreviewSettings {
	title: string;
	image: string;
	description: string;
	category: string;
	price: string;
	select: string;
	onSelect: (id: string) => void;
}


