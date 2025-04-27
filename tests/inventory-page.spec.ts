import test, { expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { InventoryPage } from "../page-objects/InventoryPage";
import { CommonFunctions } from "../page-objects/CommonFunctions";
import * as locators from "../utils/locators.json";

let prodPage: InventoryPage;
let commonFunc: CommonFunctions;

test.beforeEach(async ({ page, baseURL }) => {
    const login = new LoginPage(page, baseURL);
    prodPage = new InventoryPage(page);
    commonFunc = new CommonFunctions(page);

    await login.performLogin();
});

test("Should not have any automatically detectable accessibility issues", async () => {
    const accessibilityScanResults = await prodPage.doAccessibilityScan();

    // Check if there are any issues in the scan
    expect(accessibilityScanResults.violations).toEqual([]);
});

test.describe("Basic button functionality tests on Products page", () => {
    test("@Positive Mouse cursor changes when pointed on menu icon", async () => {
        const cursor = await prodPage.getCursorStyle(
            locators.ProductsPage.openMenuButtonID,
        );

        // Validate whether the mouse cursor changed
        expect(cursor).toEqual("pointer");
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

    /* More tests to be added */
});
