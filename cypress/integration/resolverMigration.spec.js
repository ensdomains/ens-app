const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')
const ENABLED_COLOUR = 'rgb(83, 132, 254)'
const DISABLED_COLOUR = 'rgb(223, 223, 223)'

describe('Migrate resolver and records', () => {
  it('can visit a name with an old content resolver and migrate it as swarm contenthash', () => {
    cy.visit(`${ROOT}/name/oldresolver.eth`)
    cy.getByText('Migrate', { timeout: 10000 }).click({ force: true })
    cy.queryByText('migrate', { timeout: 10000 }).should('not.exist')
  })

  it('cannot migrate resolver if the parent domain is not migrateed', () => {
    cy.visit(`${ROOT}/name/a1.sub2.testing.eth/details`)
    cy.queryByText('You must first migrate the parent domain ', {
      timeout: 5000,
      exact: false
    }).should('exist')
    cy.queryByTestId('edit-resolver').should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
  })

  it('cannot migrate resolver if the domain is not migrateed', () => {
    cy.visit(`${ROOT}/name/sub2.testing.eth/details`)
    cy.queryByText('This name needs to be migrated to the new Registry.', {
      exact: false,
      timeout: 5000
    }).should('exist')
    cy.queryByTestId('edit-resolver').should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
  })

  it('can visit a name with a deprecated resolver but cannot add records', () => {
    cy.visit(`${ROOT}/name/abittooawesome3.eth/details`)

    cy.queryByText(
      'You can’t edit or add records until you migrate to the new resolver',
      {
        timeout: 5000,
        exact: false
      }
    ).should('exist')
  })
})
