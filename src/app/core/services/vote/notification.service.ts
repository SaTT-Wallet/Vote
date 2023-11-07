import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    // isSuccess: boolean = false;
    // isError: boolean = false;
    message!: string;
    isSuccess!: boolean;
    show: boolean = false;
    constructor() { }

    showNotification(message: string, isSuccess: boolean) {
        this.show = true;
        this.message = message;
        this.isSuccess = isSuccess;
        setTimeout(() => {
            this.message = '';
            this.show = false;
        }, 5000);
    }
    // showSuccess() {
    //     this.isSuccess = true;
    //     document.body.classList.add('popup-visible');
    // }
    // hideSuccess() {
    //     this.isSuccess = false;
    //     document.body.classList.remove('popup-visible');
    // }

    // showError() {
    //     this.isError = true;
    //     document.body.classList.add('popup-visible');
    // }
    // hideError() {
    //     this.isError = false;
    //     document.body.classList.remove('popup-visible');
    // }
}
