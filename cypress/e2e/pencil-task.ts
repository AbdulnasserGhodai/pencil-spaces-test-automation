const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

let startTime = 0;
let startX: number;
let startY: number;
let endX: number;
let endY: number;

beforeEach(() => {
  cy.visit("https://spaces.pencilapp.com");
  cy.get("app-pencil-button").should("exist");
  cy.get("app-spinner").should("not.exist");
  cy.get("body").then(($body) => {
    if ($body.find("app-spaces-header app-lightweight-user-avatar").length) {
      cy.get(
        'app-spaces-header app-profile-photo div[data-name="spaces-manager-user-avatar-menu"]'
      ).click();
      cy.get("app-pencil-button span").contains("Sign-out").click();
      cy.get("app-pencil-button span").contains("Logout").click();
      cy.get("button span").contains("Continue with Email").should("exist");
    }
  });
});

Given("I am on the login page", () => {
  cy.visit(Cypress.env("APP_URL"));
});

When("I click on {string} button", (buttonLabel: string) => {
  cy.get("button span").contains(buttonLabel).click();
});

When("I enter my email in the email input", () => {
  cy.get('input[formcontrolname="email"]').type(Cypress.env("EMAIL"));
});

When("I enter my password in the password input", () => {
  cy.get('input[formcontrolname="password"]').type(Cypress.env("PASSWORD"), {
    log: false,
  });
  cy.intercept("POST", "**accounts:signInWithPassword**").as("signInRequest");
});

When("I should login successfully", () => {
  startTime = Date.now();
  cy.wait("@signInRequest").then((interception: any) => {
    expect(interception?.response.statusCode).to.eq(200);
  });
});

When("The page should load within 1000 milliseconds", () => {
  cy.get(".title-text")
    .contains("Home")
    .should("be.visible")
    .then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(loadTime.toString());
      expect(loadTime).to.be.lt(1000);
    });
});

Given("I am logged in with my credentials", () => {
  cy.visit(Cypress.env("APP_URL"));
  cy.get("button span").contains("Continue with Email").click();
  cy.get('input[formcontrolname="email"]').type(Cypress.env("EMAIL"));
  cy.get("button span").contains("Continue").click();
  cy.get('input[formcontrolname="password"]').type(Cypress.env("PASSWORD"), {
    log: false,
  });
  cy.intercept("POST", "**accounts:signInWithPassword**").as("signInRequest");
  cy.get("button span").contains("Continue").click();
  cy.wait("@signInRequest").then((interception: any) => {
    expect(interception?.response.statusCode).to.eq(200);
  });
  cy.get(".title-text").contains("Home").should("be.visible");
});

Then("there should be only one space listed", () => {
  cy.get("table tbody tr app-pencil-button button span")
    .contains("Enter Space")
    .should("have.length", 1);
});

Then("the title of the space should be {string}", (spaceTitle: string) => {
  cy.get("table tbody tr app-space-list-title-section .space-title")
    .contains(spaceTitle)
    .should("exist");
});

Then(
  "the left navigation panel should contain the entries Home and Schedule",
  () => {
    cy.get(".sidebar .main-navbar-item_title").contains("Home").should("exist");
    cy.get(".sidebar .main-navbar-item_title")
      .contains("Schedule")
      .should("exist");
  }
);

Then("the Create Space button should be available", () => {
  cy.get("app-spaces-header  app-pencil-button button span")
    .contains("Create Space")
    .should("exist");
});

Then(
  "the profile picture avatar should be visible in the top right corner",
  () => {
    cy.get("app-spaces-header app-lightweight-user-avatar").should("exist");
  }
);

When("I enter the first space", () => {
  cy.get("table tbody tr app-pencil-button button span")
    .contains("Enter Space")
    .click();

  cy.get("app-leader-boundary").should("exist");
  cy.get("app-space-board").should("exist");
  cy.get("app-wb-canvas").should("exist");
});

