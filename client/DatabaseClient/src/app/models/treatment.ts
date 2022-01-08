import {Visit} from "./visit";

export interface Treatment {
  id: Number;
  parentVisit: Visit;
  date: String;
  details: String;
}
