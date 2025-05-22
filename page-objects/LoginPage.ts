import { Page } from "@playwright/test";
import * as users from "../data/credentials.json";
import { CommonFunctions } from "./CommonFunctions";

export class LoginPage extends CommonFunctions {
    readonly page: Page;
    readonly baseURL: string | undefined;

    constructor(page: Page, baseURL: string | undefined) {
        super(page, baseURL);
        this.page = page;
        this.baseURL = baseURL;
    }

    async performLogin() {
        await this.page.goto(`${this.baseURL}`);

        await this.page
            .getByRole("textbox", { name: "username" })
            .fill(users.standard.username);
        await this.page
            .getByRole("textbox", { name: "password" })
            .fill(users.standard.password);
        await this.page.getByRole("button", { name: "login" }).click();
    }
}
