import { test as base } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";

type LoginFixtures = {
    user: { type: string; username: string; password: string };
    login: LoginPage;
};

export const test = base.extend<LoginFixtures>({
    // eslint-disable-next-line no-empty-pattern
    user: async ({}, use) => {
        await use({
            type: "userType",
            username: "defaultUser",
            password: "defaultPass",
        });
    },

    login: async ({ page, baseURL, user }, use) => {
        if (!user) {
            throw new Error(
                "User fixture is missing. Set it using test.use({ user })",
            );
        }

        const login = new LoginPage(
            page,
            baseURL,
            user.username,
            user.password,
        );
        await login.performLogin();
        await use(login);
    },
});
