import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { PeriodsService } from './periods.service';
import {
  UserActive,
  UserActivityData,
  Generation,
} from '../data/user-activity';

@Injectable()
export class UserActivityService extends UserActivityData {
  private getRandom = (roundTo: number) => Math.round(Math.random() * roundTo);
  private generateUserActivityRandomData(date) {
    return {
      date,
      pagesVisitCount: this.getRandom(1000),
      deltaUp: this.getRandom(1) % 2 === 0,
      newVisits: this.getRandom(100),
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
      const today = new Date().getDate() - 1;
      let maxslot = 96;
      if (today === i) {
        const base = new Date().getHours() * 4;
        const min = new Date().getMinutes();
        const factor = 60 / min;
        maxslot = base + ( factor > 4 ? 0 : factor > 2 ? 1 : factor > 1.3 ? 2 : 3);
      }
      for (let j = 0; j < maxslot; j++) {
        perDaySet.push({
          slot: blocks[j],
          mw: genData[i].mw[j],
          mvar: genData[i].mvar[j],
          kwh: genData[i].kwh[j],
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
    return observableOf(this.data[day - 1]);
  }
}
