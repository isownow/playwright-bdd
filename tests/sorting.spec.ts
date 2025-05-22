import { expect, test } from "@playwright/test";
import { InventoryPage } from "../page-objects/InventoryPage";
import {
    verifyZAOrder,
    verifyAZOrder,
    verifyHighToLow,
    verifyLowToHigh,
} from "../utils/helpers";
import * as locators from "../utils/locators.json";
import { LoginPage } from "../page-objects/LoginPage";

test.describe("Verify sorting order of items", () => {
    let inventory: InventoryPage;

    test.beforeEach(async ({ page, baseURL }) => {
        const login = new LoginPage(page, baseURL);
        inventory = new InventoryPage(page, baseURL);

        await login.performLogin();
    });

    test("@Positive Verify the sorting order displayed for A-Z on the 'All Items' page", async () => {
        // Get all product names
        const itemNames = await inventory.getAllProductNames();

        // Verify if the product names are in A to Z order
        expect(verifyAZOrder(itemNames)).toBeTruthy();
    });

    test("@Positive Verify the sorting order displayed for Z-A on the 'All Items' page", async () => {
        // Select the Z-A filter option
        await inventory.selectSortOption(
            locators.ProductsPage.sortSelector.zToA,
        );

        // Get all product names
        const itemNames = await inventory.getAllProductNames();

        // Verify if the product names are in Z to A order
        expect(verifyZAOrder(itemNames)).toBeTruthy();
    });

    test("@Positive Verify the price order (low-high) displayed on the 'All Items' page", async () => {
        // Select the Price (low to high) option
        await inventory.selectSortOption(
            locators.ProductsPage.sortSelector.lowToHigh,
        );

        // Get all product prices
        const itemPrices = await inventory.getAllProductPrices();

        // Verify if the product prices are ordered from High to Low
        expect(verifyLowToHigh(itemPrices)).toBeTruthy();
    });

    test("@Positive Verify the price order (high-low) displayed on the 'All Items' page", async () => {
        // Select the Price (high to low) option
        await inventory.selectSortOption(
            locators.ProductsPage.sortSelector.highToLow,
        );

        // Get all product prices
        const itemPrices = await inventory.getAllProductPrices();

        // Verify if the product prices are ordered from High to Low
        expect(verifyHighToLow(itemPrices)).toBeTruthy();
    });
});
