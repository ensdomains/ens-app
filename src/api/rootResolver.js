import merge from 'lodash/merge'
import managerResolvers, {
  defaults as managerDefaults
} from './manager/resolvers'
import auctionRegistrarResolvers, {
  defaults as auctionRegistrarDefaults
} from './registrar/resolvers'
import subDomainRegistrarResolvers, {
  defaults as subDomainRegistrarDefaults
} from './subDomainRegistrar/resolvers'

export default merge(
  managerResolvers,
  auctionRegistrarResolvers,
  subDomainRegistrarResolvers
)
