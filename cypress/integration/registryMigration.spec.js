const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

const DISABLED_COLOUR = 'rgb(223, 223, 223)'
const ENABLED_COLOUR = 'rgb(83, 132, 254)'

describe('Migrate a subdomain to new registry', () => {
  it('can visit an unmigrated name and migrate it', () => {
    cy.visit(`${ROOT}/name/sub1.testing.eth`)
    cy.getByTestId('registry-migrate-button-enabled', { timeout: 10000 }).click(
      { force: true }
    )
    cy.wait(1000)
    cy.queryByTestId('edit-controller').should(
      'have.css',
      'background-color',
      ENABLED_COLOUR
    )
    cy.queryByTestId('registry-migrate-button-enabled', {
      timeout: 1000
    }).should('not.exist')
  })

  it('can visit an unmigrated name and cannot migrate because parent is unmigrated', () => {
    cy.visit(`${ROOT}/name/a1.sub2.testing.eth`)
    cy.queryByText('You must first migrate the parent domain', {
      timeout: 5000,
      exact: false
    }).should('exist')

    cy.queryByText('Migrate').should('have.css', 'color', DISABLED_COLOUR)

    cy.queryByText('Migrate').should('have.css', 'color', DISABLED_COLOUR)
  })

  it('can visit an unmigrated name and cannot set the controller', () => {
    cy.visit(`${ROOT}/name/sub2.testing.eth`)
    cy.queryByText('You must first migrate the parent domain', {
      timeout: 5000,
      exact: false
    }).should('exist')

    cy.queryByText('Migrate').should('have.css', 'color', DISABLED_COLOUR)

    cy.queryByTestId('edit-controller').should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
  })
  it('cannot migrate own domain because I do not own parent domain', () => {
    cy.visit(`${ROOT}/name/sub1.otherowner.eth`)
    cy.queryByTestId('owner-type', { exact: false }).should(
      'have.text',
      'Controller'
    )
    cy.queryByText('This name needs to be migrated to the new Registry.', {
      timeout: 5000,
      exact: false
    }).should('exist')

    cy.queryByText('Migrate').should('have.css', 'color', DISABLED_COLOUR)

    cy.queryByTestId('edit-controller').should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
  })

  it('cannot migrate other domain because I do not own parent domain', () => {
    cy.visit(`${ROOT}/name/sub2.otherowner.eth`)
    cy.queryByTestId('owner-type', { exact: false }).should('not.exist')
    cy.queryByText('This name needs to be migrated to the new Registry.', {
      timeout: 10000,
      exact: false
    }).should('exist')

    cy.queryByText('Migrate').should('have.css', 'color', DISABLED_COLOUR)

    cy.queryByTestId('edit-controller').should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
  })
  it('can migrate other domain because I own parent domain', () => {
    cy.visit(`${ROOT}/name/sub4.testing.eth`)
    cy.queryByTestId('owner-type', { exact: false }).should('not.exist')
    cy.queryByText('This name needs to be migrated to the new Registry.', {
      timeout: 10000,
      exact: false
    }).should('exist')
    cy.queryByTestId('registry-migrate-button-enabled', {
      timeout: 1000
    }).should('exist')
  })
})
