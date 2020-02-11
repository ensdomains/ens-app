const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')
const ENABLED_COLOUR = 'rgb(83, 132, 254)'
const DISABLED_COLOUR = 'rgb(223, 223, 223)'

describe('Migrate resolver and records', () => {
  it('can visit a name with an old resolver and migrate it', () => {
    cy.visit(`${ROOT}/name/abittooawesome2.eth`)
    cy.wait(1000)
    cy.getByText('Migrate').click({ force: true })
    cy.queryByText('migrate', { timeout: 50 }).should('not.exist')
    cy.wait(1000)
    cy.queryByTestId('edit-resolver').should(
      'have.css',
      'background-color',
      ENABLED_COLOUR
    )
  })

  it('can visit a name with an old content resolver and migrate it as swarm contenthash', () => {
    cy.visit(`${ROOT}/name/oldresolver.eth`)
    cy.wait(3000) // this one took a while to render Migrate
    cy.getByText('Migrate').click({ force: true })
    cy.queryByText('migrate', { timeout: 50 }).should('not.exist')
    cy.wait(1000)
    cy.queryByTestId('edit-resolver').should(
      'have.css',
      'background-color',
      ENABLED_COLOUR
    )
    cy.queryByText('bzz://', {
      exact: false
    }).should('exist')
  })

  it('cannot migrate resolver if the parent domain is not migrateed', () => {
    cy.visit(`${ROOT}/name/a1.sub2.testing.eth`)
    cy.wait(1000)
    cy.queryByText('You must first migrate the parent domain ', {
      exact: false
    }).should('exist')
    cy.queryByTestId('edit-resolver').should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
  })

  it('cannot migrate resolver if the domain is not migrateed', () => {
    cy.visit(`${ROOT}/name/sub2.testing.eth`)
    cy.wait(1000)
    cy.queryByText('This name needs to be migrated to the new Registry.', {
      exact: false
    }).should('exist')
    cy.queryByTestId('edit-resolver').should(
      'have.css',
      'background-color',
      DISABLED_COLOUR
    )
  })

  it('can visit a name with a deprecated resolver but cannot add records', () => {
    cy.visit(`${ROOT}/name/abittooawesome3.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.queryByText(
        'You can’t edit or add records until you migrate to the new resolver',
        {
          timeout: 5000,
          exact: false
        }
      ).should('exist')
    })
  })
})
