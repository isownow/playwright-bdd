import { Page } from "@playwright/test";
import * as locators from "../utils/locators.json";

export class ProductsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getAllProductNames() {
        const itemNames: string[] = [];
        const allItemsLocator = this.page.getByTestId(
            locators.ProductsPage.item,
        );

        for (const item of await allItemsLocator.all()) {
            const itemName = await item
                .getByTestId(locators.ProductsPage.itemName)
                .textContent();
            if (itemName !== null) {
                itemNames.push(itemName);
            }
        }
        return itemNames;
    }

    async selectSortOption(option: string) {
        await this.page
            .getByTestId(locators.ProductsPage.sortSelector)
            .selectOption(option);
    }

    async getAllProductPrices() {
        const itemPrices: string[] = [];
        const allItemsLocator = this.page.getByTestId(
            locators.ProductsPage.item,
        );

        for (const item of await allItemsLocator.all()) {
            const itemPrice = await item
                .getByTestId(locators.ProductsPage.itemPrice)
                .textContent();
            if (itemPrice !== null) {
                itemPrices.push(itemPrice);
            }
        }
        return itemPrices;
    }
}
