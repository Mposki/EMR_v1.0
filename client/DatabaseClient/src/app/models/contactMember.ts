import {Patient} from "./patient";

export interface ContactMember {
  id: Number;
  parentPatient: Patient;
  name: String;
  surname: String;
  phoneNumber: String;
}
