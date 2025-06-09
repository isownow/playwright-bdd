import { test as base } from "../tests/fixtures";
import { CartPage } from "../page-objects/CartPage";
import users from "../data/credentials.json";
import * as allProducts from "../constants/products.json";
import { InventoryPage } from "../page-objects/InventoryPage";

const products = [allProducts.products[0], allProducts.products[1]];

// This fixture depends on login fixture and initializes the required object/s.
export const test = base.extend<{
    cart: CartPage;
    inventory: InventoryPage;
}>({
    cart: async ({ page, baseURL, login }, use) => {
        if (!login) {
            throw new Error("Login fixture missing.");
        }

        const cart = new CartPage(page, baseURL);
        await use(cart);
    },
    inventory: async ({ page, baseURL }, use) => {
        const inventory = new InventoryPage(page, baseURL);
        await use(inventory);
    },
});

users.forEach((user) => {
    test.describe.parallel(`Tests for ${user.username}`, () => {
        test.use({ user });

        test("@Positive Remove all products from the cart", async ({
            cart,
            inventory,
        }) => {
            // Add products to the cart and go to cart page
            await cart.cartPagePrereq(cart, inventory, products);

            // Remove all products from the cart
            await cart.clickButtonOnMultipleProducts(products);

            // Validate whether the cart is empty
            await cart.validateEmptyCart();
        });
    });
});
