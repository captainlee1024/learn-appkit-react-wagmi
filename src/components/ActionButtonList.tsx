import { useEffect } from 'react';
import { useDisconnect, useAppKit, useAppKitNetwork, useAppKitAccount  } from '@reown/appkit/react'
import {parseGwei, type Address, parseSignature} from 'viem'
import {useEstimateGas, useSendTransaction, useSignMessage, useBalance, useSignTypedData} from 'wagmi'
import { networks } from '../config'
import { useReadContract } from 'wagmi'

// test transaction
const TEST_TX = {
  to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" as Address, // vitalik address
  value: parseGwei('0.0001')
}

interface ActionButtonListProps {
  sendHash: (hash: `0x${string}` ) => void;
  sendSignMsg: (hash: string) => void;
  sendBalance: (balance: string) => void;
  sendRSV: (r: `0x${string}`, s: `0x${string}`, v: bigint, timestep: bigint) => void;
}

export const ActionButtonList = ({ sendHash, sendSignMsg, sendBalance, sendRSV }: ActionButtonListProps) => {
    const { disconnect } = useDisconnect(); // AppKit hook to disconnect
    const { open } = useAppKit(); // AppKit hook to open the modal
    const { switchNetwork } = useAppKitNetwork(); // AppKithook to switch network
    const { address, isConnected } = useAppKitAccount() // AppKit hook to get the address and check if the user is connected

    const { data: gas } = useEstimateGas({...TEST_TX}); // Wagmi hook to estimate gas
    const { data: hash, sendTransaction, } = useSendTransaction(); // Wagmi hook to send a transaction
    const { signMessageAsync } = useSignMessage() // Wagmi hook to sign a message
    const { signTypedDataAsync } = useSignTypedData() // Wagmi hook to sign typed data
    const { refetch } = useBalance({
      address: address as Address
    }); // Wagmi hook to get the balance
    const readPermitTokenNonce = useReadContract({
        address: "0x41EeE89e29d66Dada344BE25F87C355F76fdE051",
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "nonces",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
        ],
        functionName: 'nonces',
        args: [address as Address],
        query: {
            enabled: false, // disable the query in onload
        }
    })

    
    useEffect(() => {
        if (hash) {
          sendHash(hash);
        }
    }, [hash]);

    // function to send a tx
    const handleSendTx = () => {
      try {
        sendTransaction({
          ...TEST_TX,
          gas // Add the gas to the transaction
        });
      } catch (err) {
        console.log('Error sending transaction:', err);
      }
    }

    // function to sing a msg 
    const handleSignTypedData = async () => {
      const currentTime = new Date();
      const nextDay = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
      const timeStep = BigInt(nextDay.getTime());
      const {data} = await readPermitTokenNonce.refetch();
      const permitNonce: bigint = (data !== undefined)?data : 0n;
      const sig = await signTypedDataAsync({
        domain: {
            name: "TerryToken",
            version: "1",
            chainId: 11155111,
            verifyingContract: "0x41EeE89e29d66Dada344BE25F87C355F76fdE051"
        },
        types: {
            Permit: [
                { name: 'owner', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint256' },
            ]
        },
          primaryType: 'Permit',
          message: {
            owner: address as Address,
            spender: "0xA54ddB49f572472b3dCC2786f39dB636eEc26e41",
            value: 100n,
            // nonce: 0n,
            nonce: permitNonce,
            deadline: timeStep,// 1 hour from now
          },
      });
      const {r, s, v} = parseSignature(sig);
      console.log(r, s, v, timeStep);
      sendRSV(r,s, typeof v === "bigint" ? v : 0n, timeStep);
      // sendRSV(r,s, v, timeStep);
    }

    // function to sing a msg
    const handleSignMsg = async () => {
        const msg = "Hello Reown AppKit!" // message to sign
        const sig = await signMessageAsync({ message: msg, account: address as Address });
        sendSignMsg(sig);
    }

    // function to get the balance
    const handleGetBalance = async () => {
      const balance = await refetch()
      sendBalance(balance?.data?.value.toString() + " " + balance?.data?.symbol.toString())
    }

    const handleDisconnect = async () => {
      try {
        await disconnect();
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    };


  return (
    isConnected && (
    <div >
        <button onClick={() => open()}>Open</button>
        <button onClick={handleDisconnect}>Disconnect</button>
        <button onClick={() => switchNetwork(networks[1]) }>Switch</button>
        <button onClick={handleSignMsg}>Sign msg</button>
        <button onClick={handleSignTypedData}>Sign Typed Data</button>
        <button onClick={handleSendTx}>Send tx</button>
        <button onClick={handleGetBalance}>Get Balance</button>
    </div>
    )
  )
}
