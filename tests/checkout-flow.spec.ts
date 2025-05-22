/**
 * These tests are designed to run sequentially.
 * Running tests independently may lead to unexpected results.
 */

import test, { expect, Page } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { InventoryPage } from "../page-objects/InventoryPage";
import { CheckoutOverviewPage } from "../page-objects/CheckoutOverviewPage";
import { CartPage } from "../page-objects/CartPage";
import { CheckoutFillInfoPage } from "../page-objects/CheckoutFillInfoPage";
import { OrderPlacedPage } from "../page-objects/OrderPlacedPage";
import * as userInfo from "../data/user-info.json";
import * as urlPaths from "../configs/url-paths.json";
import * as allProducts from "../constants/products.json";
import {
    calculateTotal,
    calculateTax,
    roundToDecimals,
} from "../utils/helpers";
import * as locators from "../utils/locators.json";

test.describe("Checkout Process", () => {
    test.describe.configure({ mode: "serial" });

    let page: Page;
    let inventory: InventoryPage;
    let checkoutOverview: CheckoutOverviewPage;
    let cart: CartPage;
    let checkOutFill: CheckoutFillInfoPage;
    let orderPlaced: OrderPlacedPage;
    let subtotal: number;
    let tax: number;

    const products = [
        allProducts.products[0],
        allProducts.products[2],
        allProducts.products[4],
    ];

    test.beforeAll(async ({ browser, baseURL }) => {
        const context = await browser.newContext();
        page = await context.newPage();

        inventory = new InventoryPage(page, baseURL);
        checkoutOverview = new CheckoutOverviewPage(page, baseURL);
        cart = new CartPage(page, baseURL);
        checkOutFill = new CheckoutFillInfoPage(page, baseURL);
        orderPlaced = new OrderPlacedPage(page, baseURL);
        const login = new LoginPage(page, baseURL);

        await login.performLogin();
    });

    test.afterAll(async () => {
        await page.close();
    });

    test(`Add ${products.length} products to the cart and verify cart badge`, async () => {
        await inventory.validateSuccessfulNavigation(urlPaths.inventoryPage);

        // Adding products to the cart
        await inventory.addProductsToCart(products);

        // Check whether the cart badge is visible
        inventory.isCartBadgeVisible();

        // Validate the number displayed on the cart badge
        inventory.validateCartBadgeNumber(products.length);
    });

    test("Proceed to cart page and verify the products displayed", async () => {
        // Click on the cart icon
        await inventory.clickButtonByTestID(
            locators.ProductsPage.shoppingCartTID,
        );

        // Assert successful navigation
        await cart.validateSuccessfulNavigation(urlPaths.cartPage);

        // Validate whether the products present are as expected
        await cart.validateProducts(products);
    });

    test("Checkout and add personal information", async () => {
        // Checkout
        await cart.clickButtonByName(locators.CartPage.nextPageButtonName);

        // Assert successful navigation
        await checkOutFill.validateSuccessfulNavigation(
            urlPaths.checkoutFillInfoPage,
        );

        // Fill the information
        await checkOutFill.fillTextBoxByRole(
            locators.CheckoutFillInfoPage.name1,
            userInfo.checkoutInfo.firstName,
        );
        await checkOutFill.fillTextBoxByRole(
            locators.CheckoutFillInfoPage.name2,
            userInfo.checkoutInfo.lastName,
        );
        await checkOutFill.fillTextBoxByRole(
            locators.CheckoutFillInfoPage.pinCodePH,
            userInfo.checkoutInfo.postalCode,
        );
    });

    test("Go to overview page and verify the products", async () => {
        // Continue
        await checkOutFill.clickButtonByName(
            locators.CheckoutFillInfoPage.nextPageButtonName,
        );

        // Assert successful navigation
        await checkoutOverview.validateSuccessfulNavigation(
            urlPaths.checkoutOverviewPage,
        );

        // Validate whether the products present are as expected
        await checkoutOverview.validateProducts(products);
    });

    test("Verify subtotal on the overview page", async () => {
        // Get prices of all the products present on the page
        // const prices = await checkoutOverview.getProductPrices(products);
        const prices = await checkoutOverview.getAllProductPrices();

        // Sum of all the prices
        subtotal = roundToDecimals(calculateTotal(prices));

        // Get the displayed subtotal from the page
        const displayedSubtotal = await checkoutOverview.getDisplayedAmount(
            locators.CheckoutOverviewPage.subtotalTID,
        );

        // Validate the displayed subtotal on the page
        expect.soft(displayedSubtotal).toEqual(subtotal);
    });

    test("Verify tax on the overview page", async () => {
        // Calculate tax
        tax = roundToDecimals(calculateTax(subtotal, 8));

        // Get the displayed tax from the page
        const displayedTax = await checkoutOverview.getDisplayedAmount(
            locators.CheckoutOverviewPage.taxITD,
        );

        // Validate displayed tax on the page
        expect.soft(displayedTax).toEqual(tax);
    });

    test("Verify total on the overview page", async () => {
        // Calculate final total
        const finalTotal = roundToDecimals(subtotal + tax);

        // Get the displayed final total from the page
        const displayedFinalTotal = await checkoutOverview.getDisplayedAmount(
            locators.CheckoutOverviewPage.totalTID,
        );

        // Validate final calculated price
        expect.soft(displayedFinalTotal).toEqual(finalTotal);
    });

    test("Go to final page and visually verify the page", async ({
        headless,
    }) => {
        // Finish
        await checkoutOverview.clickButtonByName(
            locators.CheckoutOverviewPage.nextPageButtonName,
        );

        // Assert successful navigation
        await orderPlaced.validateSuccessfulNavigation(
            urlPaths.orderPlacedPage,
        );

        // Verify the thank you page visually
        await orderPlaced.validateScreenshot(headless);
    });

    test("Go back to home and visually verify the home page", async ({
        headless,
    }) => {
        // Back Home
        await orderPlaced.clickButtonByName(
            locators.OrderPlacedPage.nextPageButtonName,
        );

        // Assert successful navigation
        await inventory.validateSuccessfulNavigation(urlPaths.inventoryPage);

        // Verify the home page visually
        await inventory.validateScreenshot(headless);
    });
});
