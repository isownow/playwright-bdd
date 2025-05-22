import { Page } from "@playwright/test";
import { CommonFunctions } from "./CommonFunctions";

export class CheckoutOverviewPage extends CommonFunctions {
    readonly page: Page;

    constructor(page: Page, baseURL: string | undefined) {
        super(page, baseURL);
        this.page = page;
    }

    async getDisplayedAmount(locator: string) {
        const displayedAmount = await this.page
            .getByTestId(locator)
            .textContent();
        const displayedAmountFormatted = Number(displayedAmount?.split("$")[1]);

        return displayedAmountFormatted;
    }
}
