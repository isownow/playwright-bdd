import test, { expect, Page } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { CommonFunctions } from "../page-objects/CommonFunctions";
import * as locators from "../utils/locators.json";

let commonFunc: CommonFunctions;

const socialHandles = [
    {
        name: "Twitter",
        selector: `[data-test="${locators.ProductsPage.twitterTID}"]`,
        url: "https://x.com/saucelabs",
    },
    {
        name: "Facebook",
        selector: `[data-test="${locators.ProductsPage.facebookTID}"]`,
        url: "https://www.facebook.com/saucelabs",
    },
    {
        name: "LinkedIn",
        selector: `[data-test="${locators.ProductsPage.linkedInTID}"]`,
        url: "https://www.linkedin.com/company/sauce-labs/",
    },
];

test.beforeEach(async ({ page, baseURL }) => {
    const login = new LoginPage(page, baseURL);
    commonFunc = new CommonFunctions(page);

    await login.performLogin();
});

test.describe("Social Media Links Verification", () => {
    for (const handle of socialHandles) {
        test(`@Positive Mouse cursor changes when pointed on ${handle.name} handle`, async () => {
            const cursor = await commonFunc.getCursorStyle(handle.selector);

            // Validate whether the mouse cursor changed
            expect.soft(cursor).toEqual("pointer");
        });
    }

    for (const handle of socialHandles) {
        test(`When clicked on ${handle.name} handle, new tab with expected page opens up`, async ({
            page,
        }) => {
            let newTabPromise: Promise<Page>;

            // Listen for the new tab event and click the button for opening new tab
            await Promise.all([
                (newTabPromise = page.waitForEvent("popup")),
                page.click(handle.selector),
            ]);

            // Capture the new tab
            const newTab = await newTabPromise;

            // Validate that the correct tab is loaded
            expect(newTab.url()).toEqual(handle.url);
        });
    }
});
