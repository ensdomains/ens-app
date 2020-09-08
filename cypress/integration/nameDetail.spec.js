const ROOT = Cypress.env('ROOT')
const NAME_ROOT = Cypress.env('NAME_ROOT')

const DISABLED_COLOUR = 'rgb(223, 223, 223)'

function waitUntilInputResolves(buttonTextOrOptions) {
  return cy.waitUntilInputResolves(buttonTextOrOptions)
}

function waitUntilTestIdDoesNotExist(testId) {
  return cy.waitUntilTestIdDoesNotExist(testId)
}

function waitUntilTextDoesNotExist(text) {
  return cy.waitUntilTextDoesNotExist(text)
}

describe('Name detail view', () => {
  it('cannot transfer ownership to a non-ethereum address', () => {
    cy.visit(`${NAME_ROOT}/awesome.eth`)
    cy.getByText('Transfer')
      .scrollIntoView()
      .click({ force: true })

    cy.getByTestId('name-details').within(container => {
      cy.getByPlaceholderText('address', {
        container,
        exact: false,
        timeout: 10000
      }).type('nope', {
        force: true
      })
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
      cy.getByPlaceholderText('address', {
        container,
        exact: false,
        timeout: 10000
      }).type('0x0000000000000000000000000000000000000001', {
        force: true,
        delay: 0
      })
    })
    waitUntilInputResolves('Transfer').then(() => {
      cy.wait(1000)
      cy.getByText('Transfer').click({ force: true })
      cy.getByText('Confirm').click({ force: true })

      cy.getByText('0x0000000000000000000000000000000000000001', {
        timeout: 11000
      }).should('exist')
    })
  })

  it('can change the resolver', () => {
    cy.visit(`${NAME_ROOT}/superawesome.eth`)

    waitUntilInputResolves({ type: 'testId', value: 'edit-resolver' }).then(
      () => {
        cy.getByTestId('edit-resolver').click({ force: true })
        cy.getByTestId('name-details').within(container => {
          cy.getByPlaceholderText('address', {
            container,
            timeout: 10000,
            exact: false
          }).type('0x0000000000000000000000000000000000000002', { force: true })
        })
        waitUntilInputResolves('Save').then(() => {
          cy.getByText('Save').click({ force: true })

          cy.getByText('0x0000000000000000000000000000000000000002', {
            timeout: 10000
          }).should('exist')
        })
      }
    )
  })

  it('can change the resolver to the public resolver', () => {
    cy.visit(`${NAME_ROOT}/superawesome.eth`)
    waitUntilInputResolves({ type: 'testId', value: 'edit-resolver' }).then(
      () => {
        cy.getByTestId('edit-resolver').click({ force: true })

        cy.getByText('Use Public Resolver', {
          exact: true,
          timeout: 10000
        }).click({
          force: true
        })

        waitUntilInputResolves('Save').then(() => {
          cy.getByTestId('name-details').within(container => {
            cy.getByPlaceholderText('address', {
              container,
              timeout: 10000,
              exact: false
            }).then($address => {
              cy.getByText('Save', { timeout: 5000 }).click({ force: true })
            })
          })
        })
        waitUntilInputResolves('Confirm').then(() => {
          cy.getByText('Confirm', { timeout: 5000 }).click({ force: true })
        })
        cy.getByTestId('name-details').within(container => {
          cy.getByPlaceholderText('address', {
            container,
            timeout: 10000,
            exact: false
          }).then($address => {
            cy.getByText($address.val(), { timeout: 10000 }).should('exist')
          })
        })
      }
    )
  })

  it(`prevents user from adding a record that isn't an address`, () => {
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByText('+').click({ force: true })
      cy.getByText('select a record', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.get('#react-select-2-option-0')
        .contains('Address')
        .click({ force: true })
      cy.getByPlaceholderText('Enter Ethereum name or address', {
        timeout: 10000,
        exact: false
      }).type('blah', { force: true, timeout: 10000 })

      cy.getByPlaceholderText('Enter Ethereum name or address').should(elem => {
        expect(elem.val()).to.equal('blah')
      })
      cy.queryByTestId('action', { exact: false }).should(
        'have.css',
        'background-color',
        DISABLED_COLOUR
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
      cy.getByText('select a record', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.get('#react-select-2-option-0')
        .contains('Address')
        .click({ force: true })

      cy.getByPlaceholderText('Enter Ethereum name or address', {
        exact: false
      }).type('0x0000000000000000000000000000000000000003', { force: true })

      waitUntilInputResolves('Save').then(() => {
        cy.wait(1000)
        cy.getByText('Save').click({ force: true })

        //Value updated
        cy.getByText('0x0000000000000000000000000000000000000003', {
          timeout: 10000
        }).should('exist')
      })
    })
  })

  it('can add a content hash', () => {
    const content = 'ipfs://QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB'
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('+')
        .click({ force: true })
        .getByText('select a record', { exact: false, timeout: 10000 })
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
          exact: false,
          timeout: 10000
        }).should('exist')
      })
    })
  })

  it('can add other address', () => {
    const address = 'MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441'
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('+')
        .click({ force: true })
        .getByText('select a record', { exact: false, timeout: 10000 })
        .click({ force: true })
        .getByText('Other addresses')
        .click({ force: true })
        .getByText('Coin', { exact: false })
        .click({ force: true })
        .getByText('LTC', { exact: false })
        .click({ force: true })
        .getByPlaceholderText('Enter a LTC address', {
          exact: false,
          timeout: 10000
        })
        .type(address, { force: true })
      waitUntilInputResolves('Save').then(() => {
        cy.getByText('Save').click({ force: true })
        cy.queryByText(address, {
          exact: false,
          timeout: 10000
        }).should('exist')
      })
    })
  })

  it('can add default Text', () => {
    const text = 'Hello'
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('+')
        .click({ force: true })
        .getByText('select a record', { exact: false, timeout: 10000 })
        .click({ force: true })
        .getByText('Text')
        .click({ force: true })
        .getByText('Key', { exact: false })
        .click({ force: true })
        .getByText('Notice', { exact: false })
        .click({ force: true })
        .getByPlaceholderText('Enter notice', { exact: false, timeout: 10000 })
        .type(text, { force: true })
      waitUntilInputResolves('Save').then(() => {
        cy.getByText('Save').click({ force: true })
        cy.queryByText(text, {
          exact: false,
          timeout: 10000
        }).should('exist')
      })
    })
  })

  it('can add custom Text', () => {
    const text = 'Bar'
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('+')
        .click({ force: true })
        .getByText('select a record', { exact: false })
        .click({ force: true })
        .getByText('Text')
        .click({ force: true })
        .getByText('Key', { exact: false })
        .click({ force: true })
        .get('input#react-select-3-input')
        .type('FOOOOOOOO{enter}')
        .getByText('CREATE "FOOOOOOOO"', { exact: false })

      cy.get('input:last').type(text, { force: true })
      waitUntilInputResolves('Save').then(() => {
        cy.getByText('Save').click({ force: true })
      })
      cy.queryByText(text, {
        exact: false,
        timeout: 10000
      }).should('exist')
    })
  })

  it('can change the address', () => {
    cy.visit(`${NAME_ROOT}/abittooawesome.eth`)
    const ADDRESS = '0x0000000000000000000000000000000000000007'

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByTestId('edit-address', { exact: false }).click({ force: true })
      cy.getByPlaceholderText('Enter Ethereum name or address', {
        timeout: 10000,
        exact: false
      }).type(ADDRESS, { force: true })

      waitUntilInputResolves('Save').then(() => {
        cy.wait(1000)
        cy.getByText('Save').click({ force: true })

        //form closed
        waitUntilTestIdDoesNotExist('action')
        waitUntilTestIdDoesNotExist('cancel')

        cy.queryByText(ADDRESS, {
          exact: false,
          timeout: 10000
        }).should('exist')
      })
    })
  })

  it('can change the content hash', () => {
    const content =
      'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'

    cy.visit(`${NAME_ROOT}/abittooawesome.eth`)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByTestId('edit-content', { exact: false, timeout: 10000 })
        .scrollIntoView()
        .click({
          force: true
        })
      cy.getByPlaceholderText('Enter a content hash', {
        timeout: 10000,
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

  it('can change text', () => {
    const content = 'world'
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-notice', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.getByPlaceholderText('Enter notice', {
        timeout: 10000,
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

  it('can change other address', () => {
    const content = 'MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441'

    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByTestId('edit-ltc', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.getByPlaceholderText('Enter a LTC address', {
        timeout: 10000,
        exact: false
      }).type(content, { force: true })

      waitUntilInputResolves('Save').then(() => {
        cy.getByText('Save').click({ force: true })

        //form closed
        waitUntilTestIdDoesNotExist('action')
        waitUntilTestIdDoesNotExist('cancel')

        //Value updated
        cy.queryByText(content, { exact: false, timeout: 10000 }).should(
          'exist'
        )
      })
    })
  })

  it('can delete records', () => {
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)
    cy.getByTestId('name-details').within(container => {
      cy.getByTestId('edit-address', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.getByTestId('delete-address', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.wait(1000)

      cy.getByTestId('edit-content', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.getByTestId('delete-content', { exact: false, timeout: 10000 }).click({
        force: true
      })

      cy.getByTestId('edit-ltc', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.getByTestId('delete-KeyValue-ltc', {
        exact: false,
        timeout: 10000
      }).click({
        force: true
      })

      cy.getByTestId('edit-notice', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.getByTestId('delete-KeyValue-notice', {
        exact: false,
        timeout: 10000
      }).click({
        force: true
      })
      cy.wait(1000)

      //No addresses to edit
      cy.queryByText('+', { exact: false }).should('exist')
    })
  })

  it('can navigate to a subdomain', () => {
    cy.visit(`${NAME_ROOT}/subdomaindummy.eth`)
      .getByText('subdomains', { exact: false, timeout: 10000 })
      .click({ force: true })
      .getByText('original.subdomaindummy.eth', { timeout: 15000 })
      .click({ force: true })
  })

  it('can add a subdomain', () => {
    const LABEL = 'sub1' // using the same subdomain label which is used at sub1.testing.eth
    cy.visit(`${NAME_ROOT}/subdomaindummy.eth`, { timeout: 10000 })
      .getByText('subdomains', { exact: false, timeout: 10000 })
      .click({ force: true })

    cy.getByTestId('subdomains').within(() => {
      cy.wait(1000)
      cy.getByText('add', { exact: false, timeout: 10000 }).click({
        force: true
      })
      cy.getByPlaceholderText('Type in a label', {
        exact: false,
        timeout: 10000
      }).type(LABEL, {
        force: true
      })
      cy.getByText('save', { exact: false }).click({ force: true })
    })
    cy.wait(1000)
    cy.visit(`${NAME_ROOT}/subdomaindummy.eth/subdomains`)
      .getByText('subdomains', { exact: false, timeout: 10000 })
      .click({ force: true })

    cy.queryByText(`${LABEL}.subdomaindummy.eth`, { timeout: 10000 }).should(
      'exist'
    )
  })
})
