import {Season} from "../utils/season";
import {Location} from "./location";


export interface Herb {
  id: string;
  name: string;
  description: string;
  seasons: Season[];
  benefits: string;
  locations: Location[];
}
