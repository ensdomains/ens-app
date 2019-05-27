const TEST = Cypress.env('TEST')

const RESOLUTION = {
  width: 1440,
  height: 1280
}

const NAME = 'whoisens.eth'
const ADDRESS = '0x5b854fc85bb7b2b3bdb78bd8dd85832121bd082c'

describe('Address', () => {
  before(() => {
    cy.visit(TEST)
  })

  beforeEach(() => {
    cy.viewport(RESOLUTION.width, RESOLUTION.height)
  })

  it('test #1 default input', () => {
    const firstEl = '.cmp-address:first'
    const firstElInput = '.cmp-address:first input'

    cy.get('.cmp-address:first .search-icon').should('be.visible')

    cy.get(firstElInput).should(
      'have.attr',
      'placeholder',
      'Enter Ethereum name or address'
    )
    cy.get(firstEl).should('not.have.class', 'error')

    cy.get(firstElInput)
      .type(NAME.slice(0, -1))
      .should('have.value', NAME.slice(0, -1))

    cy.get(firstEl).should('have.class', 'error')
    cy.get('.cmp-address:first .error-icon').should('be.visible')

    cy.get(firstElInput)
      .type(NAME.slice(-1))
      .should('have.value', NAME)

    cy.get(firstEl)
      .should('not.have.class', 'error')
      .should('have.class', 'resolved')

    cy.get('.cmp-address:first .blockies').should('be.visible')
    cy.get('.cmp-address:first .info-wrapper .resolved').should('be.visible')
  })

  it('test #2 input without search icon', () => {
    cy.get('.cmp-address:nth(1) .search-icon').should('not.be.visible')
  })

  it('test #3 input without search icon and without blockies', () => {
    cy.get('.cmp-address:nth(2) input')
      .type(NAME)
      .should('have.value', NAME)

    cy.get('.cmp-address:nth(2) .blockies').should('not.be.visible')
  })

  it('test #4 custom placeholder', () => {
    cy.get('.cmp-address:nth(3) input').should(
      'have.attr',
      'placeholder',
      'Test test test'
    )
  })

  it('test #5 check onResolve function with forward and reverse record', () => {
    cy.get('.cmp-address:nth(4) input')
      .type(NAME)
      .should('have.value', NAME)

    cy.get('.resolve-result').should('contain', ADDRESS)
    cy.get('.blockies').should('have.attr', 'style').then((attr) => {
      cy.get('.cmp-address:nth(4) input')
        .clear()
        .type(ADDRESS)
        .should('have.value', ADDRESS)

      cy.get('.resolve-result').should('contain', NAME)

      cy.get('.blockies').should('have.attr', 'style', attr)
    })
  })

  it('test #6 check onResolve', () => {
    cy.get('.cmp-address:nth(5) input')
      .type(NAME.slice(0, -1))
      .should('have.value', NAME.slice(0, -1))

    cy.get('.error-result').should('contain', 'Incorrect address or name')

    cy.get('.cmp-address:nth(5) input')
      .type(NAME.slice(-1))
      .should('have.value', NAME)

    cy.get('.error-result').should('contain', '')
  })
})
