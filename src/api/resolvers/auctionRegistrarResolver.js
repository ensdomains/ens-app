import gql from 'graphql-tag'
import get from 'lodash/get'
import set from 'lodash/set'

const defaults = {}

const resolvers = {
  Mutation: {
    getDomainState: (_, { domain }, { cache }) => {
      console.log('checking availability of domain', domain)
      // return {
      //   domain,
      //   state: 'Available',
      //   __typename: 'NodeState'
      // }
    }
  }
}

export default resolvers

export { defaults }
