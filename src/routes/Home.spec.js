import { getQueryName } from '../utils/graphql'

jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))
import { useQuery } from '@apollo/client'

jest.mock('../hooks/useEPNSEmbed', () => ({
  __esModule: true,
  ...jest.requireActual('../hooks/useEPNSEmbed'),
  useEPNSEmbed: jest.fn()
}))
import { useEPNSEmbed } from '../hooks/useEPNSEmbed'

jest.mock('../components/SearchName/Search', () => ({
  __esModule: true,
  default: jest.fn()
}))
import SearchDefault from '../components/SearchName/Search'

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { StaticRouter } from 'react-router-dom'

import Home, {
  HOME_DATA,
  GET_ACCOUNT,
  epnsTriggerId,
  epnsTriggerAppName
} from './Home'

describe('Home', () => {
  it('should not show MyAccount if we have accounts but are in readOnly mode', async () => {
    const mockProps = {
      domain: {
        name: 'vitalik.eth',
        parent: 'eth'
      },
      pathname: '',
      tab: 'register',
      match: {
        url: 'url'
      }
    }
    const context = {}
    const account = '0xaddress1'

    useQuery.mockImplementation(data => {
      const queryName = getQueryName(data)
      if (queryName === 'getAccounts') {
        return {
          data: {
            accounts: [account]
          }
        }
      }
      if (queryName === 'getHomeData') {
        return {
          data: {
            network: '1',
            displayName: 'vitalik.eth',
            isReadOnly: true,
            isSafeApp: false
          }
        }
      }
      if (queryName === 'shouldDelegateQuery') {
        return {
          data: {
            shouldDelegate: false
          }
        }
      }
    })

    useEPNSEmbed.mockImplementation(data => {
      expect(data.user).toEqual(account)
      expect(data.targetID).toEqual(epnsTriggerId)
      expect(data.appName).toEqual(epnsTriggerAppName)

      return {
        isEpnsSupportedNetwork: true
      }
    })

    SearchDefault.mockImplementation(() => <div />)

    const { debug, queryByTestId } = render(
      <StaticRouter location={'/'} context={context}>
        <Home {...mockProps} />
      </StaticRouter>
    )

    expect(queryByTestId(/display-name/i)).toBeNull()
  })
})
