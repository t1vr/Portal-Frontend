import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { getDeepReuseStrategyKeyFn, fnGetPathWithoutParam } from '@utils/tools';
import _ from 'lodash';

import { SimpleReuseStrategy } from './reuse-strategy';

export interface TabModel {
  title: string;
  path: string;
  snapshotArray: ActivatedRouteSnapshot[];
}

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabArray$ = new BehaviorSubject<TabModel[]>([]);
  private tabArray: TabModel[] = [];
  private currSelectedIndexTab = 0;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  getTabArray$(): Observable<TabModel[]> {
    return this.tabArray$.asObservable();
  }

  setTabArray$(tabArray: TabModel[]): void {
    this.tabArray$.next(tabArray);
  }

  setTabsSourceData(): void {
    this.setTabArray$(this.tabArray);
  }

  clearTabs(): void {
    this.tabArray = [];
    this.setTabsSourceData();
  }

  addTab(param: TabModel, isNewTabDetailPage = false): void {
    this.tabArray.forEach(tab => {
      if (tab.title === param.title && !isNewTabDetailPage) {
        tab.snapshotArray = _.uniqBy([...tab.snapshotArray, ...param.snapshotArray], item => {
          return item['_routerState'].url;
        });
        tab.path = param.path;
      }
    });
    if (!this.tabArray.find(value => value.path === param.path)) {
      this.tabArray.push(param);
    }
    this.setTabsSourceData();
  }

  findIndex(path: string): number {
    const current = this.tabArray.findIndex(tabItem => {
      return path === tabItem.path;
    });
    this.currSelectedIndexTab = current;
    return current;
  }

  getCurrentPathWithoutParam(urlSegmentArray: UrlSegment[], queryParam: { [key: string]: any }): string {
    const temp: string[] = [];
    const queryParamValuesArray = Object.values(queryParam);
    urlSegmentArray.forEach(urlSeqment => {
      if (!queryParamValuesArray.includes(urlSeqment.path)) {
        temp.push(urlSeqment.path);
      }
    });
    return `${temp.join('/')}`;
  }

  refresh(): void {
    let snapshot = this.activatedRoute.snapshot;
    const key = getDeepReuseStrategyKeyFn(snapshot);
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    let params: Params;
    let urlWithOutParam = '';
    if (Object.keys(snapshot.params).length > 0) {
      params = snapshot.params;
      urlWithOutParam = this.getCurrentPathWithoutParam(snapshot['_urlSegment'].segments, params);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([urlWithOutParam, ...Object.values(params)]);
      });
    } else {
      params = snapshot.queryParams;
      const sourceUrl = this.router.url;
      const currentRoute = fnGetPathWithoutParam(sourceUrl);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([currentRoute], { queryParams: params });
      });
    }
  }

  getCurrentTabIndex(): number {
    return this.currSelectedIndexTab;
  }
}
