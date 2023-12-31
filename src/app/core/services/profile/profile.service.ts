import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sattUrl } from '@config/atn.config';
import { TokenStorageService } from '../tokenStorage/token-storage-service.service';
import { Observable } from 'rxjs';
import { IresponseCodeQr } from '@app/core/iresponse-code-qr';
import { IGetSocialNetworksResponse } from '@app/layout/components/social-networks/social-networks.component';
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
    return this.http.get<IGetSocialNetworksResponse>(
      sattUrl + '/external/socialAccounts'
      
    );
  }
  deleteOneSocialNetworksGoogle(id: string) {
    return this.http.delete(sattUrl + '/external/RemoveGoogleChannel/' + id);
  }
  deleleteAllSocialNetworksTwitter() {
    return this.http.delete(sattUrl + '/external/RemoveTwitterChannels');
  }
  deleteOneSocialNetworksTwitter(id: string) {
    return this.http.delete(sattUrl + '/external/RemoveTwitterChannel/' + id);
  }
  deleleteAllSocialNetworksGoogle() {
    return this.http.delete(sattUrl + '/external/RemoveGoogleChannels');
  }
  deleleteAllSocialNetworksFb() {
    
    return this.http.delete(sattUrl + '/external/RemoveFacebookchannels');
  }
  deleteOneSocialNetworksFb(id: string) {
    
    return this.http.delete(sattUrl + '/external/RemoveFacebookChannel/' + id);
  }
  deleteAllSocialNetworksLinkedin() {
    return this.http.delete(sattUrl + '/external/RemoveLinkedInChannels' );
  }
  deleteOneSocialNetworksLinkedin(organization: string,linkedinId:string) {
   
    return this.http.delete(
      sattUrl + '/external/remove/'+ linkedinId+'/linkedInChannel/'+ organization
    );
  }

  deleteTiktokChannel(tiktokProfileId: string) {
    return this.http.delete(
      sattUrl + '/external/RemoveTiktokChannel/' + tiktokProfileId 
    );
  }

  deleteAllTiktokChannels() {
    return this.http.delete(sattUrl + '/external/RemoveTiktokChannels');
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


  getUserProfilePic() {
    return this.http.get(sattUrl + '/profile/picture', {
      responseType: 'blob',
    });
  }

  addInterests(body: any) {
    return this.http.post(
      sattUrl + '/profile/AddUserIntersts',
      { interests: body }
    );
  }
  getInterests() {
    let httpHeaders = new HttpHeaders({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenStorageService.getToken()
    });

    return this.http.get(sattUrl + '/profile/UserIntersts');
  }
  updateInterests(body: any) {
    return this.http.put(
      sattUrl + '/profile/UpdateUserIntersts',
      { interests: body }
    );
  }

  logoutRS(social: any) {
    return this.http.put(sattUrl + '/auth/disconnect/' + social, null);
  }

  deleteAccount(obj: any) {
    return this.http.post(sattUrl + '/auth/purge', obj);
  }
  generateQRCode() {
    return this.http.get(sattUrl + '/auth/qrCode');
  }
  verifyQRCode(body: any): Observable<IresponseCodeQr> {
    return this.http.post<IresponseCodeQr>(
      sattUrl + '/auth/verifyQrCode',
      body
    );
  }

 

  
  
}
