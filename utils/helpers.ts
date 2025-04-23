export const verifyAZOrder = (itemNames: string[]): boolean =>
    itemNames.length > 0 &&
    [...itemNames].sort((a, b) => a.localeCompare(b)).join() ===
        itemNames.join();

export const verifyZAOrder = (itemNames: string[]): boolean =>
    itemNames.length > 0 &&
    [...itemNames].sort((a, b) => b.localeCompare(a)).join() ===
        itemNames.join();

export const verifyLowToHigh = (itemPrices: string[]): boolean =>
    itemPrices.length > 0 &&
    [...itemPrices]
        .map((price) => parseFloat(price.replace("$", ""))) // Convert to numeric prices
        .sort((a, b) => a - b) // Sort in ascending order
        .join() ===
        itemPrices
            .map((price) => parseFloat(price.replace("$", ""))) // Convert original to numeric
            .join();

export const verifyHighToLow = (itemPrices: string[]): boolean =>
    itemPrices.length > 0 &&
    [...itemPrices]
        .map((price) => parseFloat(price.replace("$", ""))) // Convert to numeric prices
        .sort((a, b) => b - a) // Sort in descending order
        .join() ===
        itemPrices
            .map((price) => parseFloat(price.replace("$", ""))) // Convert original to numeric
            .join();
