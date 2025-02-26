import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActionButtonList } from './components/ActionButtonList'
import { SmartContractActionButtonList } from './components/SmartContractActionButtonList'
import { InfoList } from './components/InfoList'
import { projectId, metadata, networks, wagmiAdapter } from './config'

import "./App.css"

const queryClient = new QueryClient()

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'light' as const,
  themeVariables: {
    '--w3m-accent': '#000000',
  }
}

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export function App() {
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>(undefined);
  const [signedMsg, setSignedMsg] = useState('');
  const [balance, setBalance] = useState('');
  const [erc20Balance, setErc20Balance] = useState('');
  const [signR, setSignR] = useState<`0x${string}`>("0x");
  const [signS, setSignS] = useState<`0x${string}`>("0x");
  const [signV, setSignV] = useState(0n);
  const [timestep, setTimestep] = useState(0n);

  const receiveHash = (hash: `0x${string}`) => {
    setTransactionHash(hash); // Update the state with the transaction hash
  };

  const receiveSignedMsg = (signedMsg: string) => {
    setSignedMsg(signedMsg); // Update the state with the transaction hash
  };

  const receivebalance = (balance: string) => {
    setBalance(balance)
  }

  const receiveErc20Balance = (erc20Balance: string) => {
    setErc20Balance(erc20Balance)
  }

  const receiveRSV = (signR: `0x${string}`, signS: `0x${string}`, v: bigint, timestep: bigint) => {
      setSignR(signR);
      setSignS(signS);
      setSignV(v);
      setTimestep(timestep);
  };


    return (
    <div className={"pages"}>
      <img src="/reown.svg" alt="Reown" style={{ width: '150px', height: '150px' }} />
      <h1>AppKit Wagmi React dApp Example</h1>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            <appkit-button />
            {/*<w3m-button></w3m-button>*/}
            {/*<w3m-button/>*/}
            <ActionButtonList sendHash={receiveHash} sendSignMsg={receiveSignedMsg} sendBalance={receivebalance} sendRSV={receiveRSV}/>
            <SmartContractActionButtonList sendErc20Balance={receiveErc20Balance} signR={signR} signS={signS} signV={signV} deadline={timestep}/>
            <div className="advice">
              <p>
                This projectId only works on localhost. <br/>
                Go to <a href="https://cloud.reown.com" target="_blank" className="link-button" rel="Reown Cloud">Reown Cloud</a> to get your own.
              </p>
            </div>
            <InfoList hash={transactionHash} signedMsg={signedMsg} balance={balance} erc20Balance={erc20Balance}/>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}

export default App
