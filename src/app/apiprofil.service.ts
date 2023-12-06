import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class ApiprofilService {

  constructor(private http: HttpClient) {}


  createUser(wallet: string) {
    return this.http.post(environment.API_URL +'/wallet/createUserFromExternalWallet', {wallet});
  }
  

}
