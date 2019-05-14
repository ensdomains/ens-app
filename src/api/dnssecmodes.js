export default [
  {
    title: 'Error: Problem fetching data from DNS',
    action: false
  },
  {
    title: 'Please enable DNSSEC',
    action: false
  },
  {
    title: 'Please add text record into _ens.name.tld',
    action: false
  },
  {
    title: 'DNS Record is invalid',
    action: false
  },
  {
    title: 'DNS is owned',
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
    button: 'Update'
  },
  {
    title: 'DNS Record is invalid',
    action: true,
    claim: 'Delete'
  }
]
