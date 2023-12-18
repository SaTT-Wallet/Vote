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
      '/external/create-user',
      '/external/socialAccounts',
      '/external/campaign/filterLinksExternal',
      '/external/link/verify',
      '/external/createCampaign',
      '/external/verify-token',
      '/external/externalAccount',
      '/external/externalUpdate',
      '/external/externalIpfs'

    ];

    // Check if the request URL matches any of the specified URLs
    const shouldAddHeaders = apiUrlsWithHeaders.some(url => req.url.includes(url));

    if (shouldAddHeaders) {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('X-Signature', Cookies.get('metamaskSignature') || '')
        .set('X-Address', Cookies.get('metamaskAddress') || '')
        .set('X-Message', Cookies.get('metamaskNonce') || '');

      const cloned = req.clone({ headers });

      return next.handle(cloned);
    }

    // If the request URL doesn't match, proceed without modifying headers
    return next.handle(req);
  }
}
