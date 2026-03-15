import { Api } from '../base/api';
import { ApiListResponse, OrderData, OrderResult, Product } from '../../types';

export class WebLarekApi extends Api {
	constructor(cdnUrl: string, baseUrl: string) {
		super(baseUrl);
		this.cdnUrl = cdnUrl;
	}

	private readonly cdnUrl: string;

	async getProducts(): Promise<ApiListResponse<Product>> {
		const response = (await this.get('/product/')) as ApiListResponse<Product>;
		response.items = response.items.map((item) => ({
			...item,
			image: `${this.cdnUrl}${item.image}`,
		}));
		return response;
	}

	async getProduct(id: string): Promise<Product> {
		const response = (await this.get(`/product/${id}`)) as Product;
		return {
			...response,
			image: `${this.cdnUrl}${response.image}`,
		};
	}

	async createOrder(order: OrderData): Promise<OrderResult> {
		return (await this.post('/order', order)) as OrderResult;
	}
}
