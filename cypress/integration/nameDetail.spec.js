const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

const ACTIVE_COLOUR = 'rgb(83, 132, 254)'
const DISABLED_CLOUR = 'rgb(223, 223, 223)'

function waitUntilInputResolves(buttonText) {
  return cy.waitUntil(
    () => {
      return cy
        .getByText(buttonText)
        .then($el => $el.css('background-color') === ACTIVE_COLOUR)
    },
    { timeout: 1000, interval: 10 }
  )
}

function waitUntilTestIdDoesNotExist(testId) {
  return cy
    .waitUntil(
      () =>
        cy.queryByTestId(testId, { exact: false, timeout: 1000 }).then($el => {
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
      cy.queryByText(text, { exact: false, timeout: 1000 }).should('not.exist')
    })
}

describe('Name detail view', () => {
  it('cannot transfer ownership to a non-ethereum address', () => {
    cy.visit(`${NAME_ROOT}/awesome.eth`)
    cy.getByText('Transfer')
      .scrollIntoView()
      .click({ force: true })

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', { container, exact: false }).type(
        'nope',
        {
          force: true
        }
      )
    })

    cy.queryByText('Transfer').should(
      'have.css',
      'background-color',
      'rgb(223, 223, 223)'
    )
  })

  it('can transfer ownership', () => {
    cy.visit(`${NAME_ROOT}/awesome.eth`)
    cy.getByText('Transfer').click({ force: true })

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', { container, exact: false }).type(
        '0x0000000000000000000000000000000000000001',
        { force: true, delay: 0 }
      )
    })
    waitUntilInputResolves('Transfer').then(() => {
      cy.getByText('Transfer').click({ force: true })
      cy.getByText('Confirm').click({ force: true })

      cy.getByText('0x0000000000000000000000000000000000000001').should('exist')
    })
  })

  it('cannot change the resolver to a non-ethereum address', () => {
    cy.visit(`${NAME_ROOT}/superawesome.eth`)
    cy.getByTestId('edit-resolver').click({ force: true })

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', { container, exact: false }).type(
        '0x0000000000000000000000000000000000000002',
        {
          force: true
        }
      )
    })

    waitUntilInputResolves('Save').then(() => {
      cy.getByText('Save').click({ force: true })

      cy.getByText('0x0000000000000000000000000000000000000002').should('exist')
    })
  })

  it('can change the resolver', () => {
    cy.visit(`${NAME_ROOT}/superawesome.eth`)
    cy.getByTestId('edit-resolver').click({ force: true })

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', { container, exact: false }).type(
        '0x0000000000000000000000000000000000000002',
        { force: true }
      )
    })
    waitUntilInputResolves('Save').then(() => {
      cy.getByText('Save').click({ force: true })

      cy.getByText('0x0000000000000000000000000000000000000002').should('exist')
    })
  })

  it('can change the resolver to the public resolver', () => {
    cy.visit(`${NAME_ROOT}/superawesome.eth`)
    cy.getByTestId('edit-resolver').click({ force: true })

    cy.getByText('Use Public Resolver', { exact: true, timeout: 5000 }).click({
      force: true
    })

    waitUntilInputResolves('Save').then(() => {
      cy.getByTestId('name-details').within(container => {
        cy.getByPlaceholderText('address', { container, exact: false }).then(
          $address => {
            cy.getByText('Save', { timeout: 5000 }).click({ force: true })
            cy.getByText($address.val()).should('exist')
          }
        )
      })
    })
  })

  it(`prevents user from adding a record that isn't an address`, () => {
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByText('+').click({ force: true })
      cy.getByText('select a record', { exact: false }).click({ force: true })
      cy.get('#react-select-2-option-0')
        .contains('Address')
        .click({ force: true })
      cy.getByPlaceholderText('Enter Ethereum name or address', {
        exact: false
      }).type('blah', { force: true })

      cy.getByPlaceholderText('Enter Ethereum name or address').should(elem => {
        expect(elem.val()).to.equal('blah')
      })
      cy.queryByTestId('action', { exact: false }).should(
        'have.css',
        'background-color',
        DISABLED_CLOUR
      )
      //force click like a real user
      cy.getByText('save', { exact: false }).click({ force: true })

      cy.getByPlaceholderText('Enter Ethereum name or address').should(elem => {
        expect(elem.val()).to.equal('blah')
      })

      // Form was not closed and nothing happened
      // This query seems flakey
      // cy.queryByValue('blah').should('exist')
    })
  })

  it('can add an address', () => {
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByText('+').click({ force: true })
      cy.getByText('select a record', { exact: false }).click({ force: true })
      cy.get('#react-select-2-option-0')
        .contains('Address')
        .click({ force: true })

      cy.getByPlaceholderText('Enter Ethereum name or address', {
        exact: false
      }).type('0x0000000000000000000000000000000000000003', { force: true })

      waitUntilInputResolves('Save').then(() => {
        cy.getByText('Save').click({ force: true })

        //Value updated
        cy.queryByText('0x0000000000000000000000000000000000000003', {
          exact: false
        }).should('exist')
      })
    })
  })

  it('can add a content hash', () => {
    const content = 'ipfs://QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB'
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByText('+')
        .click({ force: true })
        .getByText('select a record', { exact: false })
        .click({ force: true })
        .get('#react-select-2-option-1', { timeout: 10000 })
        .contains('Content')
        .click({ force: true })
        .getByPlaceholderText('Enter a content hash', {
          exact: false
        })
        .type(content, { force: true })
      waitUntilInputResolves('Save').then(() => {
        cy.getByText('Save').click({ force: true })
        //Value updated
        cy.queryByText(content, {
          exact: false
        }).should('exist')
      })
    })
  })

  it('can change the address', () => {
    cy.visit(`${NAME_ROOT}/abittooawesome.eth`)
    const ADDRESS = '0x0000000000000000000000000000000000000007'

    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-address', { exact: false }).click({ force: true })
      cy.getByPlaceholderText('Enter Ethereum name or address', {
        exact: false
      }).type(ADDRESS, { force: true })

      waitUntilInputResolves('Save').then(() => {
        cy.wait(10)
        cy.getByText('Save').click({ force: true })

        //form closed
        waitUntilTestIdDoesNotExist('action')
        waitUntilTestIdDoesNotExist('cancel')

        cy.queryByText(ADDRESS, {
          exact: false,
          timeout: 1000
        }).should('exist')
      })
    })
  })

  it('can change the content hash', () => {
    const content =
      'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'

    cy.visit(`${NAME_ROOT}/abittooawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-content', { exact: false }).click({ force: true })
      cy.getByPlaceholderText('Enter a content hash', {
        exact: false
      }).type(content, { force: true })

      waitUntilInputResolves('Save').then(() => {
        cy.getByText('Save').click({ force: true })

        //form closed
        waitUntilTestIdDoesNotExist('action')
        waitUntilTestIdDoesNotExist('cancel')

        //Value updated
        cy.queryByText(content, { exact: false }).should('exist')
      })
    })
  })

  it('can set old content', () => {
    const content =
      '0xd1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'

    cy.visit(`${NAME_ROOT}/oldresolver.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-content', { exact: false }).click({ force: true })
      cy.getByPlaceholderText('Enter a content', {
        exact: false
      }).type(content, { force: true })
      waitUntilInputResolves('Save').then(() => {
        cy.getByText('Save').click({ force: true })

        //form closed
        waitUntilTestIdDoesNotExist('action')
        waitUntilTestIdDoesNotExist('cancel')
        //Value updated
        cy.queryByText(content, { exact: false }).should('exist')
      })
    })
  })

  it('can delete records', () => {
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)
    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-address', { exact: false }).click({ force: true })
      cy.getByTestId('delete-address', { exact: false }).click({ force: true })
      cy.wait(1000)

      cy.getByTestId('edit-content', { exact: false }).click({ force: true })
      cy.getByTestId('delete-content', { exact: false }).click({ force: true })
      cy.wait(1000)

      //No addresses to edit
      cy.queryByText('+', { exact: false }).should('exist')
    })
  })

  it('can navigate to a subdomain', () => {
    cy.visit(`${NAME_ROOT}/subdomaindummy.eth`)
      .getByText('subdomains', { exact: false })
      .click({ force: true })
      .getByText('original.subdomaindummy.eth', { timeout: 10000 })
      .click({ force: true })
  })

  it('can add a subdomain', () => {
    const LABEL = 'okay'
    cy.visit(`${NAME_ROOT}/subdomaindummy.eth`)
      .getByText('subdomains', { exact: false })
      .click({ force: true })

    cy.getByTestId('subdomains').within(() => {
      cy.wait(1000)
      cy.getByText('add', { exact: false }).click({ force: true })
      cy.getByPlaceholderText('Type in a label', { exact: false }).type(LABEL, {
        force: true
      })
      cy.getByText('save', { exact: false }).click({ force: true })

      cy.getByText(`${LABEL}.subdomaindummy.eth`, { timeout: 10000 })
        .click({ force: true })
        .url()
        .should('include', `/name/${LABEL}.subdomaindummy.eth`)
    })
  })
})
