import { ProductCategory } from '../../model/WebLarekApi';

export interface CardCatalogData {
	id: string;
	title: string;
	image: string;
	category: ProductCategory;
	price: number | null;
}

export interface CardCatalogSettings {
	title: string;
	image: string;
	category: string;
	price: string;
	onClick: (id: string) => void;
}


