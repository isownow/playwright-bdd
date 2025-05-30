import { expect } from "@playwright/test";
import { test as base } from "../tests/fixtures";
import { InventoryPage } from "../page-objects/InventoryPage";
import * as locators from "../utils/locators.json";
import * as allProducts from "../constants/products.json";
import * as colors from "../constants/colors.js";
import * as urls from "../configs/url-paths.json";
import users from "../data/credentials.json";
import {
    verifyZAOrder,
    verifyAZOrder,
    verifyHighToLow,
    verifyLowToHigh,
} from "../utils/helpers";

const elements = [
    { name: "menu", locator: locators.ProductsPage.openMenuButtonID },
    { name: "cart", locator: locators.ProductsPage.shoppingCartClass },
    {
        name: "filter",
        locator: locators.ProductsPage.sortSelector.selectorClass,
    },
];

// This fixture depends on login fixture and initializes the inventory object.
export const test = base.extend<{ inventory: InventoryPage }>({
    inventory: async ({ page, baseURL, login }, use) => {
        if (!login) {
            throw new Error("Login fixture missing.");
        }

        const inventory = new InventoryPage(page, baseURL);
        await use(inventory);
    },
});

users.forEach((user) => {
    test.describe.parallel(`Tests for ${user.username}`, () => {
        test.use({ user });

        test.describe("Page load and product display", () => {
            test(`@Positive Inventory page loads successfully after login`, async ({
                inventory,
            }) => {
                // Validate if the current url is https://www.saucedemo.com/inventory.html
                inventory.validateCurrentURL(urls.inventoryPage);
            });

            test(`@Positive At least one product card is present`, async ({
                inventory,
            }) => {
                const products = await inventory.getAllProductNames();

                expect(products.length).toBeGreaterThan(0);
            });
        });

        test.describe("Basic button and cursor functionality tests on Products page", () => {
            for (const element of elements) {
                test(`@Positive Mouse cursor changes when pointed on ${element.name} icon`, async ({
                    inventory,
                }) => {
                    const cursor = await inventory.getCursorStyle(
                        element.locator,
                    );

                    // Validate whether the mouse cursor changed
                    expect.soft(cursor).toEqual("pointer");
                });
            }

            test(`@Positive Menu should open`, async ({ inventory }) => {
                // Click the open menu icon
                await inventory.clickButtonByName("Open Menu");

                // Validate that the menu was opened
                await inventory.validateAttribute(
                    locators.ProductsPage.openMenuWrapperClass,
                    locators.ProductsPage.menuVisibilityAttribute,
                    "false",
                );
            });

            test(`@Positive Menu should close`, async ({ inventory }) => {
                // Click the open menu icon
                await inventory.clickButtonByName(
                    locators.ProductsPage.openMenuIconName,
                );

                // Click the close menu icon
                await inventory.clickButtonByName(
                    locators.ProductsPage.closeMenuIconName,
                );

                // Validate that the menu was closed
                await inventory.validateAttribute(
                    locators.ProductsPage.openMenuWrapperClass,
                    locators.ProductsPage.menuVisibilityAttribute,
                    "true",
                );
            });

            test(`@Positive When user clicks on any 'Add to cart' button, it changes`, async ({
                inventory,
            }) => {
                // Add one product to the cart
                await inventory.addOneProductToCart(allProducts.products[0]);

                // Get the text of the button
                const buttonText = await inventory.getAddToCartButtonText(
                    allProducts.products[0],
                );

                // Get the text color of the button
                const buttonColor = await inventory.getElementColor(
                    locators.ProductsPage.addProductButtonID,
                );

                // Validate the button text
                expect(buttonText).toEqual("Remove");

                // Validate the button text color
                expect(`#${buttonColor}`).toEqual(
                    colors.inventoryPage.removeButton,
                );
            });
        });

        test.describe("Verify sorting order of items", () => {
            test(`@Positive Verify the sorting order displayed for A-Z on the 'All Items' page`, async ({
                inventory,
            }) => {
                // Get all product names
                const itemNames = await inventory.getAllProductNames();

                // Verify if the product names are in A to Z order
                expect(verifyAZOrder(itemNames)).toBeTruthy();
            });

            test(`@Positive Verify the sorting order displayed for Z-A on the 'All Items' page`, async ({
                inventory,
            }) => {
                // Select the Z-A filter option
                await inventory.selectSortOption(
                    locators.ProductsPage.sortSelector.zToA,
                );

                // Get all product names
                const itemNames = await inventory.getAllProductNames();

                // Verify if the product names are in Z to A order
                expect(verifyZAOrder(itemNames)).toBeTruthy();
            });

            test(`@Positive Verify the price order (low-high) displayed on the 'All Items' page`, async ({
                inventory,
            }) => {
                // Select the Price (low to high) option
                await inventory.selectSortOption(
                    locators.ProductsPage.sortSelector.lowToHigh,
                );

                // Get all product prices
                const itemPrices = await inventory.getAllProductPrices();

                // Verify if the product prices are ordered from High to Low
                expect(verifyLowToHigh(itemPrices)).toBeTruthy();
            });

            test(`@Positive Verify the price order (high-low) displayed on the 'All Items' page`, async ({
                inventory,
            }) => {
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
    });
});
