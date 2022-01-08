import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Doctor} from "./models/doctor";
import {Patient} from "./models/patient";
import {Visit} from "./models/visit";
import {ContactMember} from "./models/contactMember";
import {Treatment} from "./models/treatment";


@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiURL = '';

  constructor(private http: HttpClient) {
    this.apiURL = 'http://localhost:8080';
  }

  public register(doctor: Doctor): Observable<String> {
    return this.http.put<String>(`${this.apiURL}/register`, doctor);
  }

  public logIn(doctor: Doctor): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/login`, doctor, {observe: 'response'});
  }

  public verifyLogIn(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiURL}/login/verify`, doctor);
  }

  public deleteDoctor(idDoctor: Number): Observable<String> {
    return this.http.get<String>(`${this.apiURL}/doctor/delete/${idDoctor}`);
  }

  public verifyDeleteDoctor(doctor: Doctor): Observable<String> {
    return this.http.post<String>(`${this.apiURL}/doctor/delete/verify`, doctor);
  }


  public addPatient(doctor: Doctor): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiURL}/patient/add`, doctor);
  }

  public updatePatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiURL}/patient/update`, patient);
  }

  public getPatientDetails(doctor: Doctor): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiURL}/patient/details/${doctor.patients[0].id}`, doctor);
  }

  public deletePatient(idPatient: Number, doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiURL}/patient/delete/${idPatient}`, doctor);
  }

  public verifyDeletePatient(idPatient: Number, doctor: Doctor): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/patient/delete/verify/${idPatient}`, doctor, {observe: 'response'});
  }


  public addContactMember(patient: Patient): Observable<ContactMember> {
    return this.http.post<ContactMember>(`${this.apiURL}/patient/details/contact-member/add`, patient);
  }

  public updateContactMember(contactMember: ContactMember): Observable<ContactMember> {
    return this.http.post<ContactMember>(`${this.apiURL}/patient/details/contact-member/update`, contactMember);
  }

  public deleteContactMember(contactMember: ContactMember): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/patient/details/contact-member/delete`, contactMember, {observe: 'response'});
  }


  public addVisit(patient: Patient): Observable<Visit> {
    return this.http.post<Visit>(`${this.apiURL}/patient/details/visit/add`, patient);
  }

  public updateVisit(visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(`${this.apiURL}/patient/details/visit/update`, visit);
  }

  public deleteVisit(visit: Visit): Observable<any> {
    return this.http.post<String>(`${this.apiURL}/patient/details/visit/delete`, visit, {observe: 'response'});
  }


  public addTreatment(visit: Visit): Observable<Treatment> {
    return this.http.post<Treatment>(`${this.apiURL}/patient/details/treatment/add`, visit);
  }

  public updateTreatment(treatment: Treatment): Observable<Treatment> {
    return this.http.post<Treatment>(`${this.apiURL}/patient/details/treatment/update`, treatment);
  }

  public deleteTreatment(treatment: Treatment): Observable<any> {
    return this.http.post<String>(`${this.apiURL}/patient/details/treatment/delete`, treatment, {observe: 'response'});
  }

}

