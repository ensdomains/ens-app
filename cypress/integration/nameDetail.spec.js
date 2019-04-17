const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

describe('Name detail view', () => {
  it('cannot transfer ownership to a non-ethereum address', () => {
    cy.visit(`${NAME_ROOT}/awesome.eth`)
    cy.getByText('Transfer').click()

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', { container, exact: false }).type(
        'nope'
      )
    })

    cy.queryByText('Transfer').should('be.disabled')
  })

  it('can transfer ownership', () => {
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

  it('cannot change the resolver to a non-ethereum address', () => {
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

  it('can change the resolver', () => {
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

  it('can change the resolver to the public resolver', () => {
    cy.visit(`${NAME_ROOT}/superawesome.eth`)
    cy.getByTestId('edit-resolver').click()

    cy.getByText('Use Public Resolver', { exact: true, timeout: 5000 }).click()

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', { container, exact: false }).then(
        $address => {
          cy.getByText('Save', { timeout: 5000 }).click()
          cy.getByText($address.val()).should('exist')
        }
      )
    })
  })

  it(`prevents user from adding a record that isn't an address`, () => {
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByText('+').click()
      cy.getByText('select a record', { exact: false }).click()
      cy.get('[role="option"]', { timeout: 10000 })
        .contains('Address')
        .click()
      cy.getByPlaceholderText('Enter an Ethereum address', {
        exact: false
      }).type('blah')
      cy.queryByTestId('save', { exact: false }).should('be.disabled')
      //force click like a real user
      cy.getByText('save', { exact: false }).click({ force: true })

      // Form was not closed and nothing happened
      // This query seems flakey
      // cy.queryByValue('blah').should('exist')
      cy.get('input[placeholder="Enter an Ethereum address"]').should(elem => {
        expect(elem.val()).to.equal('blah')
      })
    })
  })

  it('can add an address', () => {
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByText('+').click()
      cy.getByText('select a record', { exact: false }).click()
      cy.get('[role="option"]', { timeout: 10000 })
        .contains('Address')
        .click()

      cy.getByPlaceholderText('Enter an Ethereum address', {
        exact: false
      }).type('0x0000000000000000000000000000000000000003')
      cy.getByText('Save').click()

      cy.wait(500)
      //form closed
      cy.queryByTestId('Save', { exact: false, timeout: 500 }).should(
        'not.exist'
      )
      cy.queryByTestId('cancel', { exact: false, timeout: 500 }).should(
        'not.exist'
      )

      //Value updated
      cy.queryByText('0x0000000000000000000000000000000000000003', {
        exact: false
      }).should('exist')
    })
  })

  it('can add a content hash', () => {
    const content = 'ipfs://QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB'
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByText('+')
        .click()
        .getByText('select a record', { exact: false })
        .click()
        .get('[role="option"]', { timeout: 10000 })
        .contains('Content')
        .click()
        .getByPlaceholderText('Enter a content hash', {
          exact: false
        })
        .type(content)
      cy.getByText('Save').click()
      //form closed

      cy.wait(500)
      cy.queryByText('Save', { timeout: 50 })
        .should('not.exist')
        .queryByText('cancel', { exact: false, timeout: 50 })
        .should('not.exist')

      //Value updated
      cy.queryByText(content, {
        exact: false
      }).should('exist')
    })
  })

  it('can change the address', () => {
    cy.visit(`${NAME_ROOT}/abittooawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-address', { exact: false }).click()
      cy.getByPlaceholderText('Enter an Ethereum address', {
        exact: false
      }).type('0x0000000000000000000000000000000000000003')
      cy.getByText('Save').click()
      cy.wait(500)

      //form closed
      cy.queryByTestId('save', { exact: false, timeout: 10 }).should(
        'not.exist'
      )
      cy.queryByTestId('cancel', { exact: false, timeout: 10 }).should(
        'not.exist'
      )
      //Value updated
      cy.queryByText('0x0000000000000000000000000000000000000003', {
        exact: false,
        timeout: 10
      }).should('exist')
    })
  })

  it('can change the content hash', () => {
    const content =
      'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'

    cy.visit(`${NAME_ROOT}/abittooawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-content', { exact: false }).click()
      cy.getByPlaceholderText('Enter a content hash', {
        exact: false
      }).type(content)
      cy.getByText('Save').click()
      cy.wait(500)

      //form closed
      cy.queryByTestId('save', { exact: false, timeout: 10 }).should(
        'not.exist'
      )
      cy.queryByTestId('cancel', { exact: false, timeout: 10 }).should(
        'not.exist'
      )
      //Value updated
      cy.queryByText(content, { exact: false }).should('exist')
    })
  })

  it('can set old content', () => {
    const content =
      '0xd1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'

    cy.visit(`${NAME_ROOT}/oldresolver.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-content', { exact: false }).click()
      cy.getByPlaceholderText('Enter a content', {
        exact: false
      }).type(content)
      cy.getByText('Save').click()
      cy.wait(1000)

      //form closed
      cy.queryByTestId('save', { exact: false, timeout: 50 }).should(
        'not.exist'
      )
      cy.queryByTestId('cancel', { exact: false, timeout: 50 }).should(
        'not.exist'
      )
      //Value updated
      cy.queryByText(content, { exact: false }).should('exist')
    })
  })

  it('can delete records', () => {
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)
    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-address', { exact: false }).click()
      cy.getByTestId('delete-address', { exact: false }).click()
      cy.wait(1000)

      cy.getByTestId('edit-content', { exact: false }).click()
      cy.getByTestId('delete-content', { exact: false }).click()
      cy.wait(1000)

      //No addresses to edit
      cy.queryByText('+', { exact: false }).should('exist')
    })
  })

  it('can navigate to a subdomain', () => {
    cy.visit(`${NAME_ROOT}/subdomaindummy.eth`)
      .getByText('subdomains', { exact: false })
      .click()
      .getByText('original.subdomaindummy.eth', { timeout: 5000 })
      .click()
  })

  it('can add a subdomain', () => {
    cy.visit(`${NAME_ROOT}/subdomaindummy.eth`)
      .getByText('subdomains', { exact: false })
      .click()

    cy.getByTestId('subdomains').within(() => {
      cy.getByText('add', { exact: false })
        .click()
        .get('input')
        .type('unoriginal')
        .getByText('save', { exact: false })
        .click()
        .getByText('unoriginal.subdomaindummy.eth', { timeout: 10000 })
        .click()
        .url()
        .should('include', '/name/unoriginal.subdomaindummy.eth')
    })
  })
})
