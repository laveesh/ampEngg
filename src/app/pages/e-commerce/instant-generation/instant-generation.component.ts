import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { takeWhile, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import {
  UserActivityData,
  Generation
} from '../../../@core/data/user-activity';
import { EarningData, LiveUpdateChart } from '../../../@core/data/earning';

@Component({
  selector: 'ngx-instant-generation',
  styleUrls: ['./instant-generation.component.scss'],
  templateUrl: './instant-generation.component.html'
})
export class ECommerceInstantGenerationComponent implements OnDestroy {

  private alive = true;

  intervalInstantSubscription: Subscription;
  userActivity: Generation[] = [];
  type;
  types = [];
  earningLiveUpdateCardData: LiveUpdateChart;

  constructor(private earningService: EarningData) {
    this.getEarningCardData('tether');
  }

  private getEarningCardData(currency) {
    this.earningService
      .getInstantCardData(currency)
      .pipe(takeWhile(() => this.alive))
      .subscribe((earningLiveUpdateCardData: LiveUpdateChart) => {
        this.earningLiveUpdateCardData = earningLiveUpdateCardData;
        this.userActivity = _.map(earningLiveUpdateCardData.liveChart, data => data.value).reverse();

        this.startReceivingLiveData(currency);
      });
  }

  startReceivingLiveData(currency) {
    if (this.intervalInstantSubscription) {
      this.intervalInstantSubscription.unsubscribe();
    }

    this.intervalInstantSubscription = interval(1000)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() =>
          this.earningService.getInstantLiveUpdateCardData(currency)
        )
      )
      .subscribe((liveUpdateChartData: any[]) => {
        this.userActivity = [..._.map(liveUpdateChartData, data => data.value)].reverse();
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
