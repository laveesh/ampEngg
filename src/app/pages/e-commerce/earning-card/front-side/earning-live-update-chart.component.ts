import { delay, takeWhile } from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy
} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'ngx-earning-live-update-chart',
  styleUrls: ['earning-card-front.component.scss'],
  template: `
    <div
      echarts
      class="echart"
      [options]="option"
      (chartInit)="onChartInit($event)"
    ></div>
  `
})
export class EarningLiveUpdateChartComponent
  implements AfterViewInit, OnDestroy, OnChanges {
  private alive = true;

  @Input() liveUpdateChartData: { value: [string, number] }[];

  option: any;
  echartsInstance;

  constructor(
    private theme: NbThemeService,
    private layoutService: LayoutService
  ) {
    this.layoutService
      .onChangeLayoutSize()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.resizeChart());
  }

  ngOnChanges(): void {
    if (this.option) {
      this.updateChartOptions(this.liveUpdateChartData);
    }
  }

  ngAfterViewInit() {
    this.theme
      .getJsTheme()
      .pipe(
        delay(1),
        takeWhile(() => this.alive)
      )
      .subscribe(config => {
        const earningLineTheme: any = config.variables.earningLine;

        this.setChartOption(earningLineTheme);
      });
  }

  setChartOption(earningLineTheme) {
    this.option = {
      grid: {
        left: 60,
        top: 10,
        right: 0,
        bottom: 60
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: '#8f9bb3',
            width: '2'
          }
        },
        axisLabel: {
          color: '#8f9bb3',
          fontSize: 12,
          rotate: 90
        },
        axisTick: {
          show: true
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        name: 'Power Generated (MW)',
        nameLocation: 'center',
        nameGap: '20',
        offset: 1,
        nameTextStyle: {
          color: '#8f9bb3',
          fontSize: 16,
          width: 100,
          padding: [0, 0, 17, 0]
        },
        type: 'value',
        boundaryGap: [0, '5%'],
        axisLine: {
          lineStyle: {
            color: '#73a0fc',
            width: '1'
          }
        },
        axisLabel: {
          color: '#8f9bb3',
          fontSize: 12
        },
        axisTick: {
          show: true
        },
        splitLine: {
          lineStyle: {
            color: '#edf1f7',
            width: '1'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: 'rgba(0, 0, 0, 0)',
            width: '0'
          },
          crossStyle: {
            color: '#73a0fc'
          }
        },
        textStyle: {
          color: earningLineTheme.tooltipTextColor,
          fontWeight: earningLineTheme.tooltipFontWeight,
          fontSize: earningLineTheme.tooltipFontSize
        },
        position: 'top',
        backgroundColor: earningLineTheme.tooltipBg,
        borderColor: earningLineTheme.tooltipBorderColor,
        borderWidth: earningLineTheme.tooltipBorderWidth,
        formatter: params =>
          `${params[0].value[1]} MW`,
        extraCssText: earningLineTheme.tooltipExtraCss
      },
      series: [
        {
          type: 'line',
          smooth: true,
          symbolSize: 20,
          itemStyle: {
            normal: {
              opacity: 0
            },
            emphasis: {
              opacity: 0
            }
          },
          lineStyle: {
            normal: {
              width: 0,
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: earningLineTheme.gradFrom,
              }, {
                offset: 1,
                color: earningLineTheme.gradTo,
              }]),
              opacity: 1,
            },
          },
          data: this.liveUpdateChartData,
        },
      ],
      animation: true,
    };
  }

  updateChartOptions(chartData: { value: [string, number] }[]) {
    this.echartsInstance.setOption({
      series: [
        {
          data: chartData
        }
      ]
    });
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
