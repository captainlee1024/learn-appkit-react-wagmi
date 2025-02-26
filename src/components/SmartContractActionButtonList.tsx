//
// if you are not going to read or write smart contract, you can delete this file
//

import { useAppKitNetwork, useAppKitAccount  } from '@reown/appkit/react'
import { useReadContract, useWriteContract } from 'wagmi'
import { useEffect } from 'react'
const storageABI = [
	{
		"inputs": [],
		"name": "retrieve",
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
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "store",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const tokenBankABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_bankAdmin",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balances",
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
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "onErc20Received",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newTokenAddr",
                "type": "address"
            }
        ],
        "name": "supportNewToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "supportsTokenAddr",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "baseERC20",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]

const terryTokenBankABI = [
    {
        "inputs": [
            {
                "internalType": "contract ERC20Permit",
                "name": "_tToken",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "Balance",
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
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "depositWithPermit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tToken",
        "outputs": [
            {
                "internalType": "contract ERC20Permit",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const terryTokenBankSC = "0xA54ddB49f572472b3dCC2786f39dB636eEc26e41";

// const terryTokenSC = "0x2A9c77C40f651e0B92797bB92C28BA40214f979C";

const tokenBankSC = "0xbEb8Ba33F71274a33Fe4ae3fD9636a2aDbe0D958";

const storageSC = "0xEe6D291CC60d7CeD6627fA4cd8506912245c8cA4"

interface SmartContractActionButtonListProps {
    sendErc20Balance: (erc20Balance: string) => void;
    signR: `0x${string}`;
    signS: `0x${string}`;
    signV: bigint;
    deadline: bigint;
}

export const SmartContractActionButtonList = ({sendErc20Balance, signR, signS, signV, deadline} :SmartContractActionButtonListProps) => {
    const { isConnected } = useAppKitAccount() // AppKit hook to get the address and check if the user is connected
    const { chainId } = useAppKitNetwork()
    const { writeContract, isSuccess, status, error } = useWriteContract()
    const readContract = useReadContract({
      address: storageSC,
      abi: storageABI,
      functionName: 'retrieve',
      query: {
        enabled: false, // disable the query in onload
      }
    })

    useEffect(() => {
      if (isSuccess) {
        console.log("contract write success");
      }
      if (status !== null) {
          console.log(status)
      }
      if (error !== null) {
          console.log(error)
      }
    }, [isSuccess, status, error])

    const handleReadSmartContract = async () => {
      console.log("Read Sepolia Smart Contract");
      const { data } = await readContract.refetch();
      console.log("data: ", data)
    }

    const handleWriteSmartContract = () => {
        console.log("Write Sepolia Smart Contract")
        writeContract({
          address: storageSC,
          abi: storageABI,
          functionName: 'store',
          args: [123n],
        })
    }

    const handleWriteBankWithERC20Permit = async () => {
        console.log("Write Bank With ERC20Permit")
        console.log(signR, signS, signV, deadline);

        writeContract({
            address: terryTokenBankSC,
            abi: terryTokenBankABI,
            functionName: 'depositWithPermit',
            args: ["0xD0148b6eB2471F86126Cfe4c4716ab71889131ff", 100n, deadline, signV, signR, signS],
        })
    }

    const readBank = useReadContract({
        address: tokenBankSC,
        abi: tokenBankABI,
        functionName: 'balances',
        args: ["0xD0148b6eB2471F86126Cfe4c4716ab71889131ff","0x1B56494ccd90E53153033815d544cDb2363156C4"],
        query: {
            enabled: false, // disable the query in onload
        }
    })

    const handleReadBankUserBalance = async () => {
        console.log("Read Bank ERC20 Token Balance")
        const { data } = await readBank.refetch();
        // alert(`ERC20 Balance:  ${data}`);
        sendErc20Balance(data?.toString()+"ERC20");
        // sendErc20Balance(balance?.data?.value.toString() + " " + balance?.data?.symbol.toString())
    }


  return (
    isConnected && chainId === 11155111 && ( // Only show the buttons if the user is connected to Sepolia
    <div >
        <button onClick={handleReadSmartContract}>Read Sepolia Smart Contract</button>
        <button onClick={handleWriteSmartContract}>Write Sepolia Smart Contract</button>
        <button onClick={handleReadBankUserBalance}>Read Bank ERC20 Token Balance</button>
        <button onClick={handleWriteBankWithERC20Permit}>Write Bank With ERC20Permit</button>
    </div>
    )
  )
}
