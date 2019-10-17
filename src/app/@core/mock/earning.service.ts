import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { LiveUpdateChart, PieChart, EarningData } from '../data/earning';

@Injectable()
export class EarningService extends EarningData {
  private MIN_15 = 1000 * 60 * 15;
  private currentDate: Date = new Date();
  private currentInstantDate: Date = new Date( +new Date - this.MIN_15);
  private currentValue = Math.random() * 1000;
  private ONE_SEC = 1000;

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
    this.currentDate = new Date(+this.currentDate + this.ONE_SEC);
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
          this.currentDate.getHours() < 10
            ? '0' + this.currentDate.getHours()
            : this.currentDate.getHours(),
          this.currentDate.getMinutes() < 10
            ? '0' + this.currentDate.getMinutes()
            : this.currentDate.getMinutes(),
          this.currentDate.getSeconds() < 10
            ? '0' + this.currentDate.getSeconds()
            : this.currentDate.getSeconds()
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

  getDefaultLiveInstantData(elementsNumber: number) {
    this.currentDate = new Date();
    this.currentValue = Math.random() * 100;

    return Array.from(Array(elementsNumber)).map(item =>
      this.generateRandomLiveInstantData()
    );
  }

  generateRandomLiveInstantData() {
    this.currentInstantDate = new Date(+this.currentInstantDate + this.ONE_SEC);
    this.currentValue = this.currentValue + Math.random() * 20 - 11;

    if (this.currentValue < 0) {
      this.currentValue = Math.random() * 100;
    }

    return {
      value: {
        slot: `${[
          this.currentInstantDate.getDate(),
          this.currentInstantDate.getMonth(),
          this.currentInstantDate.getFullYear()
        ].join('/')} ${[
          this.currentInstantDate.getHours() < 10
            ? '0' + this.currentInstantDate.getHours()
            : this.currentInstantDate.getHours(),
          this.currentInstantDate.getMinutes() < 10
            ? '0' + this.currentInstantDate.getMinutes()
            : this.currentInstantDate.getMinutes(),
          this.currentInstantDate.getSeconds() < 10
            ? '0' + this.currentInstantDate.getSeconds()
            : this.currentInstantDate.getSeconds()
        ].join(':')}`,
        mw: this.currentValue.toFixed(3),
        mvar: (this.currentValue * 0.0172).toFixed(3),
        kwh: (this.currentValue * 250).toFixed(3)
      }
    };
  }

  getInstantLiveUpdateCardData(currency): Observable<any[]> {
    const data = this.liveUpdateChartData[currency.toLowerCase()];
    const newValue = this.generateRandomLiveInstantData();

    data.liveChart.shift();
    data.liveChart.push(newValue);
    return observableOf(data.liveChart);
  }

  getInstantCardData(currency: string): Observable<LiveUpdateChart> {
    const data = this.liveUpdateChartData[currency.toLowerCase()];

    data.liveChart = this.getDefaultLiveInstantData(900);

    return observableOf(data);
  }
}
