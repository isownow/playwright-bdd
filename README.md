# [Playwright](https://playwright.dev/) test automation using [Swag Labs](https://www.saucedemo.com/)

This project is designed for practicing the Playwright testing framework with TypeScript, using the Swag Labs sample e-commerce website.

## Getting Started
### Prerequisites

- **[System requirements](https://playwright.dev/docs/intro#system-requirements)** from official Playwright website
- **Git**: Version control system (for clonning the repo)

### Setting up the project
___
#### Clone this Git repository or download the zip file
```

git clone https://github.com/isownow/playwright-swaglabs.git

```
#### Navigate to the project directory and install dependencies
```

cd playwright-swaglabs && npm install

```
#### Install Playwright browsers
```

npx playwright install

```

## Execute Tests
#### The following command will run the tests on all the browsers (Chromium, Firefox, Webkit):
```

npx playwright test

```
#### To run the tests on any specific browser, mention the browser name as follows:
```

npx playwright test --project=chromium

```
