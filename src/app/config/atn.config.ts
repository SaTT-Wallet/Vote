import { Big } from 'big.js';
import { environment as env } from '../../environments/environment';

const sattUrl = env.API_URL;
const ipfsURL = env.ipfsURL;
const walletUrl = 'http://localhost:4200/#/';
const bscan = env.bscan;
const etherscan = env.etherscan;
const polygonscan = env.polygonscan;
const bttscan = env.bttscan;
const GAS_LIMIT=1000000;

const polygonscanAddr = env.polygonscanAddr;
const bttscanAddr = env.bttscanAddr;
const tronscanAddr = env.tronScanAddr;
const tronScan = env.tronScan;

const campaignSmartContractERC20 = env.addresses.smartContracts.campaignERC20;

const campaignSmartContractBEP20 = env.addresses.smartContracts.campaignBEP20;

const campaignSmartContractPOLYGON =
  env.addresses.smartContracts.campaignPOLYGON;

const campaignSmartContractBTT = env.addresses.smartContracts.campaignBTT;
const campaignSmartContractTRON = env.addresses.smartContracts.campaignTRON;

const id_campaign_to_participate = '61139d487048d8251bf91401';

const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'id',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'prom',
        type: 'bytes32',
      },
    ],
    name: 'CampaignApplied',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'id',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'startDate',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'endDate',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'dataUrl',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'limit',
        type: 'uint64',
      },
    ],
    name: 'CampaignCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'id',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'CampaignFunded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'id',
        type: 'bytes32',
      },
    ],
    name: 'CampaignFundsSpent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'id',
        type: 'bytes32',
      },
    ],
    name: 'PromAccepted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'id',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'PromPayed',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hashedMessage',
        type: 'bytes32',
      },
      { internalType: 'uint8', name: '_v', type: 'uint8' },
      { internalType: 'bytes32', name: '_r', type: 'bytes32' },
      { internalType: 'bytes32', name: '_s', type: 'bytes32' },
    ],
    name: 'VerifyMessage',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'acceptedTokens',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'typeSN', type: 'uint8' },
      { internalType: 'string', name: 'idPost', type: 'string' },
      { internalType: 'string', name: 'idUser', type: 'string' },
      { internalType: 'bytes32', name: 'idRequest', type: 'bytes32' },
    ],
    name: 'ask',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'typeSN', type: 'uint8' },
      { internalType: 'string', name: 'idPost', type: 'string' },
      { internalType: 'string', name: 'idUser', type: 'string' },
      { internalType: 'bytes32', name: 'idProm', type: 'bytes32' },
    ],
    name: 'askBounty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'campaigns',
    outputs: [
      { internalType: 'address', name: 'advertiser', type: 'address' },
      { internalType: 'string', name: 'dataUrl', type: 'string' },
      { internalType: 'uint64', name: 'startDate', type: 'uint64' },
      { internalType: 'uint64', name: 'endDate', type: 'uint64' },
      { internalType: 'uint64', name: 'nbProms', type: 'uint64' },
      { internalType: 'uint64', name: 'nbValidProms', type: 'uint64' },
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        internalType: 'struct campaign.Fund',
        name: 'funds',
        type: 'tuple',
      },
      {
        internalType: 'uint64',
        name: 'participationLimit',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'dataUrl', type: 'string' },
      { internalType: 'uint64', name: 'startDate', type: 'uint64' },
      { internalType: 'uint64', name: 'endDate', type: 'uint64' },
      { internalType: 'uint256[]', name: 'ratios', type: 'uint256[]' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint64', name: 'limit', type: 'uint64' },
    ],
    name: 'createPriceFundAll',
    outputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'dataUrl', type: 'string' },
      { internalType: 'uint64', name: 'startDate', type: 'uint64' },
      { internalType: 'uint64', name: 'endDate', type: 'uint64' },
      { internalType: 'uint256[]', name: 'bounties', type: 'uint256[]' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint64', name: 'limit', type: 'uint64' },
    ],
    name: 'createPriceFundBounty',
    outputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'fundCampaign',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
    ],
    name: 'getBounties',
    outputs: [
      { internalType: 'uint256[]', name: 'bounty', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idProm', type: 'bytes32' },
    ],
    name: 'getGains',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
      { internalType: 'uint8', name: 'typeSN', type: 'uint8' },
      { internalType: 'string', name: 'idPost', type: 'string' },
      { internalType: 'string', name: 'idUser', type: 'string' },
    ],
    name: 'getIsUsed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
    ],
    name: 'getProms',
    outputs: [
      { internalType: 'bytes32[]', name: 'cproms', type: 'bytes32[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
    ],
    name: 'getRatios',
    outputs: [
      { internalType: 'uint8[]', name: 'types', type: 'uint8[]' },
      {
        internalType: 'uint256[]',
        name: 'likeRatios',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'shareRatios',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'viewRatios',
        type: 'uint256[]',
      },
      { internalType: 'uint256[]', name: 'limits', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
    ],
    name: 'getRemainingFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idProm', type: 'bytes32' },
    ],
    name: 'getResults',
    outputs: [
      { internalType: 'bytes32[]', name: 'creq', type: 'bytes32[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'influencerProms',
    outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'isAlreadyUsed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'bool', name: 'accepted', type: 'bool' },
    ],
    name: 'modToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'oracle',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      { internalType: 'address payable', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'proms',
    outputs: [
      { internalType: 'address', name: 'influencer', type: 'address' },
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
      { internalType: 'bool', name: 'isAccepted', type: 'bool' },
      { internalType: 'bool', name: 'isPayed', type: 'bool' },
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        internalType: 'struct campaign.Fund',
        name: 'funds',
        type: 'tuple',
      },
      { internalType: 'uint8', name: 'typeSN', type: 'uint8' },
      { internalType: 'uint256', name: 'appliedDate', type: 'uint256' },
      { internalType: 'uint64', name: 'abosNumber', type: 'uint64' },
      { internalType: 'string', name: 'idPost', type: 'string' },
      { internalType: 'string', name: 'idUser', type: 'string' },
      { internalType: 'uint64', name: 'nbResults', type: 'uint64' },
      { internalType: 'bytes32', name: 'prevResult', type: 'bytes32' },
      { internalType: 'uint256', name: 'lastHarvest', type: 'uint256' },
      { internalType: 'uint256', name: 'validate', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'receiveToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'results',
    outputs: [
      { internalType: 'bytes32', name: 'idProm', type: 'bytes32' },
      { internalType: 'uint64', name: 'likes', type: 'uint64' },
      { internalType: 'uint64', name: 'shares', type: 'uint64' },
      { internalType: 'uint64', name: 'views', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'a', type: 'address' }],
    name: 'setOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'newTreasory',
        type: 'address',
      },
    ],
    name: 'transferTreasoryOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idRequest', type: 'bytes32' },
      { internalType: 'uint64', name: 'likes', type: 'uint64' },
      { internalType: 'uint64', name: 'shares', type: 'uint64' },
      { internalType: 'uint64', name: 'views', type: 'uint64' },
    ],
    name: 'update',
    outputs: [{ internalType: 'bool', name: 'ok', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idProm', type: 'bytes32' },
    ],
    name: 'updateBounty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idProm', type: 'bytes32' },
      { internalType: 'uint256', name: 'nbAbos', type: 'uint256' },
    ],
    name: 'updateBounty',
    outputs: [{ internalType: 'bool', name: 'ok', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
    ],
    name: 'updateCampaignStats',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idProm', type: 'bytes32' },
    ],
    name: 'updatePromStats',
    outputs: [
      { internalType: 'bytes32', name: 'requestId', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'idCampaign', type: 'bytes32' },
      { internalType: 'uint8', name: 'typeSN', type: 'uint8' },
      { internalType: 'string', name: 'idPost', type: 'string' },
      { internalType: 'string', name: 'idUser', type: 'string' },
      { internalType: 'uint64', name: 'abosNumber', type: 'uint64' },
      { internalType: 'address', name: 'ownerLink', type: 'address' },
      {
        internalType: 'bytes32',
        name: '_hashedMessage',
        type: 'bytes32',
      },
      { internalType: 'uint8', name: '_v', type: 'uint8' },
      { internalType: 'bytes32', name: '_r', type: 'bytes32' },
      { internalType: 'bytes32', name: '_s', type: 'bytes32' },
    ],
    name: 'validateProm',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
