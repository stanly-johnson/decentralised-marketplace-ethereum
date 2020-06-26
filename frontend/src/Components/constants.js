// every deployment contract address changes
export const CONTRACT_ADDRESS = '0xCA230be42758703a61D9d333710e4Eae0c5E17Ed'
export const APPROVAL_ADDRESS = "0x5660df1681a32E70704439E9243b1B91c369580e"
export const INFURA_PROVIDER = "https://rinkeby.infura.io/v3/fe850a1d3b5f4d4e9f9df5f6760e691d"
export const SENDER_ADDRESS = "0xee60ae00fefb521aee05a33f96e50e1934a9913c"
export const SENDER_PVT_KEY = "26240f03b04881bca5ba9e430923cc216c430e76f8b116255d454544943c4405"
// abi changes only with code change
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "uid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "college",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "addr",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "phone",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "candidatesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_college",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_addr",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_phone",
        "type": "string"
      }
    ],
    "name": "createCandidate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_uid",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "value",
        "type": "bool"
      }
    ],
    "name": "approveCandidate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]