/**
 * These tests are designed to run sequentially.
 * Running tests independently may lead to unexpected results.
 */

import test, { expect, Page } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { ProductsPage } from "../page-objects/ProductsPage";
import { CommonFunctions } from "../page-objects/CommonFunctions";
import * as userInfo from "../data/user-info.json";
import * as urlPaths from "../configs/url-paths.json";
import {
    calculateTotal,
    calculateTax,
    roundToDecimals,
} from "../utils/helpers";
import * as locators from "../utils/locators.json";

test.describe("Checkout Process", () => {
    test.describe.configure({ mode: "serial" });

    let page: Page;
    let prodPage: ProductsPage;
    let commonFunc: CommonFunctions;
    let url: string | undefined;
    let sumOfPrices: number;
    let tax: number;
    const currencySymbol = "$";

    const products = [
        "Sauce Labs Backpack",
        "Sauce Labs Bolt T-Shirt",
        "Sauce Labs Fleece Jacket",
    ];

    test.beforeAll(async ({ browser, baseURL }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        url = baseURL;

        prodPage = new ProductsPage(page);
        commonFunc = new CommonFunctions(page);
        const login = new LoginPage(page, baseURL);

        await login.performLogin();
    });

    test.afterAll(async () => {
        await page.close();
    });

    test(`Add ${products.length} products to the cart and verify cart badge`, async () => {
        // Assert successful navigation
        await expect(page).toHaveURL(`${url}${urlPaths.productsPage}`);

        // Adding products to the cart
        await prodPage.addProductsToCart(products);

        // Check whether the cart badge is visible
        expect(
            page.getByTestId(locators.ProductsPage.shoppingCartTID),
        ).toBeVisible();

        // Validate the number displayed on the cart badge
        expect(
            page.getByTestId(locators.ProductsPage.shoppingCartBadgeTID),
        ).toHaveText(products.length.toString());
    });

    test("Proceed to cart page and verify the products displayed", async () => {
        // Click on the cart icon
        await page.getByTestId(locators.ProductsPage.shoppingCartTID).click();

        // Assert successful navigation
        await expect(page).toHaveURL(`${url}${urlPaths.cartPage}`);

        // Validate whether the products present are as expected
        expect(await prodPage.getAllProductNames()).toEqual(products);
    });

    test("Checkout and add personal information", async () => {
        // Checkout
        await commonFunc.clickButtonByName(
            locators.CartPage.nextPageButtonName,
        );

        // Assert successful navigation
        await expect(page).toHaveURL(`${url}${urlPaths.checkoutFillInfoPage}`);

        // Fill the information
        await page
            .getByRole("textbox", { name: locators.CheckoutFillInfoPage.name1 })
            .fill(userInfo.checkoutInfo.firstName);
        await page
            .getByRole("textbox", { name: locators.CheckoutFillInfoPage.name2 })
            .fill(userInfo.checkoutInfo.firstName);
        await page
            .getByRole("textbox", {
                name: locators.CheckoutFillInfoPage.pinCodePH,
            })
            .fill(userInfo.checkoutInfo.firstName);
    });

    test("Go to overview page and verify the products", async () => {
        // Continue
        await commonFunc.clickButtonByName(
            locators.CheckoutFillInfoPage.nextPageButtonName,
        );

        // Assert successful navigation
        await expect(page).toHaveURL(`${url}${urlPaths.checkoutOverviewPage}`);

        // Validate whether the products present are as expected
        expect(await prodPage.getAllProductNames()).toEqual(products);
    });

    test("Verify subtotal on the overview page", async () => {
        // Get prices of all the products present on the page
        const prices = await prodPage.getProductPrices(products);

        sumOfPrices = roundToDecimals(calculateTotal(prices));
        const gotSubtotal = await page
            .getByTestId(locators.CheckoutOverviewPage.subtotalTID)
            .textContent();
        const gotSubtotalFormatted = Number(
            gotSubtotal?.split(currencySymbol)[1],
        );

        // Validate calculated subtotal
        expect.soft(gotSubtotalFormatted).toEqual(sumOfPrices);
    });

    test("Verify tax on the overview page", async () => {
        tax = roundToDecimals(calculateTax(sumOfPrices, 8));
        const gotTax = await page
            .getByTestId(locators.CheckoutOverviewPage.taxITD)
            .textContent();
        const gotTaxFormatted = Number(gotTax?.split(currencySymbol)[1]);

        // Validate calculated tax
        expect.soft(gotTaxFormatted).toEqual(tax);
    });

    test("Verify total on the overview page", async () => {
        const finalTotal = roundToDecimals(sumOfPrices + tax);
        const gotFinalTotal = await page
            .getByTestId(locators.CheckoutOverviewPage.totalTID)
            .textContent();
        const gotFinalTotalFormatted = Number(
            gotFinalTotal?.split(currencySymbol)[1],
        );

        // Validate final calculated price
        expect.soft(gotFinalTotalFormatted).toEqual(finalTotal);
    });

    test("Go to final page and visually verify the page", async () => {
        // Finish
        await commonFunc.clickButtonByName(
            locators.CheckoutOverviewPage.nextPageButtonName,
        );

        // Assert successful navigation
        await expect(page).toHaveURL(`${url}${urlPaths.orderPlacedPage}`);

        // Verify the thank you page
        await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
    });

    test("Go back to home and visually verify the home page", async () => {
        // Back Home
        await commonFunc.clickButtonByName(
            locators.OrderPlacedPage.nextPageButtonName,
        );

        // Assert successful navigation
        await expect(page).toHaveURL(`${url}${urlPaths.productsPage}`);

        // Verify the home page
        await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
    });
});
