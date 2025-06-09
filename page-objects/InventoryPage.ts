import { expect, Page } from "@playwright/test";
import * as locators from "../utils/locators.json";
import AxeBuilder from "@axe-core/playwright";
import { CommonFunctions } from "./CommonFunctions";

export class InventoryPage extends CommonFunctions {
    readonly page: Page;

    constructor(page: Page, baseURL: string | undefined) {
        super(page, baseURL);
        this.page = page;
    }

    async selectSortOption(option: string) {
        await this.page
            .getByTestId(locators.ProductsPage.sortSelector.selectorTID)
            .selectOption(option);
    }

    async getButtonTextOfProduct(product: string) {
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

    async isCartBadgeVisible() {
        expect(
            this.page.getByTestId(locators.ProductsPage.shoppingCartTID),
        ).toBeVisible();
    }

    async validateCartBadgeNumber(numOfProducts: number) {
        expect(
            this.page.getByTestId(locators.ProductsPage.shoppingCartBadgeTID),
        ).toHaveText(numOfProducts.toString());
    }
}
