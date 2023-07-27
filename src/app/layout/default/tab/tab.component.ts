import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DestroyService } from '@core/services/common/destory.service';
import { TabModel, TabService } from '@core/services/common/tab.service';
import { Menu } from '@core/services/types';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { LocalStorageService } from '@app/core/services/common/local.storage.service';
import { UiQuery } from '@app/core/services/State/ui/ui.query';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class TabComponent implements OnInit {
  tabsSourceData: TabModel[] = [];
  tabsSourceData$ = this.tabService.getTabArray$();
  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();
  leftMenuArray$: Observable<Menu[]> = this.splitNavStoreService.getSplitLeftNavArrayStore();
  isOverMode$ = this.themesService.getIsOverMode();
  isOverMode = false;
  isCollapsed$ = this.themesService.getIsCollapsed();
  isCollapsed = false;
  currentlySelectedTabIndex$ = this.uiQuery.currentlySelectedTabIndex$;

  constructor(
    public tabService: TabService,
    private nzContextMenuService: NzContextMenuService,
    private splitNavStoreService: SplitNavStoreService,
    private themesService: ThemeService,
    private localStorage: LocalStorageService,
    private destroy$: DestroyService,
    public router: Router,
    public cdr: ChangeDetectorRef,
    public uiQuery: UiQuery
  ) {
    this.router.events.pipe(filter((event: NzSafeAny) => event instanceof NavigationEnd)).subscribe((event: NzSafeAny) => {
      this.cdr.markForCheck();
    });
  }

  get currentIndex(): number {
    return this.tabService.getCurrentTabIndex();
  }

  public trackByTab(index: number, tab: TabModel): string {
    return tab.title;
  }

  // 点击tab跳转到对应的path
  goPage(tab: TabModel): void {
    this.router.navigateByUrl(tab.path);
  }

  ngOnInit(): void {
    this.tenantIdentifier = this.localStorage.getTenantIdentifier();
    this.initTabData();
  }

  tenantIdentifier: string | undefined;
  initTabData(): void {
    this.tabsSourceData = [
      {
        title: 'Overview',
        path: `default/${this.tenantIdentifier}/overview`,
        snapshotArray: []
      },
      {
        title: 'Programs',
        path: `default/${this.tenantIdentifier}/programs`,
        snapshotArray: []
      }
    ]
  }
}
