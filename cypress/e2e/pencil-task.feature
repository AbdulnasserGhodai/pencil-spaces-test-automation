Feature: User interactions with PencilApp

  Scenario: Login and page load performance
    Given I am on the login page
    When I click on "Continue with Email" button
    And I enter my email in the email input
    And I click on "Continue" button
    And I enter my password in the password input
    And I click on "Continue" button
    Then I should login successfully
    And The page should load within 1000 milliseconds

  Scenario: Validate space list page content
    Given I am logged in with my credentials
    Then there should be only one space listed
    And the title of the space should be "My First Space"
    And the left navigation panel should contain the entries Home and Schedule
    And the Create Space button should be available
    And the profile picture avatar should be visible in the top right corner

  Scenario: Interact with the space
    Given I am logged in with my credentials
    When I enter the first space
    And I draw a vertical line of height 50px
    Then I should see a vertical line of height 50px
    When I select the vertical line and move it 10px to the right
    And I insert a text box by selecting the text tool from the bottom toolbar
    And I enter "This is a test" in the text box and click outside to set it
    Then the text "This is a test" should be visible in the text box

  Scenario: Leave the space and sign out
    Given I am logged in with my credentials
    When I enter the first space
    When I click on the top left button to leave the space
    And I click on the user avatar in the top right corner and select Sign out
    Then I should be redirected to the login page

  Scenario: Verify redirection to login page from another URL
    When I change the URL to "my.pencilapp.com"
    Then I should be redirected to the login page

  Scenario: Interact with various boards on the space (bonus)
    Given I am logged in with my credentials
    When I enter the first space
    And I click on board manager button
    Then the board manager sidebar should be visible
    When I click on new board button
    Then the new board should be created successfully and exist in the boards list
    When I close board manger sider
    And I insert a text box by selecting the text tool from the bottom toolbar
    And I enter "test" in the text box
    And I click on italic icon on the toolbar
    And I click outside the text box to save it
    Then the textbox with the "test" in italic should be saved successfully
    
