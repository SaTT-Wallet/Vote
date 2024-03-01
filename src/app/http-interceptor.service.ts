import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import Cookies from 'js-cookie';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Define the URLs for which you want to add headers
    const apiUrlsWithHeaders = [
      '/external/RemoveTwitterChannels',
      '/external/RemoveFacebookchannels',
      '/external/RemoveLinkedInChannels',
      '/external/RemoveTiktokChannels',
      '/external/RemoveGoogleChannels',
      '/external/RemoveTwitterChannel',
      '/external/RemoveFacebookchannel',
      '/external/RemoveLinkedInChannel',
      '/external/RemoveTiktokChannel',
      '/external/RemoveGoogleChannel',
      '/external/socialAccounts',
      '/external/campaign/filterLinksExternal',
      '/external/campaign/getLinksExternal',
      '/external/link/verify',
      '/external/createCampaign',
      '/external/verify-token',
      '/external/externalAccount',
      '/external/externalUpdate',
      '/external/apply',
      '/external/checkHarvest',
      '/external/externalAnswer',
      '/external/externalGains',
      '/external/externalUploadPictureToIPFS',
      '/external/deleteDraft'
    ];

    // Check if the request URL matches any of the specified URLs
    const shouldAddHeaders = apiUrlsWithHeaders.some(url => req.url.includes(url));

    if (shouldAddHeaders) {
      
      const token = !!Cookies.get('jwt') ? Cookies.get('jwt') : '';
      let headers: { [header: string]: string } = {
        'Cache-Control': 'no-store'
      };
      if(token != '') {
        headers['Authorization'] = 'Bearer ' + token;
      }
      const cloned = req.clone({ setHeaders: headers });

      return next.handle(cloned);
    }

    // If the request URL doesn't match, proceed without modifying headers
    return next.handle(req);
  }
}
