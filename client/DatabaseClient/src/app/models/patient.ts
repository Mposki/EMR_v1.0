import {Treatment} from "./treatment";
import {ContactMember} from "./contactMember";
import {Doctor} from "./doctor";
import {Visit} from "./visit";

export interface Patient {
  id: Number;
  parentDoctor: Doctor;
  name: String;
  surname: String;
  idNumber: String;
  contactMembers: Array<ContactMember>; //max size = 2
  visits: Array<Visit>;

}
