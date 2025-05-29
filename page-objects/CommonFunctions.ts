import { expect, Page } from "@playwright/test";
import * as locators from "../utils/locators.json";

export class CommonFunctions {
    readonly page: Page;
    readonly baseURL?: string;

    constructor(page: Page, baseURL: string | undefined) {
        this.page = page;
        this.baseURL = baseURL;
    }

    async validateSuccessfulNavigation(urlPath: string) {
        if (this.baseURL)
            await expect(this.page).toHaveURL(`${this.baseURL}${urlPath}`);
        else throw new Error("Base URL not found!");
    }

    async clickButtonByName(buttonName: string) {
        await this.page
            .getByRole("button", {
                name: buttonName,
            })
            .click();
    }

    async clickButtonByTestID(testIDLocator: string) {
        await this.page.getByTestId(testIDLocator).click();
    }

    async validateScreenshot(testName: string) {
        const isHeadless = this.page.context().browser()?.isConnected();

        if (isHeadless) {
            await expect.soft(this.page).toHaveScreenshot(`${testName}.png`, {
                maxDiffPixels: 100,
            });
        }
    }

    async validateCurrentURL(expectedURL: string) {
        const currentURL = this.page.url();
        expect(currentURL).toEqual(`${this.baseURL}${expectedURL}`);
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

    async validateProducts(products: string[]) {
        expect(await this.getAllProductNames()).toEqual(products);
    }

    async validateAttribute(locator: string, attribute: string, value: string) {
        await expect(this.page.locator(locator)).toHaveAttribute(
            attribute,
            value,
        );
    }

    async clickAndNavigateToNewTab(locator: string) {
        let newTabPromise: Promise<Page>;

        await Promise.all([
            (newTabPromise = this.page.waitForEvent("popup")),
            this.page.click(locator),
        ]);

        // Capture the new tab
        const newTab = await newTabPromise;

        return newTab;
    }

    async getCursorStyle(selector: string) {
        const cursor = await this.page.$eval(selector, (element) => {
            return window.getComputedStyle(element).cursor;
        });

        return cursor;
    }

    async getElementColor(locator: string) {
        const element = this.page.locator(locator);
        const elementColor = await element?.evaluate((el) => {
            const rgb = window.getComputedStyle(el).color;
            return rgb
                .replace(/^rgb\(|\)$/g, "") // Remove "rgb("
                .split(", ") // Split into individual values
                .map((x) => parseInt(x).toString(16).padStart(2, "0")) // Convert to hex
                .join(""); // Join values together
        });

        return elementColor;
    }

    async fillTextBoxByRole(name: string, text: string) {
        await this.page.getByRole("textbox", { name: name }).fill(text);
    }
}
