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

    /* More common functions to be added */
}
