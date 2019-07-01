export default [
  {
    title: 'Error: Problem fetching data from DNS',
    action: false
  },
  {
    state: 'ENABLE_DNSSEC',
    title: 'Please enable DNSSEC',
    action: false
  },
  {
    state: 'ADD_TEXT',
    title: 'Please add text record into _ens.name.tld',
    action: false
  },
  {
    title: 'DNS Record is invalid',
    action: false
  },
  {
    state: 'SUBMIT_PROOF',
    title: 'Ready to register',
    action: true,
    button: 'Register',
    displayOwner: true
  },
  {
    title: 'ENS is registered',
    action: false
  },
  {
    title: 'Update ENS Record',
    action: true,
    displayOwner: true,
    button: 'Update'
  },
  {
    title: 'DNS Record is invalid',
    action: true,
    claim: 'Delete'
  }
]
