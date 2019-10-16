import { Observable } from 'rxjs';

export interface UserActive {
  date: string;
  pagesVisitCount: number;
  deltaUp: boolean;
  newVisits: number;
}

export interface Generation {
  slot: string;
  mw: number;
  mvar: boolean;
  kwh: number;
}
export abstract class UserActivityData {
  abstract getUserActivityData(day: number): Observable<Generation[]>;
}
