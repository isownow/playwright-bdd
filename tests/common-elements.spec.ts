import { expect } from "@playwright/test";
import { test as base } from "../tests/fixtures";
import * as locators from "../utils/locators.json";
import users from "../data/credentials.json";
import { CommonFunctions } from "../page-objects/CommonFunctions";

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

// This fixture depends on login fixture and initializes the commonFunc object.
export const test = base.extend<{ commonFunc: CommonFunctions }>({
    commonFunc: async ({ page, baseURL, login }, use) => {
        if (!login) {
            throw new Error("Login fixture missing.");
        }

        const commonFunc = new CommonFunctions(page, baseURL);
        await use(commonFunc);
    },
});

users.forEach((user) => {
    test.describe.parallel(`Tests for ${user.username}`, () => {
        test.use({ user });

        test.describe("Social Media Links Verification", () => {
            for (const handle of socialHandles) {
                test(`@Positive Mouse cursor changes when pointed on ${handle.name} handle`, async ({
                    commonFunc,
                }) => {
                    const cursor = await commonFunc.getCursorStyle(
                        handle.selector,
                    );

                    // Validate whether the mouse cursor changed
                    expect.soft(cursor).toEqual("pointer");
                });
            }

            for (const handle of socialHandles) {
                test(`@Positive When clicked on ${handle.name} handle, new tab with expected page opens up`, async ({
                    commonFunc,
                }) => {
                    // Listen for the new tab event and click the button for opening new tab
                    const newTab = await commonFunc.clickAndNavigateToNewTab(
                        handle.selector,
                    );

                    // Validate that the correct tab is loaded
                    expect(newTab.url()).toEqual(handle.url);
                });
            }
        });
    });
});
