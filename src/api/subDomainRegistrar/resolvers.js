import { queryAll } from '../subDomainRegistrar'
import { fromWei } from 'ethjs-unit'
import getENS from 'apollo/mutations/ens'

const defaults = {
  subDomainState: []
}

const resolvers = {
  Query: {
    async getSubDomainAvailability(_, { name }) {
      const nodes = await queryAll(name)
      const cachedNodes = []

      const promises = nodes.map(subDomainPromise =>
        subDomainPromise
          .then(async node => {
            let owner = null

            if (!node.available) {
              const ens = getENS()
              owner = await ens.getOwner(`${node.label}.${node.domain}.eth`)
            }
            const newNode = {
              ...node,
              id: `${node.label}.${node.domain}.eth`,
              owner,
              name: `${node.label}.${node.domain}.eth`,
              state: node.available ? 'Open' : 'Owned',
              price: fromWei(node.price, 'ether'),
              __typename: 'SubDomain'
            }

            cachedNodes.push(newNode)
          })
          .catch(e => console.log('ERROR in subdomain results', e))
      )

      return Promise.all(promises).then(() => {
        return cachedNodes
      })
    }
  }
}

export default resolvers

export { defaults }
