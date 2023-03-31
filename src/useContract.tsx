// look in web3/contract_info.ts for the contract info
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { ERC20Config, ERC721Config } from '../environments/interface'

export function useContract(contractDetails: ERC20Config | ERC721Config): ethers.Contract {
  const { account, provider } = useWeb3React()

  return React.useMemo(() => {
    if (!provider) return undefined

    return new ethers.Contract(
      contractDetails.address,
      contractDetails.abi,
      account ? provider.getSigner(account) : provider
    )
  }, [provider, account])
}
