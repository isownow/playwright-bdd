import { Page } from "@playwright/test";
import { CommonFunctions } from "./CommonFunctions";

export class LoginPage extends CommonFunctions {
    readonly page: Page;
    readonly baseURL: string | undefined;
    readonly username: string;
    readonly password: string;

    constructor(
        page: Page,
        baseURL: string | undefined,
        username: string,
        password: string,
    ) {
        super(page, baseURL);
        this.page = page;
        this.baseURL = baseURL;
        this.username = username;
        this.password = password;
    }

    async performLogin() {
        await this.page.goto(`${this.baseURL}`);

        await this.page
            .getByRole("textbox", { name: "username" })
            .fill(this.username);
        await this.page
            .getByRole("textbox", { name: "password" })
            .fill(this.password);
        await this.page.getByRole("button", { name: "login" }).click();
    }
}
