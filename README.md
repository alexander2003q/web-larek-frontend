# Проектная работа "Веб-ларек"

Интернет-магазин с каталогом товаров, корзиной и оформлением заказа в модальных окнах.

Стек: TypeScript, SCSS, Webpack.

## Установка и запуск

```bash
npm install
npm run start
```

Приложение откроется в dev-сервере Webpack.

## Сборка и проверки

```bash
npm run build
npm run lint
npx tsc --noEmit
```

## Структура проекта

- `src/index.ts` — композиция приложения, связывание моделей и view через события.
- `src/types.ts` — единый файл доменных типов и интерфейсов данных API.
- `src/components/base/`
  - `api.ts` — базовый HTTP-клиент (`Api`) для `GET`/`POST`.
  - `events.ts` — брокер событий (`EventEmitter`).
- `src/components/model/`
  - `AppState.ts` — состояние приложения: каталог, корзина, черновик заказа, валидация.
  - `WebLarekApi.ts` — API-слой предметной области (`getProducts`, `getProduct`, `createOrder`).
- `src/components/view/`
  - `AppView.ts` — корневое представление страницы (каталог, счетчик корзины, блокировка страницы).
  - `Modal.ts` — управление модальным контейнером.
  - `Templates.ts` — представления карточек, корзины, форм и окна успеха.
  - `utils.ts` — UI-утилиты для шаблонов (`formatPrice`, `cloneById`, CSS-классы категорий).
- `src/utils/`
  - `constants.ts` — URL API/CDN.
  - `utils.ts` — общие утилиты работы с DOM и объектами.

## Архитектура

В проекте используется событийно-ориентированная архитектура в стиле MVP:

- **Model**: `AppState`, `WebLarekApi`.
- **View**: классы из `src/components/view`.
- **Presenter/Composition root**: `src/index.ts` (подписки на события, orchestration пользовательских сценариев).
- **Event Bus**: `EventEmitter` из `src/components/base/events.ts`.

View-классы не ходят в API напрямую и не знают о внутренней реализации моделей.  
Модели не знают о DOM. Связь выполняется через события и колбэки, переданные при создании view.

## Модели данных и типы

Все ключевые типы объявлены в `src/types.ts`.

- `ProductCategory` — категории товара.
- `PaymentMethod` — способ оплаты (`online` | `upon receipt`).
- `Product` — карточка товара.
- `ApiListResponse<T>` — тип ответа API со списком.
- `OrderData` — полезная нагрузка заказа.
- `OrderResult` — ответ сервера после успешного заказа.
- `FormErrors` — ошибки валидации форм.

## Программные интерфейсы ключевых компонентов

- `Api` (`src/components/base/api.ts`)
  - `get(uri)` — HTTP GET
  - `post(uri, data, method)` — HTTP POST/PUT/DELETE
- `WebLarekApi`
  - `getProducts(): Promise<ApiListResponse<Product>>`
  - `getProduct(id: string): Promise<Product>`
  - `createOrder(order: OrderData): Promise<OrderResult>`
- `AppState`
  - работа с каталогом и preview: `setCatalog`, `setPreview`, `preview`
  - работа с корзиной: `toggleBasket`, `removeFromBasket`, `basketItems`, `basketTotal`, `basketCount`
  - работа с заказом: `updateOrder`, `updateContacts`, `validateOrder`, `validateContacts`, `buildOrderPayload`
- `Modal`
  - `open(content: HTMLElement)` / `close()`
- View-шаблоны (`Templates.ts`)
  - классы карточек, корзины, форм заказа/контактов и окна успешной оплаты
  - каждый класс инкапсулирует свою часть UI и публичный `render(...)`

## Взаимодействие частей приложения

1. `index.ts` создает экземпляры `EventEmitter`, `AppState`, `WebLarekApi` и всех view-классов.
2. После загрузки `getProducts()` данные сохраняются в `AppState`, событие `items:changed` перерисовывает каталог.
3. Действия пользователя в view вызывают переданные колбэки (например, открыть preview, добавить в корзину, изменить форму).
4. `AppState` обновляет данные и эмитит события (`basket:changed`, `order:changed`, `contacts:changed`).
5. `index.ts` слушает события и обновляет соответствующее представление через `render(...)`/`modal.open(...)`.
6. При отправке заказа `WebLarekApi.createOrder(...)` вызывается из `index.ts`; после успеха состояние очищается и показывается `SuccessView`.

## Соответствие архитектуры и кода

- Взаимодействие между слоями организовано через события и композицию в `index.ts`.
- Повторяющиеся части вынесены в утилиты (`src/utils/utils.ts`, `src/components/view/utils.ts`).
- Запросы к API изолированы в `WebLarekApi` и базовом `Api`.
- Типы не дублируются и хранятся централизованно в `src/types.ts`.
