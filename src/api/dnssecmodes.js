export default [
  // 0
  {
    state: 'ENABLE_DNSSEC',
    title: 'Problem fetching data from DNS',
    displayError: true,
    action: false
  },
  // 1
  {
    state: 'ENABLE_DNSSEC',
    title: 'DNS entry does not exist.',
    displayError: true,
    action: false
  },
  // 2
  {
    state: 'ENABLE_DNSSEC',
    title: 'Please enable DNSSEC',
    action: false
  },
  // 3
  {
    state: 'ADD_TEXT',
    title: 'Please add text record into _ens.name.tld',
    action: false
  },
  // 4,
  {
    state: 'ADD_TEXT',
    title: 'DNS Record is invalid',
    displayOwner: true,
    displayError: true,
    action: false
  },
  // 5,
  {
    state: 'SUBMIT_PROOF',
    title: 'Ready to register',
    action: true,
    button: 'Register',
    displayOwner: true
  },
  // 6,
  {
    title: 'ENS is registered',
    action: false
  },
  // 7,
  {
    title: 'Update ENS Record',
    action: true,
    displayOwner: true,
    button: 'Update'
  },
  // 8,
  {
    title: 'DNS Record is invalid',
    action: true,
    claim: 'Delete'
  }
]
