import test, { expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import * as locators from "../utils/locators.json";
import users from "../data/credentials.json";
import { CommonFunctions } from "../page-objects/CommonFunctions";

let login: LoginPage;
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

test.describe.parallel("Testing common elements across pages", () => {
    users.forEach((user) => {
        test.beforeEach(async ({ page, baseURL }) => {
            login = new LoginPage(page, baseURL, user.username, user.password);
            commonFunc = new CommonFunctions(page, baseURL);

            await login.performLogin();
        });

        test.describe("Social Media Links Verification", () => {
            for (const handle of socialHandles) {
                test(`@Positive Mouse cursor changes when pointed on ${handle.name} handle for ${user.username}`, async () => {
                    const cursor = await commonFunc.getCursorStyle(
                        handle.selector,
                    );

                    // Validate whether the mouse cursor changed
                    expect.soft(cursor).toEqual("pointer");
                });
            }

            for (const handle of socialHandles) {
                test(`@Positive When clicked on ${handle.name} handle, new tab with expected page opens up for ${user.username}`, async () => {
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
