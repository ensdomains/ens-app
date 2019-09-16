import 'cypress-testing-library/add-commands'
import 'cypress-wait-until'

Cypress.Commands.add('waitUntilInputResolves', function waitUntilInputResolves(
  buttonText
) {
  return cy.waitUntil(
    () => {
      return cy
        .getByText(buttonText)
        .then($el => $el.css('background-color') === ACTIVE_COLOUR)
    },
    { timeout: 1000, interval: 10 }
  )
})

Cypress.Commands.add(
  'waitUntilTextDoesNotExist',
  function waitUntilTextDoesNotExist(text) {
    return cy
      .waitUntil(() =>
        cy.queryByText(text, { exact: false, timeout: 1000 }).then($el => {
          if ($el === null) {
            return true
          }
          return false
        })
      )
      .then(() => {
        cy.queryByText(text, { exact: false, timeout: 1000 }).should(
          'not.exist'
        )
      })
  }
)

Cypress.Commands.add(
  'waitUntilTestIdDoesNotExist',
  function waitUntilTestIdDoesNotExist(testId) {
    return cy
      .waitUntil(
        () =>
          cy
            .queryByTestId(testId, { exact: false, timeout: 1000 })
            .then($el => {
              if ($el === null) {
                return true
              }
              return false
            }),
        { timeout: 2000, interval: 10 }
      )
      .then(() => {
        cy.queryByTestId(testId, { exact: false, timeout: 1000 }).should(
          'not.exist'
        )
      })
  }
)
