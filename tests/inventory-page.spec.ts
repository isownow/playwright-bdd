import test, { expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { InventoryPage } from "../page-objects/InventoryPage";
import { CommonFunctions } from "../page-objects/CommonFunctions";
import * as locators from "../utils/locators.json";
import * as allProducts from "../constants/products.json";
import * as colors from "../constants/colors.json";

let inventory: InventoryPage;
let commonFunc: CommonFunctions;

test.beforeEach(async ({ page, baseURL }) => {
    const login = new LoginPage(page, baseURL);
    inventory = new InventoryPage(page);
    commonFunc = new CommonFunctions(page);

    await login.performLogin();
});

test.skip("Should not have any automatically detectable accessibility issues", async () => {
    const accessibilityScanResults = await inventory.doAccessibilityScan();

    // Check if there are any issues in the scan
    expect(accessibilityScanResults.violations).toEqual([]);
});

test.describe("Basic button and cursor functionality tests on Products page", () => {
    test("@Positive Mouse cursor changes when pointed on menu icon", async () => {
        const cursor = await commonFunc.getCursorStyle(
            locators.ProductsPage.openMenuButtonID,
        );

        // Validate whether the mouse cursor changed
        expect.soft(cursor).toEqual("pointer");
    });

    test("@Positive Mouse cursor changes when pointed on cart icon", async () => {
        const cursor = await commonFunc.getCursorStyle(
            locators.ProductsPage.shoppingCartClass,
        );

        // Validate whether the mouse cursor changed
        expect.soft(cursor).toEqual("pointer");
    });

    test("@Positive Mouse cursor changes when pointed on filter", async () => {
        const cursor = await commonFunc.getCursorStyle(
            locators.ProductsPage.sortSelector.selectorClass,
        );

        // Validate whether the mouse cursor changed
        expect.soft(cursor).toEqual("pointer");
    });

    test("@Positive Menu should open", async ({ page }) => {
        // Click the open menu icon
        await commonFunc.clickButtonByName("Open Menu");

        // Validate that the menu was opened
        await expect(
            page.locator(locators.ProductsPage.openMenuWrapperClass),
        ).toHaveAttribute(
            locators.ProductsPage.menuVisibilityAttribute,
            "false",
        );
    });

    test("@Positive Menu should close", async ({ page }) => {
        // Click the open menu icon
        await commonFunc.clickButtonByName(
            locators.ProductsPage.openMenuIconName,
        );

        // Click the close menu icon
        await commonFunc.clickButtonByName(
            locators.ProductsPage.closeMenuIconName,
        );

        // Validate that the menu was closed
        await expect(
            page.locator(locators.ProductsPage.openMenuWrapperClass),
        ).toHaveAttribute(
            locators.ProductsPage.menuVisibilityAttribute,
            "true",
        );
    });

    test("@Positive When user clicks on any 'Add to cart' button, it changes", async ({
        page,
    }) => {
        // Add one product to the cart
        await inventory.addOneProductToCart(allProducts.products[0]);

        // Get the text of the button
        const buttonText = await inventory.getAddToCartButtonText(
            allProducts.products[0],
        );

        // Get the text color of the button
        const addButtonLocator = page.locator("#remove-sauce-labs-backpack");
        const buttonColor = await commonFunc.getElementColor(addButtonLocator);

        // Validate the button text
        expect(buttonText).toEqual("Remove");

        // Validate the button text color
        expect(`#${buttonColor}`).toEqual(colors.ProductsPage.removeButton);
    });
});
