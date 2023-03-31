import { useWeb3React } from '@web3-react/core'
import { UnAuthorizedPage } from '../pages/unAuthPage/unAuthorizedPage'
import React, { useContext } from 'react'
import { ConfigContext } from '../context/configProvider'
import { supportedChainIds } from '../web3'
import { config } from '../environments/environments'
import { ConnectModalButton } from '../components/connect/ConnectModal'
import { Button } from '@mui/material'
import { AnimateConnecting } from './AnimateConnecting'
import { withProviders } from '../context/withProviders'

const Component = ({ children }: { children: JSX.Element }) => {
  const { account, chainId, connector, ENSName } = useWeb3React()
  const { networkConfig, desiredChainId } = useContext(ConfigContext)

  if (!account) {
    return (
      <UnAuthorizedPage
        pageHeading="Connect Wallet"
        pageSubHeader={``}
        component={<ConnectModalButton setError={() => {}} />}
      />
    )
  }

  if (
    (networkConfig && desiredChainId && !networkConfig?.tokens) ||
    !(chainId && supportedChainIds.includes(chainId))
  ) {
    return (
      <UnAuthorizedPage
        text={`You must be on the ${config?.networks[desiredChainId]?.chainName} network to view this page.`}
        component={
          <>
            {children}
            <Button className={`connect-button`} onClick={() => connector?.activate(desiredChainId)}>
              Switch Network
            </Button>
          </>
        }
      />
    )
  }

  return children
}

export const RequireConnection = withProviders(AnimateConnecting)(Component)
