const ROOT = 'http://localhost:3000'
const NAME_ROOT = `${ROOT}/name`

xdescribe('Visit a domain', () => {
  //Visit a domain, check the owner, resolver, address, content exists
  it('Visits the Kitchen Sink', () => {
    cy.visit(ROOT)
    cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    cy.get('button')
      .contains('Search')
      .click()

    cy.queryByText('owner')

    //TODO expect owner, resolver, address, content
  })
})

describe('Name detail view', () => {
  //Visit a domain

  xit('can transfer ownership', () => {
    cy.visit(`${NAME_ROOT}/awesome.eth`)
    cy.getByText('Transfer').click()

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', { container, exact: false }).type(
        '0x0000000000000000000000000000000000000001'
      )
    })

    cy.getByText('Transfer').click()
    cy.getByText('Confirm').click()

    cy.getByText('0x0000000000000000000000000000000000000001').should('exist')
  })

  xit('can change the resolver', () => {
    cy.visit(`${NAME_ROOT}/superawesome.eth`)
    cy.getByTestId('edit-resolver').click()

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', { container, exact: false }).type(
        '0x0000000000000000000000000000000000000002'
      )
    })

    cy.getByText('Save').click()

    cy.getByText('0x0000000000000000000000000000000000000002').should('exist')
  })

  xit('can change the resolver to the public resolver', () => {
    cy.visit(`${NAME_ROOT}/superawesome.eth`)
    cy.getByTestId('edit-resolver').click()

    cy.getByText('Public Resolver', { exact: false }).click()

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', { container, exact: false }).then(
        $address => {
          cy.getByText('Save').click()
          cy.getByText($address.val()).should('exist')
        }
      )
    })
  })

  it('can add use add record to add an address', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can add use add record to add a content hash', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can change the address', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can change the content hash', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })
})

describe('Search results', () => {
  //Visit a domain

  it('can search for a domain', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can search for a subdomain with fewer letters, but shows an error for TLDs', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })

  it('can search for a subdomain with fewer letters, but shows an error for TLDs', () => {
    // cy.visit(ROOT)
    // cy.getByPlaceholderText('Search', { exact: false }).type('resolver.eth')
    // cy.get('button')
    //   .contains('Search')
    //   .click()
  })
})
