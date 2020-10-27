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

function confirmRecordUpdate() {
  cy.getByTestId('action').click({ force: true })
  cy.getByTestId('send-transaction').click({
    force: true
  })
  cy.wait(100)
}

function refreshAndCheckText(url, textOrArrayOfText) {
  cy.visit(url)
  if (typeof textOrArrayOfText === 'string') {
    cy.queryByText(textOrArrayOfText).should('exist')
  } else {
    textOrArrayOfText.forEach(text => cy.queryByText(text).should('exist'))
  }
}

describe('Name detail view', () => {
  it('can see list of top level domains from [root]', () => {
    cy.visit(`${NAME_ROOT}/[root]/subdomains`)
    cy.queryByTestId('eth', { timeout: 10000 }).should('exist')
    cy.queryByTestId('reverse', { timeout: 10000 }).should('exist')
    cy.url().should('eq', `${NAME_ROOT}/[root]/subdomains`)
  })
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
      cy.getByText('Add/Edit Record').click({ force: true, exact: false })
      cy.getByText('Add record', { timeout: 10000 }).click({
        force: true
      })
      cy.getByText('Addresses', { timeout: 10000 }).click({
        force: true
      })

      cy.getByText('Coin', { timeout: 10000 }).click({
        force: true
      })
      cy.getByText('ETH', { timeout: 10000 }).click({
        force: true
      })
      cy.getByPlaceholderText('Enter a Eth Address', {
        timeout: 10000,
        exact: false
      }).type('blah', { force: true, timeout: 10000 })

      cy.getByPlaceholderText('Enter a Eth Address', { exact: false }).should(
        elem => {
          expect(elem.val()).to.equal('blah')
        }
      )
      cy.queryByTestId('save-record', { exact: false }).should(
        'have.css',
        'background-color',
        DISABLED_COLOUR
      )
      //force click like a real user
      cy.getByTestId('save-record', { exact: false }).click({ force: true })

      cy.getByPlaceholderText('Enter a Eth Address', { exact: false }).should(
        elem => {
          expect(elem.val()).to.equal('blah')
        }
      )

      // Form was not closed and nothing happened
      // This query seems flakey
      // cy.queryByValue('blah').should('exist')
    })
  })

  it('can add an address', () => {
    const url = `${NAME_ROOT}/notsoawesome.eth`
    cy.visit(url)

    cy.getByTestId('name-details').within(container => {
      cy.getByText('Add/Edit Record').click({ force: true, exact: false })
      cy.getByText('Add record', { timeout: 10000 }).click({
        force: true
      })
      cy.getByText('Addresses', { timeout: 10000 }).click({
        force: true
      })

      cy.getByText('Coin', { timeout: 10000 }).click({
        force: true
      })
      cy.getByText('ETH', { timeout: 10000 }).click({
        force: true
      })
      cy.getByPlaceholderText('Enter a Eth Address', {
        timeout: 10000,
        exact: false
      }).type('0x0000000000000000000000000000000000000003', {
        force: true,
        timeout: 10000
      })

      waitUntilInputResolves('Save').then(() => {
        cy.wait(1000)
        cy.getByText('Save').click({ force: true })
      })
    })

    confirmRecordUpdate()
    refreshAndCheckText(url, '0x0000000000000000000000000000000000000003')
  })

  it('can add a content hash', () => {
    const url = `${NAME_ROOT}/notsoawesome.eth`
    const content = 'ipfs://QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB'
    const contentv1 =
      'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y'
    cy.visit(url)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('Add/Edit Record')
        .click({ force: true })
        .getByText('Add record', { timeout: 10000 })
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
      })
    })

    confirmRecordUpdate()
    refreshAndCheckText(url, content)
  })

  it('can add other address', () => {
    const address = 'MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441'
    const url = `${NAME_ROOT}/notsoawesome.eth`
    cy.visit(url)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('Add/Edit Record')
        .click({ force: true })
        .getByText('Add record', { timeout: 10000 })
        .click({ force: true })
        .getByText('Addresses')
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
      })
    })

    confirmRecordUpdate()
    refreshAndCheckText(url, address)
  })

  it('can add default Text', () => {
    const text = 'Hello'
    const url = `${NAME_ROOT}/notsoawesome.eth`
    cy.visit(url)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('Add/Edit Record')
        .click({ force: true })
        .getByText('Add record', { timeout: 10000 })
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
      })
    })

    confirmRecordUpdate()
    refreshAndCheckText(url, text)
  })

  it('can add custom Text', () => {
    const text = 'Bar'
    const url = `${NAME_ROOT}/notsoawesome.eth`
    cy.visit(url)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('Add/Edit Record')
        .click({ force: true })
        .getByText('Add record', { timeout: 10000 })
        .click({ force: true })
        .getByText('Text')
        .click({ force: true })
        .getByText('Key', { exact: false })
        .click({ force: true })
        .get('input#react-select-3-input')
        .type('FOOOOOOOO{enter}')
        .getByPlaceholderText('FOOOOOOOO', { exact: false })
        .type('Bar', { force: true })

      waitUntilInputResolves('Save').then(() => {
        cy.getByText('Save').click({ force: true })
      })
    })

    confirmRecordUpdate()
    refreshAndCheckText(url, ['FOOOOOOOO', 'Bar'])
  })

  it('can change the address', () => {
    const url = `${NAME_ROOT}/abittooawesome.eth`
    cy.visit(url)
    const ADDRESS = '0x0000000000000000000000000000000000000007'

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('Add/Edit Record').click({ force: true })
      cy.wait(2000)
      cy.getByTestId('ETH-record-input')
        .clear({ force: true })
        .type(ADDRESS, { force: true })
    })

    confirmRecordUpdate()
    refreshAndCheckText(url, ADDRESS)
  })

  it('can change the content hash', () => {
    const CONTENT =
      'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'
    const url = `${NAME_ROOT}/abittooawesome.eth`
    cy.visit(url)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('Add/Edit Record').click({ force: true })
      cy.wait(2000) //TODO - get rid of wait and wait until text as some input before deleting
      cy.getByTestId('content-record-input').type(
        `{selectall}{backspace}${CONTENT}`
      )
    })
    confirmRecordUpdate()
    refreshAndCheckText(url, CONTENT)
  })

  it('can change text', () => {
    const TEXT = 'world'
    const url = `${NAME_ROOT}/notsoawesome.eth`
    cy.visit(url)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('Add/Edit Record').click({ force: true })
      cy.wait(2000) //TODO - get rid of wait and wait until text as some input before deleting
      cy.getByTestId('notice-record-input')
        .clear({ force: true })
        .type(TEXT)
    })

    confirmRecordUpdate()
    refreshAndCheckText(url, TEXT)
  })

  it.only('can change other address', () => {
    const ADDRESS = 'MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441'
    const url = `${NAME_ROOT}/notsoawesome.eth`

    cy.visit(url)

    cy.getByTestId('name-details', { timeout: 10000 }).within(container => {
      cy.getByText('Add/Edit Record').click({ force: true })
      cy.wait(10000)
      cy.getByTestId('LTC-record-input', { timeout: 10000 })
        .clear({ force: true })
        .type(ADDRESS)
    })

    confirmRecordUpdate()
    refreshAndCheckText(url, ADDRESS)
  })

  it('can delete records', () => {
    cy.visit(`${NAME_ROOT}/notsoawesome.eth`)
    cy.getByTestId('name-details').within(container => {
      cy.getByText('Add/Edit Record').click({ force: true })

      cy.getByTestId('ETH-record-delete', {
        exact: false,
        timeout: 10000
      }).click({
        force: true
      })

      cy.getByTestId('delete-content', { exact: false, timeout: 10000 }).click({
        force: true
      })

      cy.getByTestId('LTC-record-delete', {
        exact: false,
        timeout: 10000
      }).click({
        force: true
      })

      cy.getByTestId('notice-record-delete', {
        exact: false,
        timeout: 10000
      }).click({
        force: true
      })
    })

    confirmRecordUpdate()
  })

  it('can navigate to a subdomain', () => {
    cy.visit(`${NAME_ROOT}/subdomaindummy.eth/subdomains`, { timeout: 10000 })
    cy.getByText('original.subdomaindummy.eth', { timeout: 15000 }).click({
      force: true
    })
  })

  it('can add a subdomain', () => {
    const LABEL = 'sub1' // using the same subdomain label which is used at sub1.testing.eth
    cy.visit(`${NAME_ROOT}/subdomaindummy.eth/subdomains`, { timeout: 10000 })

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
