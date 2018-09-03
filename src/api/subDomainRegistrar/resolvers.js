import { queryAll } from '../subDomainRegistrar'
import { fromWei } from 'ethjs-unit'

const defaults = {
  subDomainState: []
}

const resolvers = {
  Mutation: {
    async getSubDomainAvailability(_, { name }, { cache }) {
      //clear old search results
      cache.writeData({
        data: {
          subDomainState: []
        }
      })

      const nodes = await queryAll(name)

      const cachedNodes = []

      nodes.forEach(subDomainPromise =>
        subDomainPromise
          .then(node => {
            const newNode = {
              ...node,
              id: `${node.label}.${node.domain}.eth`,
              name: `${node.label}.${node.domain}.eth`,
              state: node.available ? 'Open' : 'Owned',
              price: fromWei(node.price, 'ether'),
              __typename: 'SubDomain'
            }

            cachedNodes.push(newNode)

            const data = {
              subDomainState: [...cachedNodes]
            }

            cache.writeData({ data })
          })
          .catch(e => console.log('ERROR in subdomain results', e))
      )

      return null
    }
  }
}

export default resolvers

export { defaults }
