export default [
  // 0
  {
    state: 'ENABLE_DNSSEC',
    title: 'Problem fetching data from DNS',
    displayError: true
  },
  // 1
  {
    state: 'ENABLE_DNSSEC',
    title: 'DNS entry does not exist.',
    displayError: true
  },
  // 2
  {
    state: 'ENABLE_DNSSEC',
    title: 'Please enable DNSSEC'
  },
  // 3
  {
    state: 'ADD_TEXT',
    title: 'Please add text record into _ens.name.tld'
  },
  // 4,
  {
    state: 'ADD_TEXT',
    title: 'DNS Record is invalid',
    displayOwner: true,
    displayError: true
  },
  // 5,
  {
    state: 'SUBMIT_PROOF',
    title: 'Ready to register',
    button: 'Register',
    displayOwner: true
  }
]
