import { Locator, Page } from "@playwright/test";

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

    async getElementColor(element: Locator) {
        const elementColor = await element?.evaluate((el) => {
            const rgb = window.getComputedStyle(el).color;
            return rgb
                .replace(/^rgb\(|\)$/g, "") // Remove "rgb("
                .split(", ") // Split into individual values
                .map((x) => parseInt(x).toString(16).padStart(2, "0")) // Convert to hex
                .join(""); // Join values together
        });

        return elementColor;
    }
}
