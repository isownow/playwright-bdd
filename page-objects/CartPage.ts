import { expect, Page } from "@playwright/test";
import { CommonFunctions } from "./CommonFunctions";
import { InventoryPage } from "./InventoryPage";
import * as locators from "../utils/locators.json";
import * as urlPaths from "../configs/url-paths.json";

export class CartPage extends CommonFunctions {
    readonly page: Page;

    constructor(page: Page, baseURL: string | undefined) {
        super(page, baseURL);
        this.page = page;
    }

    async cartPagePrereq(
        cart: CartPage,
        inventory: InventoryPage,
        products: string[],
    ) {
        // Adding products to the cart
        await inventory.clickButtonOnMultipleProducts(products);

        // Click on the cart icon
        await inventory.clickButtonByTestID(
            locators.ProductsPage.shoppingCartTID,
        );

        // Assert successful navigation
        await cart.validateSuccessfulNavigation(urlPaths.cartPage);
    }

    async validateEmptyCart() {
        const itemCount = await this.page
            .getByTestId(locators.ProductsPage.productTID)
            .count();
        expect(itemCount).toBe(0); // Cart should be empty
    }
}
