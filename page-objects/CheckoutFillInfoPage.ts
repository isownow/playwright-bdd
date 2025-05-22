import { Page } from "@playwright/test";
import { CommonFunctions } from "./CommonFunctions";

export class CheckoutFillInfoPage extends CommonFunctions {
    readonly page: Page;

    constructor(page: Page, baseURL: string | undefined) {
        super(page, baseURL);
        this.page = page;
    }
}
