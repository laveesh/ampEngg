import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { PeriodsService } from './periods.service';
import {
  UserActive,
  UserActivityData,
  Generation
} from '../data/user-activity';

@Injectable()
export class UserActivityService extends UserActivityData {
  private getRandom = (roundTo: number) => Math.round(Math.random() * roundTo);
  private generateUserActivityRandomData(date) {
    return {
      date,
      pagesVisitCount: this.getRandom(1000),
      deltaUp: this.getRandom(1) % 2 === 0,
      newVisits: this.getRandom(100)
    };
  }

  data = {};

  constructor(private periods: PeriodsService) {
    super();
    this.getDateWiseData();
  }

  private getDateWiseData() {
    const blocks = this.periods.getBlocks();
    const genData = this.periods.getGenerationData();
    const result = {};
    for (let i = 0; i < 31; i++) {
      const perDaySet = [];
      for (let j = 0; j < 96; j++) {
        perDaySet.push({
          slot: blocks[j],
          mw: genData[i].mw[j],
          mvar: genData[i].mvar[j],
          kwh: genData[i].kwh[j]
        });
      }
      result[i] = perDaySet;
    }

    this.data = result;
  }

  private getDataWeek(): UserActive[] {
    return this.periods.getWeeks().map(week => {
      return this.generateUserActivityRandomData(week);
    });
  }

  private getDataMonth(): UserActive[] {
    const currentDate = new Date();
    const days = currentDate.getDate();
    const month = this.periods.getMonths()[currentDate.getMonth()];

    return Array.from(Array(days)).map((_, index) => {
      const date = `${index + 1} ${month}`;

      return this.generateUserActivityRandomData(date);
    });
  }

  private getDataYear(): UserActive[] {
    return this.periods.getYears().map(year => {
      return this.generateUserActivityRandomData(year);
    });
  }

  getUserActivityData(day: number): Observable<Generation[]> {
    return observableOf(this.data[day]);
  }
}
