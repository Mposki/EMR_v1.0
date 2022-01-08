import {Patient} from "./patient";
import {Treatment} from "./treatment";

export interface Visit {
  id: Number;
  parentPatient: Patient;
  dateStart: String;
  dateEnd: String;
  recognition: String;
  diagnosis: String;
  treatments: Array<Treatment>;
}
