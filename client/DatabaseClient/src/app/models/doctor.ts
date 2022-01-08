import {Patient} from "./patient";

export interface Doctor {
  id: Number;
  login: String;
  password: String;
  email: String;
  giftcardNumber: String;
  doctorCode: String;
  otp: String;
  otpRequestedTime: Date;
  patients: Array<Patient>;

}
