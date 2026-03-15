import { ProductCategory } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';

const categoryClassMap: Record<ProductCategory, string> = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
};

export function categoryClassName(category: ProductCategory): string {
	return categoryClassMap[category];
}

export function formatPrice(price: number | null): string {
	if (price === null) {
		return 'Бесценно';
	}
	return `${price.toLocaleString('ru-RU')} синапсов`;
}

export function cloneById<T extends HTMLElement>(templateId: string): T {
	return cloneTemplate<T>(ensureElement<HTMLTemplateElement>(`#${templateId}`));
}
