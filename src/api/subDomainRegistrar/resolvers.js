import { queryAll } from '../subDomainRegistrar'
import { fromWei } from 'ethjs-unit'
import { getOwner } from '../registry'

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
      console.log(1)

      const nodes = await queryAll(name)

      console.log(2)

      const cachedNodes = []

      const promises = nodes.map(subDomainPromise =>
        subDomainPromise
          .then(async node => {
            let owner = null

            if (!node.available) {
              owner = await getOwner(`${node.label}.${node.domain}.eth`)
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

            const data = {
              subDomainState: [...cachedNodes]
            }

            cache.writeData({ data })
          })
          .catch(e => console.log('ERROR in subdomain results', e))
      )

      console.log(3)

      return Promise.all(promises).then(() => {
        return cachedNodes
      })
    }
  }
}

export default resolvers

export { defaults }
