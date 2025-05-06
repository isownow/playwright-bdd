import { Page } from "@playwright/test";
import * as locators from "../utils/locators.json";
import AxeBuilder from "@axe-core/playwright";

export class InventoryPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getAllProductNames() {
        const productNames: string[] = [];
        const allProductsLocator = this.page.getByTestId(
            locators.ProductsPage.productTID,
        );

        for (const product of await allProductsLocator.all()) {
            const productName = await product
                .getByTestId(locators.ProductsPage.productNameTID)
                .textContent();
            if (productName !== null) {
                productNames.push(productName);
            }
        }
        return productNames;
    }

    async selectSortOption(option: string) {
        await this.page
            .getByTestId(locators.ProductsPage.sortSelector.selectorTID)
            .selectOption(option);
    }

    async getAllProductPrices() {
        const productPrices: string[] = [];
        const allProductsLocator = this.page.getByTestId(
            locators.ProductsPage.productTID,
        );

        for (const product of await allProductsLocator.all()) {
            const productPrice = await product
                .getByTestId(locators.ProductsPage.productPriceTID)
                .textContent();
            if (productPrice !== null) {
                productPrices.push(productPrice);
            }
        }
        return productPrices;
    }

    async getProductPrices(products: string[]) {
        const productPrices: string[] = [];
        for (const product of products) {
            const price = await this.page
                .getByTestId(locators.ProductsPage.productTID)
                .filter({
                    has: this.page
                        .getByTestId(locators.ProductsPage.productNameTID)
                        .filter({ hasText: product }),
                })
                .getByTestId(locators.ProductsPage.productPriceTID)
                .textContent();
            if (price !== null) productPrices.push(price);
            else throw new Error(`Product price not found!`);
        }
        return productPrices;
    }

    async addProductsToCart(products: string[]) {
        for (const product of products) {
            await this.page
                .getByTestId(locators.ProductsPage.productTID)
                .filter({
                    has: this.page
                        .getByTestId(locators.ProductsPage.productNameTID)
                        .filter({ hasText: product }),
                })
                .getByRole("button")
                .click();
        }
    }

    async addOneProductToCart(product: string) {
        await this.page
            .getByTestId(locators.ProductsPage.productTID)
            .filter({
                has: this.page
                    .getByTestId(locators.ProductsPage.productNameTID)
                    .filter({ hasText: product }),
            })
            .getByRole("button")
            .click();
    }

    async getAddToCartButtonText(product: string) {
        return await this.page
            .getByTestId(locators.ProductsPage.productTID)
            .filter({
                has: this.page
                    .getByTestId(locators.ProductsPage.productNameTID)
                    .filter({ hasText: product }),
            })
            .getByRole("button")
            .textContent();
    }

    async doAccessibilityScan() {
        return await new AxeBuilder({ page: this.page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();
    }
}