const tokenabi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    name: 'transfer',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_value', type: 'uint256' },
      { name: '_data', type: 'bytes' },
    ],
    name: 'tokenFallback',
    outputs: [],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'val', type: 'uint256' },
    ],
    name: 'transferToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'tokenOwner',
        type: 'address',
      },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'tokens', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
];
//let pattContact = /^0x[a-fA-F0-9]{40}$|^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
let pattContact = /^0x[a-fA-F0-9]{40}$|^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$|T[A-Za-z1-9]{33}$/;
let tronPattContact = /T[A-Za-z1-9]{33}$/;

let pattEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let pattNetwork =
  '^(https?:\\/\\/(www\\.)){1}([0-9A-Za-z-\\.@:%_+~&#=]+)+((\\.(com))+)(/(.)*)?(\\?(.)*)?';
let pattMedia =
  /(?:(?:https?:\/\/)?(?:www\.)?)?(?:(?:(?:facebook|instagram|linkedin|twitter|youtube|threads)\.(?:com|li)\/)?[A-Za-z0-9]+\/?(?:[\/?#]\S+)?)/;
// '^(https?:\\/\\/){1}([0-9A-Za-z-\\.@:%_+~#&=]+)+((\\.(com|be))+)(/(.)*)?(\\?(.)*)?';
let urlValidator =
  '^(?:(?:http(?:s)?|ftp)://)(?:\\S+(?::(?:\\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\\d){2,5})?(?:/(?:\\S)*)?$';
let pattLinks = /<|>|[</]|\s|[%]|[?]|[!]|[=]|[_]|[-]|[&]|[]/g;
//let pattPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{0,}/
let regexTwitter =
  'https?://(.*.)?twitter.com/([A-z 0-9 _ - - . @ : % ? + ~ # = ]+)/?';
let regexFacebook =
  'https?://(.*.)?facebook.com/([A-z 0-9 _ - - . @ : % ? + ~ # = ]+)/?';
let regexYoutube =
  'https?://(.*.)?//(youtube.com)/([A-z 0-9 _ - - . @ : % ? + ~ # = ]+)/?';
//"https?://(.*.)?\\(youtube.con)/([A-z 0-9 _ - - . @ : % ? + ~ # = ]+)/?";

let regexInstagram =
  'https?://(.*.)?instagram.com/([A-z 0-9 _ - -. @ : % ? + ~ # = ]+)/?';
let regexTiktok =
  'https?://(.*.)?tiktok.com/([A-z 0-9 _ - - . @ : % ? + ~ # = ]+)/?';
let regexLinkedin =
  'https?://(.*.)?linkedin.com/([A-z 0-9 _ - - . @ : % ? + ~ # = ]+)/?';
let regexNetwork =
  'https?://(.*.)?[linkedin|twitter|facebook|instagram|tiktok|youtube].com/([A-z 0-9 _ - - . @ : % ? + ~ # = ]+)/?';
let pattPassword =
  /* /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#-_])[A-Za-z\d@$!%*?&#]{0,}/;  */
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)^(?!.* )(?=.*[@[$()!%*=+?&#^;,:.~/|<>{}-])[A-Za-z\d@[$()!%*=+?&#^;,:.~/|<>{}-]{0,}/;

let cryptoNetwork: any = [];

let networkList: {network: string,label: string,logo: string}[] = [
  {network:"BNB Smart Chain" , label: "bsc" ,logo: ""  },
  {network:"Ethereum" , label: "erc20" ,logo: ""  },
  {network:"Polygon" , label: "polygon" ,logo: ""  },
  {network:"BitTorrent" , label: "btt" ,logo: ""  },
  {network:"Arthera", label:"arthera", logo:""}
];

// let networkList: {network: string,label: string,logo: string}[] = [
//   {network:"BNB Smart Chain" , label: "bsc" ,logo: "assets/Images/bsc.svg"  },
//     {network:"Ethereum" , label: "erc20" ,logo: "assets/Images/erc20.svg"  },
//     {network:"Polygon" , label: "polygon" ,logo: "assets/Images/polygon.svg"  },
//     {network:"BitTorrent" , label: "btt" ,logo: "assets/Images/btt.svg"   }
//   ];
let cryptoList: { symbol: string; network: string; logo: string }[] = [
  { symbol: 'SATT', network: 'bep20', logo: 'SATTBEP20.svg' },
  { symbol: 'SATT', network: 'erc20', logo: 'SATT2.svg' },
  { symbol: 'ETH', network: 'erc20', logo: 'ETH.svg' },
  { symbol: 'BTC', network: 'btc', logo: 'BTC.svg' },
  { symbol: 'DAI', network: 'erc20', logo: 'DAI.svg' },
  { symbol: 'BNB', network: 'bep20', logo: 'BNB.svg' },
  { symbol: 'MATIC', network: 'polygon', logo: 'MATIC.svg' },
  { symbol: 'MAKER', network: 'erc20', logo: 'MKR.svg' },
  { symbol: 'TETHER', network: 'erc20', logo: 'USDT.svg' },
  { symbol: 'CAKE', network: 'bep20', logo: 'CAKE.svg' },
  { symbol: 'TRX', network: 'tron', logo: 'TRX.svg' }

  // { value: 'USDT', logo: 'USDT.svg' }
  //  {value :"BNB"},
  // {value: "SATT"},
  //  { value: "SATTBEP20"},
  //  { value: "WSATT"},
  //  { value: "CAKE"},
  //  {value: "Maker" },
];

let dataList = [
  { value: 'PHP', symbol: '₱' },
  { value: 'GEL', symbol: 'ლ' },
  { value: 'QAR', symbol: '﷼' },
  { value: 'MDL', symbol: 'lei' },
  { value: 'COP', symbol: '$' },
  { value: 'ARS', symbol: '$' },
  { value: 'NAD', symbol: '$' },
  { value: 'AZN', symbol: 'AZN' },
  { value: 'CRC', symbol: '₡' },
  { value: 'CLP', symbol: '$' },
  { value: 'UYU', symbol: '$U' },
  { value: 'CNY', symbol: '¥' },
  { value: 'XAF', symbol: 'FCFA' },
  { value: 'ANG', symbol: 'ƒ' },
  { value: 'CRC', symbol: '₡' },
  { value: 'UZS', symbol: 'лв' },
  { value: 'AED', symbol: 'د.إ' },
  { value: 'IDR', symbol: 'Rp' },
  { value: 'DOP', symbol: 'RD$' },
  { value: 'KZT', symbol: '₸' },
  { value: 'VND', symbol: '₫' },
  { value: 'MXN', symbol: '$' },
  { value: 'RON', symbol: 'lei' },
  { value: 'MAD', symbol: 'MAD' },
  { value: 'BRL', symbol: 'R$' },
  { value: 'BGN', symbol: 'лв' },
  { value: 'TWD', symbol: 'NT$' },
  { value: 'SGD', symbol: 'S$' },
  { value: 'NGN', symbol: '₦' },
  { value: 'MYR', symbol: 'RM' },
  { value: 'HKD', symbol: '$' },
  { value: 'UAH', symbol: '₴' },
  { value: 'INR', symbol: '₹' },
  { value: 'ILS', symbol: '₪' },
  { value: 'HUF', symbol: 'Ft' },
  { value: 'ZAR', symbol: 'R' },
  { value: 'TRY', symbol: '₺' },
  { value: 'SEK', symbol: 'kr' },
  { value: 'PLN', symbol: 'zł' },
  { value: 'NZD', symbol: '$' },
  { value: 'NOK', symbol: 'kr' },
  { value: 'DKK', symbol: 'kr' },
  { value: 'CZK', symbol: 'Kč' },
  { value: 'CHF', symbol: 'CHF' },
  { value: 'KRW', symbol: '₩' },
  { value: 'USD', symbol: '$' },
  { value: 'JPY', symbol: '¥' },
  { value: 'EUR', symbol: '€' }
];

cryptoNetwork['SATT'] =
  cryptoNetwork['WSATT'] =
  cryptoNetwork['ETH'] =
  cryptoNetwork['DAI'] =
  cryptoNetwork['OMG'] =
  cryptoNetwork['USDC'] =
  cryptoNetwork['ZRX'] =
  cryptoNetwork['MKR'] =
    'ERC20';
cryptoNetwork['(smart chain)'] =
  cryptoNetwork['SATTBEP20'] =
  cryptoNetwork['BUSD'] =
    'BEP20';
cryptoNetwork['SATT'] =
  cryptoNetwork['WSATT'] =
  cryptoNetwork['ETH'] =
  cryptoNetwork['DAI'] =
  cryptoNetwork['OMG'] =
  cryptoNetwork['USDC'] =
  cryptoNetwork['ZRX'] =
  cryptoNetwork['MKR'] =
    'ERC20';
cryptoNetwork['(smart chain)'] =
  cryptoNetwork['SATTBEP20'] =
  cryptoNetwork['BNB'] =
  cryptoNetwork['BUSD'] =
    'BEP20';
cryptoNetwork['SATTPOLYGON'] = 'POLYGON';
cryptoNetwork['SATTBTT'] = 'BTT';
cryptoNetwork['BTT'] = 'BTT';
cryptoNetwork['TRX'] = 'TRON';
cryptoNetwork['SATTTRON'] = 'TRON';

var ListTokens: { [key: string]: { [key: string]: any } } = {
  SATT: {
    name: 'SATT',
    contract: env.addresses.smartContracts.SATT_TOKENERC20,
    decimals: new Big('10').pow(18),
    logo: 'SATT.svg',
    type: 'erc20',
    symbole: 'SATT'
  },
  SATTBEP20: {
    name: 'SATTBEP20',
    contract: env.addresses.smartContracts.SATT_TOKENBEP20,
    decimals: new Big('10').pow(18),
    logo: 'SATT.svg',
    type: 'bep20',
    symbole: 'SATTBEP20'
  },
  // SATTPOLYGON: {
  //   name: 'SATTPOLYGON',
  //   contract: env.addresses.smartContracts.SATT_TOKENPOLYGON,
  //   decimals: new Big('10').pow(18),
  //   logo: 'SATT.svg',
  //   type: 'POLYGON',
  //   symbole: 'SATTPOLYGON'
  // },
  SATTBTT: {
    name: 'SATTBTT',
    contract: env.addresses.smartContracts.SATT_TOKENBTT,
    decimals: new Big('10').pow(18),
    logo: 'SATT.svg',
    type: 'BTT',
    symbole: 'SATTBTT'
  },
  SATTTRON: {
    name: 'SATTTRON',
    contract: env.addresses.smartContracts.SATT_TOKENTRON,
    decimals: new Big('10').pow(6),
    logo: 'SATT.svg',
    type: 'BTT',
    symbole: 'SATTTRON'
  },
  WSATT: {
    name: 'WSATT',
    contract: '0x70A6395650b47D94A77dE4cFEDF9629f6922e645',
    decimals: new Big('10').pow(18),
    logo: 'WSATT.svg',
    type: 'erc20',
    symbole: 'WSATT'
  },
  ETH: {
    name: 'ETH',
    contract: null,
    decimals: new Big('10').pow(18),
    logo: 'ETH.svg',
    type: 'erc20',
    symbole: 'ETH'
  },
  TRX: {
    name: 'TRX',
    contract: 'TRX',
    decimals: new Big('10').pow(6),
    logo: 'TRX.svg',
    type: 'TRON',
    symbole: 'TRX'
  },
  BTC: {
    name: 'BTC',
    contract: null,
    decimals: new Big('10').pow(8),
    logo: 'BTC.svg',
    type: 'btc',
    symbole: 'BTC'
  },
  BNB: {
    name: 'BNB',
    contract: null,
    decimals: new Big('10').pow(18),
    logo: 'BNB.svg',
    type: 'bep20',
    symbole: 'BNB'
  },
  DAI: {
    name: 'DAI',
    contract: env.addresses.smartContracts.DAI,
    decimals: new Big('10').pow(18),
    logo: 'DAI.svg',
    type: 'erc20',
    symbole: 'DAI'
  },
  OMG: {
    name: 'OMG',
    contract: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
    decimals: new Big('10').pow(18),
    logo: 'OMG.svg',
    type: 'erc20',
    symbole: 'OMG'
  },

  USDC: {
    name: 'USDC',
    contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: new Big('10').pow(6),
    logo: 'USD.svg',
    type: 'erc20',
    symbole: 'USDC'
  },
  ZRX: {
    name: 'ZRX',
    contract: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    decimals: new Big('10').pow(18),
    logo: 'ZRX.svg',
    type: 'erc20',
    symbole: 'ZRX'
  },
  MKR: {
    name: 'Maker',
    contract: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    decimals: new Big('10').pow(18),
    logo: 'MKR.svg',
    type: 'erc20',
    symbole: 'MKR'
  },
  USDT: {
    name: 'USDT',
    contract: env.addresses.smartContracts.TETHER_TOKENERC20,
    decimals: new Big('10').pow(6),
    logo: 'USDT.svg',
    type: 'erc20',
    symbole: 'USDT'
  },
  BUSD: {
    name: 'BUSD',
    contract: env.addresses.smartContracts.BUSD,
    decimals: new Big('10').pow(18),
    logo: 'BUSD.svg',
    type: 'bep20',
    symbole: 'BUSD'
  },
  CAKE: {
    name: 'CAKE',
    contract: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    decimals: new Big('10').pow(18),
    logo: 'CAKE.svg',
    type: 'bep20',
    symbole: 'CAKE'
  },
  MATIC: {
    name: 'MATIC',
    contract: null,
    decimals: new Big('10').pow(18),
    logo: 'MATIC.svg',
    type: 'POLYGON',
    symbole: 'MATIC'
  },
  BTT: {
    name: 'BTT',
    contract: null,
    decimals: new Big('10').pow(18),
    logo: 'btt.svg',
    type: 'BTT',
    symbole: 'BTT'
  }
};

var ListTokensPerso: { [key: string]: { [key: string]: any } } = {
  DOGE: {
    name: 'Dogecoin',
    contract: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
    decimals: 18,
    type: 'BEP20',
    symbole: 'DOGE'
  },
  USDC: {
    name: 'USDC',
    contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    type: 'ERC20',
    symbole: 'USDC'
  },
  UNI: {
    name: 'Uniswap',
    contract: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    decimals: 18,
    type: 'ERC20',
    symbole: 'UNI'
  },
  AAVE: {
    name: 'Aave',
    contract: '0x763bb5e8223164e9572c6fd6a33e93421f272217',
    decimals: 18,
    type: 'ERC20',
    symbole: 'AAVE'
  },
  DOT: {
    name: 'Polkadot',
    contract: '0xe2eeeaa527f78ee845eb46355210fbed77e92c47',
    decimals: 18,
    type: 'BEP20',
    symbole: 'DOT'
  }
};

const arrayCountries = [
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BE', name: 'Belgium' },
  {
    code: 'BF',
    name: 'Burkina Faso'
  },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BB', name: 'Barbados' },
  {
    code: 'WF',
    name: 'Wallis and Futuna'
  },
  { code: 'BL', name: 'Saint Barthelemy' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BO', name: 'Bolivia' },
  {
    code: 'BH',
    name: 'Bahrain'
  },
  { code: 'BI', name: 'Burundi' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BT', name: 'Bhutan' },
  {
    code: 'JM',
    name: 'Jamaica'
  },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BW', name: 'Botswana' },
  { code: 'WS', name: 'Samoa' },
  {
    code: 'BQ',
    name: 'Bonaire Saint Eustatius and Saba '
  },
  { code: 'BR', name: 'Brazil' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'JE', name: 'Jersey' },
  {
    code: 'BY',
    name: 'Belarus'
  },
  { code: 'BZ', name: 'Belize' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  {
    code: 'RS',
    name: 'Serbia'
  },
  { code: 'TL', name: 'East Timor' },
  { code: 'RE', name: 'Reunion' },
  { code: 'TM', name: 'Turkmenistan' },
  {
    code: 'TJ',
    name: 'Tajikistan'
  },
  { code: 'RO', name: 'Romania' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'GW', name: 'Guinea-Bissau' },
  {
    code: 'GU',
    name: 'Guam'
  },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
  {
    code: 'GR',
    name: 'Greece'
  },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'JP', name: 'Japan' },
  {
    code: 'GY',
    name: 'Guyana'
  },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'GE', name: 'Georgia' },
  {
    code: 'GD',
    name: 'Grenada'
  },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'GA', name: 'Gabon' },
  { code: 'SV', name: 'El Salvador' },
  {
    code: 'GN',
    name: 'Guinea'
  },
  { code: 'GM', name: 'Gambia' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GI', name: 'Gibraltar' },
  {
    code: 'GH',
    name: 'Ghana'
  },
  { code: 'OM', name: 'Oman' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'JO', name: 'Jordan' },
  {
    code: 'HR',
    name: 'Croatia'
  },
  { code: 'HT', name: 'Haiti' },
  { code: 'HU', name: 'Hungary' },
  { code: 'HK', name: 'Hong Kong' },
  {
    code: 'HN',
    name: 'Honduras'
  },
  { code: 'HM', name: 'Heard Island and McDonald Islands' },
  { code: 'VE', name: 'Venezuela' },
  {
    code: 'PR',
    name: 'Puerto Rico'
  },
  { code: 'PS', name: 'Palestinian Territory' },
  { code: 'PW', name: 'Palau' },
  { code: 'PT', name: 'Portugal' },
  {
    code: 'SJ',
    name: 'Svalbard and Jan Mayen'
  },
  { code: 'PY', name: 'Paraguay' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'PA', name: 'Panama' },
  {
    code: 'PF',
    name: 'French Polynesia'
  },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PE', name: 'Peru' },
  { code: 'PK', name: 'Pakistan' },
  {
    code: 'PH',
    name: 'Philippines'
  },
  { code: 'PN', name: 'Pitcairn' },
  { code: 'PL', name: 'Poland' },
  { code: 'PM', name: 'Saint Pierre and Miquelon' },
  {
    code: 'ZM',
    name: 'Zambia'
  },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'EE', name: 'Estonia' },
  { code: 'EG', name: 'Egypt' },
  {
    code: 'ZA',
    name: 'South Africa'
  },
  { code: 'EC', name: 'Ecuador' },
  { code: 'IT', name: 'Italy' },
  { code: 'VN', name: 'Vietnam' },
  {
    code: 'SB',
    name: 'Solomon Islands'
  },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZW', name: 'Zimbabwe' },
  {
    code: 'SA',
    name: 'Saudi Arabia'
  },
  { code: 'ES', name: 'Spain' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'ME', name: 'Montenegro' },
  {
    code: 'MD',
    name: 'Moldova'
  },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MF', name: 'Saint Martin' },
  { code: 'MA', name: 'Morocco' },
  {
    code: 'MC',
    name: 'Monaco'
  },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'ML', name: 'Mali' },
  {
    code: 'MO',
    name: 'Macao'
  },
  { code: 'MN', name: 'Mongolia' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MK', name: 'Macedonia' },
  {
    code: 'MU',
    name: 'Mauritius'
  },
  { code: 'MT', name: 'Malta' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MV', name: 'Maldives' },
  {
    code: 'MQ',
    name: 'Martinique'
  },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'MS', name: 'Montserrat' },
  {
    code: 'MR',
    name: 'Mauritania'
  },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
  {
    code: 'MY',
    name: 'Malaysia'
  },
  { code: 'MX', name: 'Mexico' },
  { code: 'IL', name: 'Israel' },
  { code: 'FR', name: 'France' },
  {
    code: 'IO',
    name: 'British Indian Ocean Territory'
  },
  { code: 'SH', name: 'Saint Helena' },
  { code: 'FI', name: 'Finland' },
  { code: 'FJ', name: 'Fiji' },
  {
    code: 'FK',
    name: 'Falkland Islands'
  },
  { code: 'FM', name: 'Micronesia' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'NI', name: 'Nicaragua' },
  {
    code: 'NL',
    name: 'Netherlands'
  },
  { code: 'NO', name: 'Norway' },
  { code: 'NA', name: 'Namibia' },
  { code: 'VU', name: 'Vanuatu' },
  {
    code: 'NC',
    name: 'New Caledonia'
  },
  { code: 'NE', name: 'Niger' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'NG', name: 'Nigeria' },
  {
    code: 'NZ',
    name: 'New Zealand'
  },
  { code: 'NP', name: 'Nepal' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NU', name: 'Niue' },
  {
    code: 'CK',
    name: 'Cook Islands'
  },
  { code: 'XK', name: 'Kosovo' },
  { code: 'CI', name: 'Ivory Coast' },
  { code: 'CH', name: 'Switzerland' },
  {
    code: 'CO',
    name: 'Colombia'
  },
  { code: 'CN', name: 'China' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CL', name: 'Chile' },
  {
    code: 'CC',
    name: 'Cocos Islands'
  },
  { code: 'CA', name: 'Canada' },
  { code: 'CG', name: 'Republic of the Congo' },
  {
    code: 'CF',
    name: 'Central African Republic'
  },
  { code: 'CD', name: 'Democratic Republic of the Congo' },
  { code: 'CZ', name: 'Czech Republic' },
  {
    code: 'CY',
    name: 'Cyprus'
  },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CW', name: 'Curacao' },
  {
    code: 'CV',
    name: 'Cape Verde'
  },
  { code: 'CU', name: 'Cuba' },
  { code: 'SZ', name: 'Swaziland' },
  { code: 'SY', name: 'Syria' },
  {
    code: 'SX',
    name: 'Sint Maarten'
  },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'SS', name: 'South Sudan' },
  {
    code: 'SR',
    name: 'Suriname'
  },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  {
    code: 'KM',
    name: 'Comoros'
  },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'KR', name: 'South Korea' },
  {
    code: 'SI',
    name: 'Slovenia'
  },
  { code: 'KP', name: 'North Korea' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'SN', name: 'Senegal' },
  {
    code: 'SM',
    name: 'San Marino'
  },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'KZ', name: 'Kazakhstan' },
  {
    code: 'KY',
    name: 'Cayman Islands'
  },
  { code: 'SG', name: 'Singapore' },
  { code: 'SE', name: 'Sweden' },
  { code: 'SD', name: 'Sudan' },
  {
    code: 'DO',
    name: 'Dominican Republic'
  },
  { code: 'DM', name: 'Dominica' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DK', name: 'Denmark' },
  {
    code: 'VG',
    name: 'British Virgin Islands'
  },
  { code: 'DE', name: 'Germany' },
  { code: 'YE', name: 'Yemen' },
  { code: 'DZ', name: 'Algeria' },
  {
    code: 'US',
    name: 'United States'
  },
  { code: 'UY', name: 'Uruguay' },
  { code: 'YT', name: 'Mayotte' },
  {
    code: 'UM',
    name: 'United States Minor Outlying Islands'
  },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'LA', name: 'Laos' },
  {
    code: 'TV',
    name: 'Tuvalu'
  },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TR', name: 'Turkey' },
  {
    code: 'LK',
    name: 'Sri Lanka'
  },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LV', name: 'Latvia' },
  { code: 'TO', name: 'Tonga' },
  {
    code: 'LT',
    name: 'Lithuania'
  },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LS', name: 'Lesotho' },
  {
    code: 'TH',
    name: 'Thailand'
  },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'TG', name: 'Togo' },
  { code: 'TD', name: 'Chad' },
  {
    code: 'TC',
    name: 'Turks and Caicos Islands'
  },
  { code: 'LY', name: 'Libya' },
  { code: 'VA', name: 'Vatican' },
  {
    code: 'VC',
    name: 'Saint Vincent and the Grenadines'
  },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'AD', name: 'Andorra' },
  {
    code: 'AG',
    name: 'Antigua and Barbuda'
  },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'VI', name: 'U.S. Virgin Islands' },
  {
    code: 'IS',
    name: 'Iceland'
  },
  { code: 'IR', name: 'Iran' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AL', name: 'Albania' },
  {
    code: 'AO',
    name: 'Angola'
  },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AR', name: 'Argentina' },
  {
    code: 'AU',
    name: 'Australia'
  },
  { code: 'AT', name: 'Austria' },
  { code: 'AW', name: 'Aruba' },
  { code: 'IN', name: 'India' },
  {
    code: 'AX',
    name: 'Aland Islands'
  },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'IE', name: 'Ireland' },
  { code: 'ID', name: 'Indonesia' },
  {
    code: 'UA',
    name: 'Ukraine'
  },
  { code: 'QA', name: 'Qatar' },
  { code: 'MZ', name: 'Mozambique' }
];
const youtubeThumbnail = 'https://img.youtube.com/vi/';
let socialMedia: any = [];
socialMedia[1] = 'facebook_image_media.svg';
socialMedia[2] = 'Youtube.svg';
socialMedia[3] = 'Insta.svg';
socialMedia[4] = 'twitter-icon.svg';
let arrayNetworks = [
  { value: 'fbLink', name: 'Facebook' },
  { value: 'instagramLink', name: 'Instagram' },
  { value: 'linkedinLink', name: 'Linkedin' },
  { value: 'youtubeLink', name: 'Youtube' },
  { value: 'twitterLink', name: 'Twitter' },
  { value: 'tikTokLink', name: 'TikTok' }
];
let interestsList = [
  { id: '1', name: 'animals', checked: false },
  { id: '2', name: 'food', checked: false },
  { id: '3', name: 'beauty', checked: false },

  { id: '5', name: 'decoration', checked: false }, ////
  { id: '6', name: 'environment', checked: false }, ////

  { id: '7', name: 'movies', checked: false },
  { id: '8', name: 'finance', checked: false },
  { id: '9', name: 'games', checked: false },
  { id: '10', name: 'music', checked: false },
  { id: '11', name: 'technologies', checked: false },

  { id: '12', name: 'health', checked: false }, ////
  { id: '13', name: 'parties', checked: false }, ////

  { id: '14', name: 'sport', checked: false },
  { id: '15', name: 'travel', checked: false },

  { id: '16', name: 'reading', checked: false },

  //{ id: "17", name: "theater" , checked: false },

  { id: '18', name: 'social-networking', checked: false }, ////
  { id: '19', name: 'volounteer-work', checked: false }, ////
  { id: '20', name: 'creative-hobbies', checked: false }, ////

  { id: '21', name: 'photography', checked: false },

  { id: '4', name: 'other', checked: false },
  // { id: "22", name: "dance" , checked: false },
  // { id: "2", DataList:  name: "kitchen" , checked: false },
  // { id: "22", name: "painting" , checked: false },
  // { id: "2", name: "sewing" , checked: false },
  { id: '17', name: 'therter', checked: false }
  // { id: "2", name: "culture" , checked: false },
];
const GazConsumed = 21000; // this is the amount of gaz consumed for a transactions
const GazConsumedByCampaign = 60000;
function convertUnix(unix_timestamp: any) {
  return new Date(unix_timestamp * 1000).toLocaleDateString('en-US');
}
export {
  youtubeThumbnail,
  convertUnix,
  socialMedia,
  cryptoNetwork,
  sattUrl,
  ipfsURL,
  walletUrl,
  networkList,
  arrayCountries,
  GazConsumed,
  GazConsumedByCampaign,
  campaignSmartContractERC20,
  campaignSmartContractBEP20,
  campaignSmartContractPOLYGON,
  campaignSmartContractBTT,
  campaignSmartContractTRON,
  pattContact,
  pattEmail,
  pattNetwork,
  pattPassword,
  pattMedia,
  pattLinks,
  ListTokens,
  ListTokensPerso,
  arrayNetworks,
  interestsList,
  regexTwitter,
  regexFacebook,
  regexYoutube,
  regexInstagram,
  regexTiktok,
  regexLinkedin,
  regexNetwork,
  urlValidator,
  id_campaign_to_participate,
  abi,
  tokenabi,
  bscan,
  etherscan,
  polygonscan,
  bttscan,
  polygonscanAddr,
  bttscanAddr,
  dataList,
  cryptoList,
  tronscanAddr,
  tronScan,
  tronPattContact,GAS_LIMIT
};
