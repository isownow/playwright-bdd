import { Page } from "@playwright/test";

export class CommonFunctions {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickButtonByName(buttonName: string) {
        await this.page
            .getByRole("button", {
                name: buttonName,
            })
            .click();
    }

    async getCursorStyle(selector: string) {
        const cursor = await this.page.$eval(selector, (element) => {
            return window.getComputedStyle(element).cursor;
        });

        return cursor;
    }

    /* More common functions to be added */
}
