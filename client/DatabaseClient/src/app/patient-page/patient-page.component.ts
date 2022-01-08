import {Component, Inject, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Visit} from "../models/visit";
import {ContactMember} from "../models/contactMember";
import {Patient} from "../models/patient";
import {Treatment} from "../models/treatment";
import {Doctor} from "../models/doctor";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AppService} from "../app.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PatientPageComponent implements OnInit {

  showVistColumns: String[] = ['dateStart', 'dateEnd', 'recognition', 'diagnosis', 'actions'];
  showTreatmentColumns: String[] = ['treatmentDate', 'details', 'actions'];
  showContactMembersColumns: String[] = ['name', 'surname', 'phoneNumber', 'actions'];
  showVisitData: MatTableDataSource<Visit>;
  showContactMemberData: MatTableDataSource<ContactMember>
  showTreatmentsData: MatTableDataSource<Treatment>
  currentPatient: Patient;
  doctor: Doctor;
  sendingPatient: Patient;
  showTreatmentsTable: boolean;
  treatmentsArray: Array<Treatment>
  editedVisit: Visit;

  constructor(private router: Router, public dialog: MatDialog, public appService: AppService) {
    this.currentPatient = {} as Patient;
    this.doctor = {} as Doctor;
    this.doctor = this.router.getCurrentNavigation()!.extras.state!.doctor;
    this.currentPatient = this.router.getCurrentNavigation()!.extras.state!.patient;
    this.sendingPatient = {} as Patient;
    this.sendingPatient.id = this.currentPatient.id;
    this.sendingPatient.idNumber = this.currentPatient.idNumber;
    this.sendingPatient.name = this.currentPatient.name;
    this.sendingPatient.surname = this.currentPatient.surname;
    this.showVisitData = new MatTableDataSource<Visit>(this.currentPatient.visits);
    this.showContactMemberData = new MatTableDataSource<ContactMember>(this.currentPatient.contactMembers);
    this.showTreatmentsTable = false;
    this.showTreatmentsData = new MatTableDataSource<Treatment>();
    this.treatmentsArray = [] as Array<Treatment>;
    this.editedVisit = {} as Visit;
  }

  ngOnInit(): void {
  }

  logOut() {
    location.reload();
  }

  goBack() {
    this.router.navigate(['/database'], {state: { doctor: this.doctor }});
  }

  treatmentsDatasource(visitID: Number) {
    this.editedVisit = this.currentPatient.visits.find(visit => visit.id == visitID)!;
    this.treatmentsArray = this.editedVisit.treatments;
    let tempVisit = {} as Visit;
    tempVisit.id = this.editedVisit.id;
    this.treatmentsArray.forEach(treatment => { treatment.parentVisit = tempVisit })
    this.showTreatmentsTable = true;
    this.showTreatmentsData = new MatTableDataSource<Treatment>(this.treatmentsArray);
    console.log(this.treatmentsArray);
  }

  reloadPatient() {
    let sendingDoctor = {} as Doctor;
    sendingDoctor.id = this.doctor.id;
    sendingDoctor.doctorCode = this.doctor.doctorCode;
    sendingDoctor.patients = [];
    sendingDoctor.patients.push(this.currentPatient);
    this.appService.getPatientDetails(sendingDoctor).subscribe(
      response => {
        this.currentPatient = response;
        this.showVisitData = new MatTableDataSource<Visit>(this.currentPatient.visits);
        this.showContactMemberData = new MatTableDataSource<ContactMember>(this.currentPatient.contactMembers);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }


  addVisit() {
    let tempPatient = this.sendingPatient;
    let newVisit = {} as Visit;
    const dialogRef = this.dialog.open(VisitDialogClass, {
      width: '300px',
      data: {
        dateStart: newVisit.dateStart,
        dateEnd: newVisit.dateEnd,
        recognition: newVisit.recognition,
        diagnosis: newVisit.diagnosis,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        newVisit.dateStart = result.data.dateStart;
        newVisit.dateEnd = result.data.dateEnd;
        newVisit.recognition = result.data.recognition;
        newVisit.diagnosis = result.data.diagnosis;
        this.saveVisitInDatabase(tempPatient, newVisit);
      }
    });
  }

  saveVisitInDatabase(patient: Patient, visit: Visit) {
    patient.visits = [];
    patient.visits.push(visit);
    this.appService.addVisit(patient).subscribe(
      (response) => {
        this.reloadPatient();
      },
      (error: HttpErrorResponse) => {
        if(error.status == 200) {
          this.reloadPatient();
        }
        else {
          alert(error.message);
        }
      }
    )
  }

  editVisit(visitID: Number) {
    let newVisit = this.currentPatient.visits.find(visit => visit.id == visitID);
    const dialogRef = this.dialog.open(VisitDialogClass, {
      width: '300px',
      data: {
        dateStart: newVisit!.dateStart,
        dateEnd: newVisit!.dateEnd,
        recognition: newVisit!.recognition,
        diagnosis: newVisit!.diagnosis,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        newVisit!.dateStart = result.data.dateStart;
        newVisit!.dateEnd = result.data.dateEnd;
        newVisit!.recognition = result.data.recognition;
        newVisit!.diagnosis = result.data.diagnosis;
        this.editVisitInDatabase(newVisit!);
      }
    });

  }

  editVisitInDatabase(visit: Visit) {
    this.appService.updateVisit(visit).subscribe(
      (response) => {
        this.reloadPatient();
      },
      (error: HttpErrorResponse) => {
        if(error.status == 200) {
          this.reloadPatient();
        }
        else {
          alert(error.message);
        }
      }
    )
  }

  deleteVisit(visitID: Number) {
    let deleteVisit = this.currentPatient.visits.find(visit => visit.id == visitID);
    this.appService.deleteVisit(deleteVisit!).subscribe(
      (response) => {},
      (error: HttpErrorResponse) => {
        if(error.status == 200) {
          this.reloadPatient();
        }
        else {
          alert(error.message);
        }
      }
    )
  }


  addContactMember() {
    let tempPatient = this.sendingPatient;
    let newContactMember = {} as ContactMember;
    const dialogRef = this.dialog.open(ContactMemberDialogClass, {
      width: '300px',
      data: {
        name: newContactMember.name,
        surname: newContactMember.surname,
        phoneNumber: newContactMember.phoneNumber,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        newContactMember.name = result.data.name;
        newContactMember.surname = result.data.surname;
        newContactMember.phoneNumber = result.data.phoneNumber;
        this.saveContactMemberInDatabase(tempPatient, newContactMember);
      }
    });
  }

  saveContactMemberInDatabase(patient: Patient, contactMember: ContactMember) {
    patient.contactMembers = [] as Array<ContactMember>;
    patient.contactMembers.push(contactMember);
    this.appService.addContactMember(patient).subscribe(
      (response) => {
        this.reloadPatient();
      },
      (error: HttpErrorResponse) => {
        if (error.status == 200) {
          this.reloadPatient();
        }
        else {
          alert(error.message);
        }
      }
    )
  }


  editContactMember(contactMemberID: Number) {
    let newContactMember = this.currentPatient.contactMembers.find(cm => cm.id == contactMemberID)!;
    const dialogRef = this.dialog.open(ContactMemberDialogClass, {
      width: '300px',
      data: {
        name: newContactMember.name,
        surname: newContactMember.surname,
        phoneNumber: newContactMember.phoneNumber,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        newContactMember.name = result.data.name;
        newContactMember.surname = result.data.surname;
        newContactMember.phoneNumber = result.data.phoneNumber;
        this.editContactMemberInDatabase(newContactMember);
      }
    });
  }

  editContactMemberInDatabase(contactMember: ContactMember) {
    this.appService.updateContactMember(contactMember).subscribe(
      (response) => {
        this.reloadPatient();
      },
      (error: HttpErrorResponse) => {
        if(error.status == 200) {
          this.reloadPatient();
        }
        else {
          alert(error.message);
        }
      }
    )
  }

  deleteContactMember(contactMemberID: Number) {
    let deleteContactMember = this.currentPatient.contactMembers.find(cm => cm.id == contactMemberID);
    this.appService.deleteContactMember(deleteContactMember!).subscribe(
      (response) => {},
      (error: HttpErrorResponse) => {
        if(error.status == 200) {
          this.reloadPatient();
        }
        else {
          alert(error.message);
        }
      }
    )
  }

  addTreatment(visitID: Number) {
    let tempVisit = this.currentPatient.visits.find(visit => visit.id == visitID)!;
    let newTreatment = {} as Treatment;
    const dialogRef = this.dialog.open(TreatmentDialogClass, {
      width: '300px',
      data: {
        date: newTreatment.date,
        details: newTreatment.details,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        newTreatment.date = result.data.date;
        newTreatment.details = result.data.details;
        this.saveTreatmentInDatabase(tempVisit, newTreatment);
      }
    });
  }

  saveTreatmentInDatabase(visit: Visit, treatment: Treatment) {
    visit.treatments = [] as Array<Treatment>;
    visit.treatments.push(treatment);
    this.appService.addTreatment(visit).subscribe(
      (response) => {
        //this.reloadPatient();
        // this.showTreatmentsData = new MatTableDataSource<Treatment>();
        this.treatmentsArray.push(response);
        // this.treatmentsDatasource(visit.id);
        this.showTreatmentsData = new MatTableDataSource<Treatment>(this.treatmentsArray);
        this.reloadPatient();
      },
      (error: HttpErrorResponse) => {
        if(error.status == 200) {
          this.reloadPatient();
          // this.showTreatmentsData = new MatTableDataSource<Treatment>();
          this.treatmentsDatasource(visit.id);
        }
        else {
          alert(error.message);
        }
      }
    )
  }

  editTreatment(treatment: Treatment) {
    const dialogRef = this.dialog.open(TreatmentDialogClass, {
      width: '300px',
      data: {
        date: treatment.date,
        details: treatment.details,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action != 'dismiss') {
        treatment.date = result.data.date;
        treatment.details = result.data.details;
        this.editTreatmentInDatabase(treatment);
      }
    });
  }

  editTreatmentInDatabase(treatment: Treatment) {
    let newTreatment = {} as Treatment;
    newTreatment.id = treatment.id;
    newTreatment.date = treatment.date;
    newTreatment.details = treatment.details;
    this.appService.updateTreatment(newTreatment).subscribe(
      (response) => {
          this.reloadPatient();
      },
      (error: HttpErrorResponse) => {
        // if(error.status == 200) {
        //   this.reloadPatient();
        //   this.showTreatmentsData = new MatTableDataSource<Treatment>();
        //   this.treatmentsDatasource(this.editedVisit.id);
        // }
        // else {
          alert(error.message);
        // }
      }
    )
  }

  deleteTreatment(treatmentID: Number) {
    let deleteTreatment = this.treatmentsArray.find(treatment => treatment.id = treatmentID);
    this.appService.deleteTreatment(deleteTreatment!).subscribe(
      (response) => {
      },
      (error: HttpErrorResponse) => {
        if(error.status == 200) {
          this.reloadPatient();
          let index = this.treatmentsArray.findIndex(t => t.id = treatmentID);
          this.treatmentsArray.splice(index-1, 1);
          this.showTreatmentsData = new MatTableDataSource<Treatment>(this.treatmentsArray);
        }
        else {
          alert(error.message);
        }
      }
    )
  }

  hideTreatments() {
    this.showTreatmentsTable = false;
  }


}


@Component({
  selector: 'visit-dialog',
  templateUrl: 'visit-dialog.html',
})
export class VisitDialogClass {
  constructor(
    public dialogRef: MatDialogRef<VisitDialogClass>,
    @Inject(MAT_DIALOG_DATA) public data: Visit,
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
        dateStart: this.data.dateStart,
        dateEnd: this.data.dateEnd,
        recognition: this.data.recognition,
        diagnosis: this.data.diagnosis,
      }
    });
  }

  updateDateStart(date: { value: any; }): void {
    const tempDate = JSON.stringify(date.value);
    this.data.dateStart = tempDate.substring(1, 11);
  }

  updateDateEnd(date: { value: any; }): void {
    const tempDate = JSON.stringify(date.value);
    this.data.dateEnd = tempDate.substring(1, 11);
  }

  isNonAddable(): boolean {
    return (this.data.dateStart === '' || this.data.dateEnd === '' || this.data.recognition === '');
  }
}

