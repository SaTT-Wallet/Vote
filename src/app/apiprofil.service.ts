import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sattUrl } from './config/atn.config';
@Injectable({
  providedIn: 'root'
})
export class ApiprofilService {

  constructor(private http: HttpClient) {}


  createUser(wallet: string) {
    return this.http.post(`${sattUrl}/external/create-user`, {wallet});
  }

  verifyToken() {
    return this.http.get(`${sattUrl}/external/verify-token`)
  }
  

}
