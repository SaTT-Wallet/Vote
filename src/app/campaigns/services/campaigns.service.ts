import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import {
  campaignSmartContractBEP20,
  campaignSmartContractBTT,
  campaignSmartContractERC20,
  campaignSmartContractPOLYGON,
  contractAbi,
  contractTokenAbi,
  GAS_LIMIT,
} from '@config/atn.config';
import detectEthereumProvider from '@metamask/detect-provider';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { environment } from '@environments/environment';
import Cookies from 'js-cookie';
import web3 from 'web3/lib/commonjs/web3';
import { config } from 'process';
import { campaignABI } from '../../abi/campaignABI';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  constructor(
    public tokenStorageService: TokenStorageService,
    public campaignHttpApiService: CampaignHttpApiService
  ) {}

  dateToUnixTimestamp(dateStr: string): number {
    // Parse the input date string
    const date = new Date(dateStr);

    // Convert to Unix timestamp
    const unixTimestamp = Math.floor(date.getTime() / 1000);

    return unixTimestamp;
  }

  async createPriceFundAll(data: any) {
    try {
      const inputData = [
        'https://ropsten.etherscan.io/token/0x2bef0d7531f0aae08adc26a0442ba8d0516590d0', // dataUrl
        this.dateToUnixTimestamp(data.startDate), // startDate
        this.dateToUnixTimestamp(data.endDate), // endDate
        [
          '100000000000000',
          '100000000000000',
          '100000000000000',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
        ], // ratios
        data.currency.addr, // token
        data.initialBudget, // amount
        100,
      ];

      const provider = await detectEthereumProvider();
      if (provider) {
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();

        const contractAddresses = {
          Ethereum: campaignSmartContractERC20,
          'BNB Smart Chain': campaignSmartContractBEP20,
          Polygon: campaignSmartContractPOLYGON,
          BitTorrent: campaignSmartContractBTT,
        } as { [key: string]: string };

        let networkSelected = Cookies.get('networkSelected');
        let contractAddress;

        if (
          networkSelected &&
          contractAddresses.hasOwnProperty(networkSelected)
        ) {
          contractAddress = contractAddresses[networkSelected];

          if (contractAddress) {
            const contract = new ethers.Contract(
              contractAddress,
              contractAbi,
              signer
            );

            const contractToken = new ethers.Contract(
              data.currency.addr,
              contractTokenAbi,
              signer
            );

            const desiredAllowance = ethers.utils.parseEther(
              data.initialBudget
            );

            const approveTx = await contractToken.approve(
              this.tokenStorageService.getIdWallet(),
              desiredAllowance
            );
            await approveTx.wait();
            const gasPrice = await ethersProvider.getGasPrice();

            const tx = await contract.createPriceFundAll(...inputData, {
              from: this.tokenStorageService.getIdWallet(),
              gas: GAS_LIMIT,
              gasPrice: gasPrice,
            });

            const receipt = await tx.wait();
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getGain(data: any): Promise<any>  {
    try {
      const contractAddresses = {
        Ethereum: campaignSmartContractERC20,
        'BNB Testnet': campaignSmartContractBEP20,
        'BNB Smart Chain': campaignSmartContractBEP20,
        Polygon: campaignSmartContractPOLYGON,
        BitTorrent: campaignSmartContractBTT,
      } as { [key: string]: string };
  
      const provider = await detectEthereumProvider();
      if (!provider) {
        throw new Error('Ethereum provider not detected.');
      }
  
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
   
      let networkSelected = Cookies.get('networkSelected');
      console.log(networkSelected);
      if (!networkSelected || !contractAddresses[networkSelected!]) {
        throw new Error('Invalid or missing network selection.');
      }
  
      const contractAddress = contractAddresses[networkSelected!];

      const abiString = JSON.stringify(campaignABI);
      const parsedABI = JSON.parse(abiString);
      const ctr = new ethers.Contract(contractAddress, parsedABI, signer);
  
      const gas = 200000;
      const gasPrice = await ethersProvider.getGasPrice();
  
      const response1 = await this.campaignHttpApiService.checkHarvestExternal(data.hash, data.campaignHash).toPromise();
      console.log(response1);
  
      const transactionPromise =await ctr.updatePromStats(data.hash, {
        from: this.tokenStorageService.getIdWallet(),
        gasLimit: gas,
        gasPrice: gasPrice,
      });
      const transactionReceipt = await transactionPromise.wait();
      const events = transactionReceipt.events;
      console.log(events);
  
      const response2 = await this.campaignHttpApiService.externalAnswerExternal(data.hash, data.campaignHash, events).toPromise();
      console.log(response2);
  
      const receiptgain1 = await ctr.getGains(data.hash, {
        from: this.tokenStorageService.getIdWallet(),
        gasLimit: gas,
        gasPrice: gasPrice,
      });
  
      const response3 = await this.campaignHttpApiService.recoverEarningsExternal(data.hash, data.campaignHash, response2, receiptgain1).toPromise();
      console.log(response3);
  

      
      return response3
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  
}