@Component({
  selector: 'contactMember-dialog',
  templateUrl: 'contactMember-dialog.html',
})
export class ContactMemberDialogClass {
  constructor(
    public dialogRef: MatDialogRef<ContactMemberDialogClass>,
    @Inject(MAT_DIALOG_DATA) public data: ContactMember,
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
        phoneNumber: this.data.phoneNumber,
      }
    });
  }

  isNonAddable(): boolean {
    return (this.data.name === '' || this.data.surname === '' || this.data.phoneNumber === '');
  }
}

@Component({
  selector: 'treatment-dialog',
  templateUrl: 'treatment-dialog.html',
})
export class TreatmentDialogClass {
  constructor(
    public dialogRef: MatDialogRef<TreatmentDialogClass>,
    @Inject(MAT_DIALOG_DATA) public data: Treatment,
  ) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close({
      action: 'dismiss',
    });
  }

  updateDate(date: { value: any; }): void {
    const tempDate = JSON.stringify(date.value);
    this.data.date = tempDate.substring(1, 11);
  }

  onAddClick(): void {
    this.dialogRef.close({
      action: 'add',
      data: {
        date: this.data.date,
        details: this.data.details,
      }
    });
  }

  isNonAddable(): boolean {
    return (this.data.date === '' || this.data.details === '');
  }
}
