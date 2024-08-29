import {Season} from "../utils/season";
import {Location} from "../model/location";
import {LocationDto} from "./location-dto";


export interface HerbDto {
  name: string;
  description: string;
  seasons: Season[];
  benefits: string;
  locations: LocationDto[];
}
