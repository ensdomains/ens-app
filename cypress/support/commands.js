import 'cypress-testing-library/add-commands'
import 'cypress-wait-until'

const ACTIVE_COLOUR = 'rgb(83, 132, 254)'
const DISABLED_COLOUR = 'rgb(223, 223, 223)'

Cypress.Commands.add('waitUntilInputResolves', function waitUntilInputResolves(
  buttonTextOrOptions
) {
  if (typeof buttonTextOrOptions === 'object') {
    return cy.waitUntil(
      () => {
        return cy
          .getByTestId(buttonTextOrOptions.value)
          .then($el => $el.css('background-color') === ACTIVE_COLOUR)
      },
      { timeout: 5000, interval: 10 }
    )
  } else {
    return cy.waitUntil(
      () => {
        return cy
          .getByText(buttonTextOrOptions)
          .then($el => $el.css('background-color') === ACTIVE_COLOUR)
      },
      { timeout: 5000, interval: 10 }
    )
  }
})

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
  'waitUntilTextDoesExist',
  function waitUntilTextDoesNotExist(text, options) {
    return cy
      .waitUntil(() => cy.queryByText(text, { exact: false, timeout: 1000 }), {
        timeout: 10000,
        interval: 10,
        ...options
      })
      .then(() => {
        cy.queryByText(text, { exact: false, timeout: 1000 }).should('exist')
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
