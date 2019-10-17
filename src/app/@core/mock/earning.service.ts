import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { LiveUpdateChart, PieChart, EarningData } from '../data/earning';

@Injectable()
export class EarningService extends EarningData {

  private currentDate: Date = new Date();
  private currentValue = Math.random() * 1000;
  private ONE_DAY = 1000;

  private pieChartData = [
    {
      value: 50,
      name: 'Bitcoin'
    },
    {
      value: 25,
      name: 'Tether'
    },
    {
      value: 25,
      name: 'Ethereum'
    }
  ];

  private liveUpdateChartData = {
    bitcoin: {
      liveChart: [],
      delta: {
        up: true,
        value: 4
      },
      dailyIncome: 14080
    },
    tether: {
      liveChart: [],
      delta: {
        up: false,
        value: 9
      },
      dailyIncome: 5862
    },
    ethereum: {
      liveChart: [],
      delta: {
        up: false,
        value: 21
      },
      dailyIncome: 584
    }
  };

  getDefaultLiveChartData(elementsNumber: number) {
    this.currentDate = new Date();
    this.currentValue = Math.random() * 100;

    return Array.from(Array(elementsNumber)).map(item =>
      this.generateRandomLiveChartData()
    );
  }

  generateRandomLiveChartData() {
    this.currentDate = new Date(+this.currentDate + this.ONE_DAY);
    this.currentValue = this.currentValue + Math.random() * 20 - 11;

    if (this.currentValue < 0) {
      this.currentValue = Math.random() * 100;
    }

    return {
      value: [
        `${[
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate()
        ].join('/')}T${[
          this.currentDate.getHours(),
          this.currentDate.getMinutes(),
          this.currentDate.getSeconds() < 10 ? '0'+ this.currentDate.getSeconds(): this.currentDate.getSeconds(),
        ].join(':')}`,
        Math.round(this.currentValue)
      ]
    };
  }

  getEarningLiveUpdateCardData(currency): Observable<any[]> {
    const data = this.liveUpdateChartData[currency.toLowerCase()];
    const newValue = this.generateRandomLiveChartData();

    data.liveChart.shift();
    data.liveChart.push(newValue);
    console.log("TCL: EarningService -> newValue", newValue)
    return observableOf(data.liveChart);
  }

  getEarningCardData(currency: string): Observable<LiveUpdateChart> {
    const data = this.liveUpdateChartData[currency.toLowerCase()];

    data.liveChart = this.getDefaultLiveChartData(150);

    return observableOf(data);
  }

  getEarningPieChartData(): Observable<PieChart[]> {
    return observableOf(this.pieChartData);
  }
}
