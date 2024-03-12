import { Injectable } from '@angular/core';
import { ethers, utils } from 'ethers';

import { map, takeUntil } from 'rxjs/operators';
import {
  campaignSmartContractBEP20,
  campaignSmartContractBTT,
  campaignSmartContractERC20,
  campaignSmartContractPOLYGON,
  GAS_LIMIT,
} from '@config/atn.config';
import detectEthereumProvider from '@metamask/detect-provider';
import { TokenStorageService } from '@app/core/services/tokenStorage/token-storage-service.service';
import { environment } from '@environments/environment';
import Cookies from 'js-cookie';
import Web3 from 'web3';
import { config } from 'process';
import { campaignABI } from '../../abi/campaignABI';
import { CampaignHttpApiService } from '@app/core/services/campaign/campaign.service';
import { abi, tokenabi } from './../../config/atn.config';
import { IApiResponse } from '@app/core/types/rest-api-responses';
import { ICampaignResponse } from '@app/core/campaigns-list-response.interface';
import { Campaign } from '@app/models/campaign.model';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  campaignData: any;
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

  convertUnixTimeFormat(dateStr: string): number {
    const milliseconds = parseFloat(dateStr) * 1000; // Convert to milliseconds
    const unixTimestampSeconds = Math.floor(milliseconds / 1000); // Convert to seconds

    return unixTimestampSeconds;
}



  async loadDataCampaign(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.campaignHttpApiService.getOneByIdDraft(id).subscribe(
        (res) => {
          this.campaignData = res;
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  async createPriceFundAll(data: any) {
    try {
      await this.loadDataCampaign(data.id);
      console.log('this.campaignData', this.campaignData);
      data = this.campaignData.data;
      const provider = await detectEthereumProvider();
      if (provider) {
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        data.walletId = Cookies.get('metamaskAddress');
        data.cost_usd = data.cost_usd;
        data.amount = data.cost;
        const contractAddresses = {
          Ethereum: campaignSmartContractERC20,
          'BNB Smart Chain': campaignSmartContractBEP20,
          'BNB Testnet': campaignSmartContractBEP20,
          Polygon: campaignSmartContractPOLYGON,
          BitTorrent: campaignSmartContractBTT,
        } as { [key: string]: string };

        const networkUrl = {
          Ethereum: environment.WEB3_URL,
          'BNB Smart Chain': environment.WEB3_URL_BEP20,
          'BNB Testnet': environment.WEB3_URL_BEP20,
          Polygon: environment.WEB3_URL_POLYGON,
          BitTorrent: environment.WEB3_URL_BTT,
        } as { [key: string]: string };

        let networkSelected = Cookies.get('networkSelected');
        let contractAddress;

        const ratiosArray = data.ratios.reduce(
          (
            outputArray: (string | number)[],
            ratio: {
              reachLimit: any;
              oracle: string;
              like: any;
              share: any;
              view: any;
            }
          ) => {
            if (ratio.oracle === 'facebook') {
              outputArray[0] = +outputArray[0] + +ratio.like;
              outputArray[1] = +outputArray[1] + +ratio.share;
              outputArray[2] = +outputArray[2] + +ratio.view;
              outputArray[3] =
                +outputArray[3] + +(ratio.reachLimit ? ratio.reachLimit : '0');
            }
            if (ratio.oracle === 'twitter') {
              outputArray[4] = +outputArray[4] + +ratio.like;
              outputArray[5] = +outputArray[5] + +ratio.share;
              outputArray[6] = +outputArray[6] + +ratio.view;
              outputArray[7] =
                +outputArray[7] + +(ratio.reachLimit ? ratio.reachLimit : '0');
            }
            if (ratio.oracle === 'linkedin') {
              outputArray[8] = +outputArray[8] + +ratio.like;
              outputArray[9] = +outputArray[9] + +ratio.share;
              outputArray[10] = +outputArray[10] + +ratio.view;
              outputArray[11] =
                +outputArray[11] + +(ratio.reachLimit ? ratio.reachLimit : '0');
            }
            if (ratio.oracle === 'youtube') {
              outputArray[12] = +outputArray[12] + +ratio.like;
              outputArray[13] = +outputArray[13] + +ratio.share;
              outputArray[14] = +outputArray[14] + +ratio.view;
              outputArray[15] =
                +outputArray[15] + +(ratio.reachLimit ? ratio.reachLimit : '0');
            }
            if (ratio.oracle === 'instagram') {
              outputArray[16] = +outputArray[16] + +ratio.like;
              outputArray[17] = +outputArray[17] + +ratio.share;
              outputArray[18] = +outputArray[18] + +ratio.view;
              outputArray[19] =
                +outputArray[19] + +(ratio.reachLimit ? ratio.reachLimit : '0');
            }
            if (ratio.oracle === 'tiktok') {
              outputArray[20] = +outputArray[20] + +ratio.like;
              outputArray[21] = +outputArray[21] + +ratio.share;
              outputArray[22] = +outputArray[22] + +ratio.view;
              outputArray[23] =
                +outputArray[23] + +(ratio.reachLimit ? ratio.reachLimit : '0');
            }

            if (ratio.oracle === 'threads') {
              outputArray[24] = +outputArray[24] + +ratio.like;
              outputArray[25] = +outputArray[25] + +ratio.share;
              outputArray[26] = +outputArray[26] + +ratio.view;
              outputArray[27] =
                +outputArray[27] + +(ratio.reachLimit ? ratio.reachLimit : '0');
            }

            return outputArray;
          },
          Array(28).fill('0')
        );
        const flatRatiosArray = ratiosArray
          .flat()
          .map((value: string | number) => String(value));

        if (
          networkSelected &&
          contractAddresses.hasOwnProperty(networkSelected)
        ) {
          contractAddress = contractAddresses[networkSelected];
          const web3 = new Web3(networkUrl[networkSelected]);

          if (contractAddress) {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const contractToken = new ethers.Contract(
              data.token.addr,
              tokenabi,
              signer
            );

            const desiredAllowance = ethers.utils.parseEther(data.cost);

            const approveTx = await contractToken.approve(
              contractAddresses[networkSelected],
              desiredAllowance
            );
            await approveTx.wait();

            var amount = await contractToken.allowance(
              Cookies.get('metamaskAddress'),
              contractAddresses[networkSelected]
            );

            const gasPrice = web3.utils.toWei('30', 'gwei');

            const createPriceFundPromise = await (
              contract.createPriceFundAll as any
            )(
              'https://ropsten.etherscan.io/token/0x2bef0d7531f0aae08adc26a0442ba8d0516590d0',
              this.convertUnixTimeFormat(data.startDate),
              this.convertUnixTimeFormat(data.endDate),
              flatRatiosArray,
              data.token.addr,
              data.cost,
              data.limit || 100,
              {
                from: Cookies.get('metamaskAddress'),
                gasLimit: GAS_LIMIT.toString(),
                gasPrice: gasPrice.toString(),
              }
            );

            const transactionReceipt = await createPriceFundPromise.wait();
            const events = transactionReceipt.events;
            console.log(events[0].args[0]);

            try {
              if (events.length > 0) {
                data.hash = events[0].args[0];
                console.log('Campaign ID:', data.hash);
                data.userId = Cookies.get('UserId');
                data.hash = this.campaignHttpApiService
                  .createCompaign(data, createPriceFundPromise)
                  .subscribe((res) => console.log(res));
              } else {
                console.error(
                  'No CampaignCreated events found for the transaction.'
                );
              }
            } catch (error) {
              console.error('Error:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getGain(data: any): Promise<any> {
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

      let networkSelected = !!Cookies.get('networkSelected') ? Cookies.get('networkSelected') : 'bsc';
      
      if (!networkSelected || !contractAddresses[networkSelected]) {
        throw new Error('Invalid or missing network selection.');
      }

      const contractAddress = contractAddresses[networkSelected];
      const abiString = JSON.stringify(campaignABI);
      const parsedABI = JSON.parse(abiString);
      const ctr = new ethers.Contract(contractAddress, parsedABI, signer);

      const gas = 200000;
      const gasPrice = await ethersProvider.getGasPrice();

      const response1 = await this.campaignHttpApiService
        .checkHarvestExternal(data.hash, data.campaignHash)
        .toPromise();
      console.log(response1);

      const transactionPromise = await ctr.updatePromStats(data.hash, {
        from: Cookies.get('metamaskAddress'),
        gasLimit: gas,
        gasPrice: gasPrice,
      });
      const transactionReceipt = await transactionPromise.wait();
      const events = transactionReceipt.events;
      console.log(events);

      const response2 = await this.campaignHttpApiService
        .externalAnswerExternal(data.hash, data.campaignHash, events)
        .toPromise();
      console.log(response2);

      const receiptgain1 = await ctr.getGains(data.hash, {
        from: Cookies.get('metamaskAddress'),
        gasLimit: gas,
        gasPrice: gasPrice,
      });

      const response3 = await this.campaignHttpApiService
        .recoverEarningsExternal(
          data.hash,
          data.campaignHash,
          response2,
          receiptgain1
        )
        .toPromise();
      console.log(response3);

      return response3;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async validate(prom: any): Promise<any> {
    try {
      const res: any = await this.campaignHttpApiService
        .getOneLink(prom.id)
        .toPromise();
      const data = res.data[0];
      const contractAddresses = {
        Ethereum: campaignSmartContractERC20,
        'BNB Smart Chain': campaignSmartContractBEP20,
        'BNB Testnet': campaignSmartContractBEP20,
        Polygon: campaignSmartContractPOLYGON,
        BitTorrent: campaignSmartContractBTT,
      } as { [key: string]: string };

      const networkUrl = {
        Ethereum: environment.WEB3_URL,
        'BNB Smart Chain': environment.WEB3_URL_BEP20,
        'BNB Testnet': environment.WEB3_URL_BEP20,
        Polygon: environment.WEB3_URL_POLYGON,
        BitTorrent: environment.WEB3_URL_BTT,
      } as { [key: string]: string };
      const provider = await detectEthereumProvider();
      if (provider) {
        const ethersProvider = new ethers.providers.Web3Provider(provider);

        const signer = ethersProvider.getSigner();

        let networkSelected = Cookies.get('networkSelected');
        if (
          networkSelected &&
          contractAddresses.hasOwnProperty(networkSelected)
        ) {
          const contractAddress = contractAddresses[networkSelected];

          if (contractAddress) {
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const messageHashSignature = utils.hashMessage(
              data?.applyerSignature.messageHash
            );
            var ret = await (contract.validateProm as any)(
              data.id_campaign,
              data.typeSN,
              data.idPost,
              data.idUser,
              !isNaN(data.abosNumber) ? data.abosNumber : 0,
              data.id_wallet,
              messageHashSignature,
              data.applyerSignature.v,
              data.applyerSignature.r,
              data.applyerSignature.s
            );
          }
        }
      }
      const transactionReceipt = await ret.wait();
      const events = transactionReceipt.events;

      const result: any = await this.campaignHttpApiService
        .validateLinksExt(prom, events[0].args[0])
        .toPromise();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
