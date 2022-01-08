import {Component, OnInit, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {Credentials} from "../models/credentials";
import {RegisterData} from "../models/registerData";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Doctor} from "../models/doctor";
import {AppService} from "../app.service";
import {HttpErrorResponse} from "@angular/common/http";

export interface OtpDialogData {
  otpCode: String;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  userCredentials: Credentials;
  registerData: RegisterData;
  secondFactorCode: string;
  doctor: Doctor;

  constructor(private router: Router, public otpDialog: MatDialog, public appService: AppService) {
    this.userCredentials = new Credentials();
    this.registerData = new RegisterData();
    this.secondFactorCode = '';
    this.doctor = {} as Doctor;
  }

  ngOnInit(): void {
  }

  logIn(): void {
    this.doctor.login = this.userCredentials.loginValue;
    this.doctor.password = this.userCredentials.passwordValue;
    this.appService.logIn(this.doctor).subscribe(
      response => {
          this.open(this.doctor);
      },
      (error: HttpErrorResponse)=> {
        if (error.status == 404) {
          alert("Niepoprawne dane użytkownika!\nSpróbuj zalogować się ponownie.");
        }
      }
    )
  }

  registerUser(): void {
    this.doctor.login = this.registerData.loginValue;
    this.doctor.password = this.registerData.passwordValue;
    this.doctor.email = this.registerData.email;
    this.doctor.giftcardNumber = this.registerData.giftcardNumber;
    if(this.registerData.validateEmail()) {
      this.appService.register(this.doctor).subscribe(
        response => {
          this.open(this.doctor);
        },
        (error: HttpErrorResponse)=> {
          if (error.status == 404) {
            alert("Error!\nSpróbuj ponownie.");
          }
          else if (error.status == 409) {
            alert("Niepoprawne dane użytkownika!\nUżytkownik o podanych parametrach istnieje!");
          }
        }
      )
    }
    else {
      alert('Invalid email!');
    }
  }

  canLogIn(): boolean {
    return this.userCredentials.isEmpty();
  }

  canRegister(): boolean {
    return this.registerData.isEmpty();
  }

  open(doctor: Doctor) {
    let otpDialogData = {} as OtpDialogData;
    const dialogRef = this.otpDialog.open(OtpDialog, {
      width: '250px',
      data: {
        otpCode: otpDialogData.otpCode = '',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.action != 'dismiss') {
        doctor.otp = result.data.otpCode;
        this.sendOTP(doctor);
      }
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  sendOTP(doctor: Doctor): void {
    this.appService.verifyLogIn(doctor).subscribe(
      (response: Doctor) => {
        this.router.navigate(['/database'], {state: { doctor: response }})
      },
      (error: HttpErrorResponse)=> {
        if (error.status == 404) {
          alert("Niepoprawny kod OTP!\nSpróbuj zalogować się ponownie.");
        }
      }
    )
  }
}

@Component({
  selector: 'otp-dialog',
  templateUrl: 'otp-dialog.html',
})
export class OtpDialog {
  constructor(
    public dialogRef: MatDialogRef<OtpDialog>,
    @Inject(MAT_DIALOG_DATA) public data: OtpDialogData,
  ) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close({
      action: 'dismiss',
    });
  }

  onSendClick(): void {
    this.dialogRef.close({
      action: 'send',
      data: {
        otpCode: this.data.otpCode,
      }});
  }

  isNonSendable(): boolean {
    return (this.data.otpCode === '' || this.data.otpCode.includes(' '));
  }

}