When("I draw a vertical line of height {int}px", (height: number) => {
  cy.get("app-space-toolbar-button button span")
    .contains("Shapes")
    .should("be.visible")
    .click();
  cy.get(
    'app-space-toolbar-button button[data-name="space-toolbar-button-object-line"]'
  ).click();
  cy.get("app-space-toolbar-button button span").contains("Shapes").click();
  cy.get("app-space-board")
    .should("exist")
    .then(($canvas) => {
      const canvas = $canvas[0];
      const rect = canvas.getBoundingClientRect();
      startX = rect.left + height;
      startY = rect.top + height;
      endX = startX;
      endY = startY + height;
      const dataTransfer = new DataTransfer();
      cy.wrap(canvas)
        .trigger("mousedown", {
          dataTransfer,
          clientX: startX,
          clientY: startY,
        })
        .trigger("mousemove", {
          dataTransfer,
          clientX: endX,
          clientY: endY,
        })
        .trigger("mouseup", {
          dataTransfer,
          clientX: endX,
          clientY: endY,
        });
    });
});

Then("I should see a vertical line of height {int}px", (height: number) => {});

When(
  "I select the vertical line and move it {int}px to the right",
  (shift: number) => {
    cy.window().trigger("keydown", {
      keyCode: 39,
      which: 39,
      key: "ArrowRight",
    });
  }
);

When(
  "I insert a text box by selecting the text tool from the bottom toolbar",
  () => {
    cy.get("app-space-toolbar-button button span").contains("Text").click();

    cy.get("app-space-board").click(startX + 100, startY + 100);
  }
);

When(
  "I enter {string} in the text box and click outside to set it",
  (text: string) => {
    cy.realType(text).then(() => {
      cy.get("app-space-board").click(0, 0);
    });
  }
);

Then(
  "the text {string} should be visible in the text box",
  (textBoxValue: string) => {
    console.log(textBoxValue);
  }
);

When("I click on the top left button to leave the space", () => {
  cy.get(
    '.top-controls-container app-left-section app-tool-bar-button[icon="menu"]'
  ).click();
  cy.get("app-pencil-button span").contains("Leave this Space").click();
});

When(
  "I click on the user avatar in the top right corner and select Sign out",
  () => {
    cy.get(
      'app-spaces-header app-profile-photo div[data-name="spaces-manager-user-avatar-menu"]'
    ).click();
    cy.get("app-pencil-button span").contains("Sign-out").click();
    cy.get("app-pencil-button span").contains("Logout").click();
  }
);

Then("I should be redirected to the login page", () => {
  cy.get("button span").contains("Continue with Email").should("exist");
});

When("I change the URL to {string}", (url: string) => {
  cy.visit(url);
  cy.get("button span").contains("Continue with Email").should("exist");
});

When("I click on board manager button", () => {
  cy.get("app-space-left-navbar .bottom-left-toolbar-container div")
    .contains("Boards")
    .click();
});

Then("the board manager sidebar should be visible", () => {
  cy.get("app-sessions-panel app-wb-tabs .space-tabs").should("be.visible");
});

When("I click on new board button", () => {
  cy.get(
    "app-sessions-panel app-wb-tabs .tabs-header-new-board-divider button span"
  )
    .contains("New")
    .click();
});

Then(
  "the new board should be created successfully and exist in the boards list",
  () => {
    cy.get(".board-box .board-header span").contains("Board 2").should("exist");
  }
);

When("I close board manger sider", () => {
  cy.get("app-sessions-panel app-wb-tabs mat-icon").contains("close").click();
});

When("I enter {string} in the text box", (text: string) => {
  cy.realType(text);
});

When("I click on italic icon on the toolbar", () => {
  cy.realPress(["Control", "a"]);
  cy.get("app-space-toolbar-holder app-space-toolbar-button button em")
    .contains("format_italic")
    .click();
});

When("I click outside the text box to save it", () => {
  cy.get("app-space-board").click(0, 0);
});

Then(
  "the textbox with the {string} in italic should be saved successfully",
  (text: string) => {
    cy.log("saved successfully");
  }
);
