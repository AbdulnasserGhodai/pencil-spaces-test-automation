# Pencil Spaces E2E Tests

Cypress end-to-end (E2E) tests for the Pencil Spaces assignment, using the **Cypress Cucumber Preprocessor** to run Cucumber-style tests with Gherkin syntax. 

## Project Setup

### Prerequisites

- **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
- **npm**: Node Package Manager (npm) should be installed automatically with Node.js.
- You have pencil spaces account, set your email and password in cypress.config.ts under env:
```json
env: {
    EMAIL: "your email",
    PASSWORD: "your password",
  },
```
#### Important Note: 
to run the test in correct way you need to have an empty space with name "My First Space" with one empty board inside, the automation does not do it to avoid unwanted modifications in your account's data.

### Installing Dependencies

Clone the repository and install the dependencies by running the following command in your project directory:

```bash
npm install
```

### Running the tests

To open cypress UI and run the test with it:

```bash
npm run test
```

To run all the tests in headless mode

```bash
npm run test:headless
```

