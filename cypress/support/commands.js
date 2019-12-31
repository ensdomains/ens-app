import 'cypress-testing-library/add-commands'
import 'cypress-wait-until'

const ACTIVE_COLOUR = 'rgb(83, 132, 254)'
const DISABLED_CLOUR = 'rgb(223, 223, 223)'

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
  'waitUntilHollowInputResolves',
  function waitUntilHollowInputResolves(buttonText) {
    return cy.waitUntil(
      () => {
        return cy
          .getByText(buttonText)
          .then($el => $el.css('color') === ACTIVE_COLOUR)
      },
      { timeout: 1000, interval: 10 }
    )
  }
)

Cypress.Commands.add(
  'waitUntilTextDoesNotExist',
  function waitUntilTextDoesNotExist(text, options) {
    return cy
      .waitUntil(
        () =>
          cy.queryByText(text, { exact: false, timeout: 1000 }).then($el => {
            Cypress.log($el)
            if ($el === null) {
              return true
            }
            return false
          }),
        { timeout: 10000, interval: 10, ...options }
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

Cypress.Commands.add(
  'waitUntilTextHasBackgroundColor',
  function waitUntilTextHasBackgroundColor(text, color) {
    return cy
      .waitUntil(
        () => {
          return cy.queryByText(text, { exact: false }).then($el => {
            return $el.css('background-color') === color
          })
        },
        { timeout: 1000, interval: 100 }
      )
      .then(() => {
        cy.queryByText(text, { exact: false, timeout: 1000 }).should(
          'have.css',
          'background-color',
          color
        )
      })
  }
)
