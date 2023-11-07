import { Injectable } from '@angular/core';
import snapshot from '@snapshot-labs/snapshot.js';
import { Web3Provider } from '@ethersproject/providers';
import { Buffer } from 'buffer';
import { environment as env } from '../../../../environments/environment.prod';
// import { environment as envp } from '../../../../environments/environment.prod';
import Web3 from 'web3';
import axios from 'axios';

declare global {
  interface Window {
    ethereum?: any
  }
}
(<any>window).Buffer = Buffer;

@Injectable({
  providedIn: 'root'
})
export class SnapshotService {
  client = new snapshot.Client712(env.snapshot_hub);
  web3!: Web3Provider;
  account!: string[];
  public ethereum!: any;
  space!: any;
  strategies!: any;
  members!: any;
  admins!: any;
  // block!: any;

  constructor() {
    const { ethereum } = <any>window;
    this.ethereum = ethereum;
    this.init();
  }

  async init() {
    await this.getSpace();
    const chainId = await this.ethereum.request({ method: 'eth_chainId' });
    if (typeof window.ethereum !== 'undefined' && (chainId === env.chainIDDecimal || chainId === env.chainIDHex)) {
      this.web3 = new Web3Provider(window.ethereum);
      this.account = await this.web3.listAccounts();
    } else {
      const httpProvider = new Web3.providers.HttpProvider(env.rpcURL);
      const web3 = new Web3(httpProvider);
      this.web3 = web3.eth as unknown as Web3Provider;
    }
  }

  async getSpace() {
    const response = await axios.post(env.url_subgraph_vote, {
      query: `
        query getSpace{
          space(id: "${env.space_name}") {
            id
            name
            about
            strategies {
              name
              params
            }
            network
            symbol
            members
            admins
          }
        }
  `
    });
    this.space = response.data.data.space;
    this.strategies = this.space.strategies;
    this.admins = this.space.admins;
    this.members = this.space.members;
    // console.log(this.space)
    // console.log(this.strategies)
    // console.log(this.admins)
    // console.log(this.members)
  }


  async getBlockNumber() {
    const blockNumber = await snapshot.utils.getBlockNumber(this.web3);
    // this.block = blockNumber;
    // console.log("web3", this.web3)
    // console.log("snapshot", this.block)
    return blockNumber;
  }

  async createProposal(proposalData: any) {
    this.web3 = new Web3Provider(window.ethereum);
    this.account = await this.web3.listAccounts();
    let response: any = await this.client.proposal(this.web3, this.account[0], {
      from: this.account[0],
      space: env.space_name,
      type: 'single-choice',
      title: proposalData.title,
      body: proposalData.body,
      start: proposalData.start,
      end: proposalData.end,
      choices: proposalData.choices,
      snapshot: proposalData.snapshot,
      discussion: '',
      plugins: JSON.stringify({}),
      app: 'SaTT-Token',
    })
    // console.log(response)
  }

  async castVote(proposalData: any) {
    this.web3 = new Web3Provider(window.ethereum);
    this.account = await this.web3.listAccounts();
    const receipt = await this.client.vote(this.web3, this.account[0], {
      from: this.account[0],
      space: env.space_name,
      proposal: proposalData.id,
      type: 'single-choice',
      choice: proposalData.choiceNumber,
      app: 'SaTT-Token'
    });
    return receipt;
  }

  async getProposal(ipfsHash: string) {
    const proposal = await snapshot.utils.ipfsGet('snapshot.mypinata.cloud', ipfsHash);
    return proposal;
  }

  async getVotingPower(walletID: string) {
    const vp = await snapshot.utils.getVp(walletID, env.chainIDDecimal, this.space.strategies, await this.getBlockNumber(), this.space.id, false);
    // console.log(vp);
    return vp;
  }
}