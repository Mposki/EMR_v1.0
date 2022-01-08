import {AfterViewInit, Component, ViewChild, Inject} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Doctor} from "../models/doctor";
import {AppService} from "../app.service";
import {Patient} from "../models/patient";
import {HttpErrorResponse} from "@angular/common/http";

export interface PatientsDatabaseSimpleView {
  name: String;
  surname: String;
  idNum: String;
}

let DATABASE: PatientsDatabaseSimpleView[] = []

const SHARE_DATABASE: PatientsDatabaseSimpleView[] = [
  {name: 'Malik', surname: 'Montana', idNum: '9971129820'},
  {name: 'Woj', surname: 'Bebzon', idNum: '9876543210'},
]

export interface OtpDialogData {
  otpCode: String;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements AfterViewInit {

  showColumns: string[] = ['name', 'surname', 'idNum', 'actions'];
  showData: MatTableDataSource<PatientsDatabaseSimpleView>
  isShared: boolean;
  titleText = 'Baza danych pacjentów'
  doctor: Doctor;
  sendingDoctor: Doctor;


  constructor(private router: Router, public dialog: MatDialog, public appService: AppService) {
    this.doctor = {} as Doctor;
    // @ts-ignore
    this.doctor = this.router.getCurrentNavigation().extras.state.doctor;
    this.sendingDoctor = {} as Doctor;
    this.sendingDoctor.id = this.doctor.id;
    this.sendingDoctor.login = this.doctor.login;
    this.sendingDoctor.doctorCode = this.doctor.doctorCode;
    this.sendingDoctor.email = this.doctor.email;
    this.sendingDoctor.giftcardNumber = this.doctor.giftcardNumber;

    this.doctor.patients.forEach(patient =>
      DATABASE.push({name: patient.name, surname: patient.surname, idNum: patient.idNumber})
    )
    this.showData = new MatTableDataSource(DATABASE);
    this.isShared = false;
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.showData.sort = this.sort;
  }

  logOut(): void {
    location.reload();
  }

  deleteDoctor(): void {
    this.appService.deleteDoctor(this.sendingDoctor.id).subscribe(
      response => {
        let newResponse = JSON.stringify(response);
        this.openOTPDoctor();
      }
    )
  }

  openOTPDoctor() {
    let otpDialogData = {} as OtpDialogData;
    const dialogRef = this.dialog.open(OtpDialogVerifying, {
      width: '250px',
      data: {
        otpCode: otpDialogData.otpCode = '',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        this.sendingDoctor.otp = result.data.otpCode;
        this.sendOTPDoctor();
      }
    });
  }

  sendOTPDoctor(): void {
    this.appService.verifyDeleteDoctor(this.sendingDoctor).subscribe(
      (response) => {
          this.logOut();
      },
      (error: HttpErrorResponse)=> {
        if (error.status == 200) {
          console.log('delete!');
          this.logOut();
        }
        else if (error.status == 404) {
          alert("Niepoprawny kod OTP!\nSpróbuj ponownie.");
        }
      }
    )
  }

  addPatient(): void {
    let tempDoctor = this.sendingDoctor;
    let newPatient = {} as Patient;
    const dialogRef = this.dialog.open(AddPatientDialogClass, {
      width: '250px',
      data: {
        name: newPatient.name = '',
        surname: newPatient.surname = '',
        idNum: newPatient.idNumber = '',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        if(this.checkPESEL(result.data.idNum)) {
          newPatient.name = result.data.name;
          newPatient.surname = result.data.surname;
          newPatient.idNumber = result.data.idNum;
          this.savePatientInDatabase(newPatient, tempDoctor);
        }
        else {
          alert('Niepoprawny numer PESEL!');
        }
      }
    });
  }

  savePatientInDatabase(patient: Patient, doctor: Doctor) {
    doctor.patients = [] as Array<Patient>;
    doctor.patients.push(patient);
    this.appService.addPatient(doctor).subscribe(
      (result) => {
        this.doctor.patients.push(result);
        this.reloadDatabase();
      },
      (error: HttpErrorResponse)=> {
        if (error) {
          alert("Pacjent o podanych danych istnieje w bazie!");
        }
      }
    )
  }

  showPatient(patientIDNumber: String): void {
    let tempDoctor = this.sendingDoctor;
    let newPatient = {} as Patient;
    newPatient = this.doctor.patients.find(patient => patient.idNumber == patientIDNumber)!;
    tempDoctor.patients = [] as Array<Patient>;
    tempDoctor.patients.push(newPatient);
    this.appService.getPatientDetails(tempDoctor).subscribe(
      (response) => {
        this.redirectToShowPatient(this.doctor, response);
      },
      (error: HttpErrorResponse)=> {
        if (error) {
          alert(error.message);
        }
      }
    )
  }

  redirectToShowPatient(doctor: Doctor, patient: Patient) {
    DATABASE = [];
    this.router.navigate(['/patient'], {state: { doctor: doctor, patient: patient }});
  }

  editPatient(patientIDNumber: String): void {
    let newPatient = this.doctor.patients.find(patient => patient.idNumber == patientIDNumber)!;
    const dialogRef = this.dialog.open(AddPatientDialogClass, {
      width: '250px',
      data: {
        name: newPatient.name,
        surname: newPatient.surname,
        idNum: newPatient.idNumber,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        if(this.checkPESEL(result.data.idNum)) {
          newPatient.name = result.data.name;
          newPatient.surname = result.data.surname;
          newPatient.idNumber = result.data.idNum;
          this.editPatientInDatabase(newPatient);
        }
        else {
          alert('Niepoprawny numer PESEL!');
        }
      }
    });
  }

  editPatientInDatabase(patient: Patient) {
    this.appService.updatePatient(patient).subscribe(
      (result) => {
        let index = this.doctor.patients.findIndex(patient => patient.id == result.id);
        this.doctor.patients[index] = result;
        this.reloadDatabase();
      },
      (error: HttpErrorResponse)=> {
        if (error) {
          alert(error.message);
        }
      }
    )
  }

  deletePatient(patientIDNum: String): void {
    let deletingPatient = this.doctor.patients.find(patient => patient.idNumber === patientIDNum)!;
    this.appService.verifyDeletePatient(deletingPatient.id, this.sendingDoctor).subscribe(
      response => {
        let newResponse = JSON.stringify(response);
        this.openOTPPatient(deletingPatient.id, this.doctor);
      }
    )
  }

  openOTPPatient(patientID: Number, doctor: Doctor) {
    let otpDialogData = {} as OtpDialogData;
    const dialogRef = this.dialog.open(OtpDialogVerifying, {
      width: '250px',
      data: {
        otpCode: otpDialogData.otpCode = '',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        doctor.otp = result.data.otpCode;
        this.sendOTPPatient(patientID, doctor);
      }
    });
  }

  sendOTPPatient(patientID: Number, doctor: Doctor): void {
    this.appService.deletePatient(patientID, doctor).subscribe(
      (response: Doctor) => {
        this.doctor = response;
        this.reloadDatabase();
      },
      (error: HttpErrorResponse)=> {
        if (error.status == 404) {
          alert("Niepoprawny kod OTP!\nSpróbuj ponownie.");
        }
      }
    )
  }

  changeViewDatabase(): void {
    this.isShared = false;
    this.titleText = 'Baza danych pacjentów';
    this.showData = new MatTableDataSource(DATABASE);

  }

  changeViewShared(): void {
    this.isShared = true;
    this.titleText = 'Udostępnieni pacjenci dla mnie';
    this.showData = new MatTableDataSource(SHARE_DATABASE);

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.showData.filter = filterValue.trim().toLowerCase();
  }

  reloadDatabase() {
    DATABASE = [];
    this.doctor.patients.forEach(patient =>
      DATABASE.push({name: patient.name, surname: patient.surname, idNum: patient.idNumber})
    )
    this.showData = new MatTableDataSource(DATABASE);
  }

  checkPESEL(idNumber: String): boolean {
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;

    for (let i = 0; i < weights.length; i++) {
      sum += (parseInt(idNumber.substring(i, i + 1)) * weights[i]);
    }
    sum = sum % 10;
    return (10 - sum) % 10 === parseInt(idNumber.substring(10, 11));
  }

}

@Component({
  selector: 'add-patient-dialog',
  templateUrl: 'add-patient-dialog.html',
})
export class AddPatientDialogClass {
  constructor(
    public dialogRef: MatDialogRef<AddPatientDialogClass>,
    @Inject(MAT_DIALOG_DATA) public data: PatientsDatabaseSimpleView,
  ) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close({
      action: 'dismiss',
    });
  }

  onAddClick(): void {
    this.dialogRef.close({
      action: 'add',
      data: {
        name: this.data.name,
        surname: this.data.surname,
        idNum: this.data.idNum,
      }
    });
  }

  isNonAddable(): boolean {
    return this.data.name === '' || this.data.idNum.includes(' ') ||
      this.data.surname === '' || this.data.idNum.includes(' ') ||
      this.data.idNum === '' || this.data.idNum.includes(' ');
  }
}

@Component({
  selector: 'otp-dialog',
  templateUrl: 'otp-dialog.html',
})
export class OtpDialogVerifying {
  constructor(
    public dialogRef: MatDialogRef<OtpDialogVerifying>,
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
      }
    });
  }

  isNonSendable(): boolean {
    return (this.data.otpCode === '' || this.data.otpCode.includes(' '));
  }

}
