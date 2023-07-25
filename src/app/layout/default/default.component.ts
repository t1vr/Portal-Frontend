import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { fadeRouteAnimation } from '@app/animations/fade.animation';
import { IsFirstLogin } from '@config/constant';
import { DestroyService } from '@core/services/common/destory.service';
import { WindowService } from '@core/services/common/window.service';
import { ThemeService } from '@store/common-store/theme.service';

import { NavDrawerComponent } from './nav-drawer/nav-drawer.component';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation],
  providers: [DestroyService]
})
export class DefaultComponent implements OnInit, AfterViewInit {
  isCollapsed$ = this.themesService.getIsCollapsed();
  themeOptions$ = this.themesService.getThemesMode();
  isCollapsed = false;
  isOverMode = false; // Whether the navigation bar becomes a drawer mode when the window is narrowed
  @ViewChild('navDrawer') navDrawer!: NavDrawerComponent;

  constructor(private destroy$: DestroyService, private themesService: ThemeService, private windowService: WindowService) {}

  changeCollapsed(): void {
        console.log(this.isOverMode, "collapsed")

    if (this.isOverMode) {
      this.navDrawer.showDraw();
      return;
    }
    this.isCollapsed = !this.isCollapsed;
    this.themesService.setIsCollapsed(this.isCollapsed);
  }

  // Listen to various streams
  subTheme(): void {
    this.themesService
      .getIsCollapsed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.isCollapsed = res));
    this.themesService
      .getIsOverMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.isOverMode = res));
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key'];
  }

  ngAfterViewInit(): void {
    if (this.windowService.getStorage(IsFirstLogin) === 'false') {
      return;
    }
    this.windowService.setStorage(IsFirstLogin, 'false');
  }

  ngOnInit(): void {
    this.subTheme();
  }
}
