import test, { expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { InventoryPage } from "../page-objects/InventoryPage";
import * as locators from "../utils/locators.json";
import * as allProducts from "../constants/products.json";
import * as colors from "../constants/colors.js";
import * as urls from "../configs/url-paths.json";
import users from "../data/credentials.json";

let inventory: InventoryPage;

const elements = [
    { name: "menu", locator: locators.ProductsPage.openMenuButtonID },
    { name: "cart", locator: locators.ProductsPage.shoppingCartClass },
    {
        name: "filter",
        locator: locators.ProductsPage.sortSelector.selectorClass,
    },
];

test.describe.parallel("Inventory page test", () => {
    users.forEach((user) => {
        test.beforeEach(async ({ page, baseURL }) => {
            const login = new LoginPage(
                page,
                baseURL,
                user.username,
                user.password,
            );
            inventory = new InventoryPage(page, baseURL);

            await login.performLogin();
        });

        test.describe("Page load and product display", () => {
            test(`@Positive Inventory page loads successfully after login for ${user.username}`, async () => {
                // Validate if the current url is https://www.saucedemo.com/inventory.html
                inventory.validateCurrentURL(urls.inventoryPage);
            });

            test(`@Positive At least one product card is present for ${user.username}`, async () => {
                const products = await inventory.getAllProductNames();

                expect(products.length).toBeGreaterThan(0);
            });
        });

        test.describe("Basic button and cursor functionality tests on Products page", () => {
            for (const element of elements) {
                test(`@Positive Mouse cursor changes when pointed on ${element.name} icon for ${user.username}`, async () => {
                    const cursor = await inventory.getCursorStyle(
                        element.locator,
                    );

                    // Validate whether the mouse cursor changed
                    expect.soft(cursor).toEqual("pointer");
                });
            }

            test(`@Positive Menu should open for ${user.username}`, async () => {
                // Click the open menu icon
                await inventory.clickButtonByName("Open Menu");

                // Validate that the menu was opened
                await inventory.validateAttribute(
                    locators.ProductsPage.openMenuWrapperClass,
                    locators.ProductsPage.menuVisibilityAttribute,
                    "false",
                );
            });

            test(`@Positive Menu should close for ${user.username}`, async () => {
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

            test(`@Positive When user clicks on any 'Add to cart' button, it changes for ${user.username}`, async () => {
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
    });
});
