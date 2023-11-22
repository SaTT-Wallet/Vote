import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { Observable } from 'rxjs';
import { sattUrl } from 'src/app/config/atn.config';
import { IGetSocialNetworksResponse } from '../../store/social-accounts/reducers/social-accounts.reducer';
import Cookies from 'js-cookie';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}
  checkThreads() {
    return this.http.get(
      sattUrl + '/profile/check/threads-account'
    );
  }
  notification() {
    return this.http.get(
      sattUrl + '/profile/notifications/decision'
    )
  }
  addThreads() {
    return this.http.get(
      sattUrl + '/profile/add/threads-account'
    )
  }

  deleteThreadAccount(id: string) {
    return this.http.delete(
      sattUrl + '/profile/remove/threads-account/'+id
    )
  }
  getSocialNetworks() {
    
    const headers = new HttpHeaders({
      'X-Signature': Cookies.get('metamaskSignature') || '',
      'X-Address': Cookies.get('metamaskAddress') || '',
      'X-Message': Cookies.get('metamaskNonce') || ''
    });
    const options = { headers: headers };
    return this.http.get<IGetSocialNetworksResponse>(
      sattUrl + '/profile/external/socialAccounts',
      options
    );
  }
  // /profile/socialAccounts
  deleteOneSocialNetworksGoogle(id: string) {
    return this.http.delete(sattUrl + '/profile/RemoveGoogleChannel/' + id);
  }
  deleleteAllSocialNetworksTwitter() {
    return this.http.delete(sattUrl + '/profile/RemoveTwitterChannels');
  }
  deleteOneSocialNetworksTwitter(id: string) {
    return this.http.delete(sattUrl + '/profile/RemoveTwitterChannel/' + id);
  }
  deleleteAllSocialNetworksGoogle() {
    return this.http.delete(sattUrl + '/profile/RemoveGoogleChannels');
  }
  deleleteAllSocialNetworksFb() {
    return this.http.delete(sattUrl + '/profile/RemoveFacebookchannels');
  }
  deleteOneSocialNetworksFb(id: string) {
    return this.http.delete(sattUrl + '/profile/RemoveFacebookChannel/' + id);
  }
  deleteAllSocialNetworksLinkedin() {
    return this.http.delete(sattUrl + '/profile/RemoveLinkedInChannels');
  }
  deleteOneSocialNetworksLinkedin(organization: string,linkedinId:string) {
    return this.http.delete(
      sattUrl + '/profile/remove/'+ linkedinId+'/linkedInChannel/'+ organization
      
    );
  }

  deleteTiktokChannel(tiktokProfileId: string) {
    return this.http.delete(
      sattUrl + '/profile/RemoveTiktokChannel/' + tiktokProfileId
      
    );
  }
  deleteAllTiktokChannels() {
    return this.http.delete(sattUrl + '/profile/RemoveTiktokChannels');
  }

  updateprofile(body: any) {
    return this.http.put(sattUrl + '/profile/UpdateProfile', body);
  }
  updateEmail(body: any) {
    return this.http.post(sattUrl + '/profile/changeEmail', body);
  }
  confirmChangeEmail(code: any) {
    return this.http.post(
      sattUrl + '/profile/confirmChangeEmail',
      {
        code: code
      }
    );
  }

  completeprofile(body: any) {
    return this.http.put(sattUrl + '/auth/updateLastStep', body);
  }


  getTiktokProfilPrivcay() {
    return this.http.get(sattUrl + '/profile/Tiktok/ProfilPrivacy');
  }







 

  
  
}
