import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import {
  UserActivityData,
  UserActive,
  Generation
} from '../../../@core/data/user-activity';

@Component({
  selector: 'ngx-user-activity',
  styleUrls: ['./user-activity.component.scss'],
  templateUrl: './user-activity.component.html'
})
export class ECommerceUserActivityComponent implements OnDestroy {
  private alive = true;

  userActivity: Generation[] = [];
  type;
  types = [];
  currentTheme: string;

  constructor(
    private themeService: NbThemeService,
    private userActivityService: UserActivityData
  ) {
    this.getDateArray();

    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    this.getUserActivity(this.type);
  }

  getUserActivity(date: string) {
    const day = new Date(date).getDate();
    this.userActivityService
      .getUserActivityData(day)
      .pipe(takeWhile(() => this.alive))
      .subscribe(userActivityData => {
        this.userActivity = userActivityData;
      });
  }

  getDateArray() {
    const today = new Date();
    let dd: number | string = today.getDate();
    let mm: number | string = today.getMonth() + 1;

    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    const list = [];

    for (let i = 1; i <= dd; i++) {
      list.push(`${mm}/${i < 10 ? '0' + i : i}/${yyyy}`);
    }

    this.types = list;
    this.type = list[today.getDate() - 1];
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
