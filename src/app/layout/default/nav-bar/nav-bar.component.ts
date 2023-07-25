import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, share, switchMap, takeUntil, tap } from 'rxjs/operators';

import { MENU_TOKEN } from '@app/config/menu';
import { ThemeMode } from '@app/layout/default/setting-drawer/setting-drawer.component';
import { DestroyService } from '@core/services/common/destory.service';
import { TabService } from '@core/services/common/tab.service';
import { Menu } from '@core/services/types';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnStopMouseEvent } from '@utils/tools';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class NavBarComponent implements OnInit {
  @Input() isMixiHead = false; // is a mixed mode top navigation
  @Input() isMixiLeft = false;
  routerPath = this.router.url;
  themesMode: ThemeMode['key'] = 'side';
  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();
  isCollapsed$ = this.themesService.getIsCollapsed();
  isOverMode$ = this.themesService.getIsOverMode();
  leftMenuArray$ = this.splitNavStoreService.getSplitLeftNavArrayStore();
  isOverMode = false;
  isCollapsed = false;
  isMixiMode = false;
  leftMenuArray: Menu[] = [];
  menus: Menu[] = [];
  copyMenus: Menu[] = [];
  authCodeArray: string[] = [];
  subTheme$: Observable<any>;

  constructor(
    private router: Router,
    private destroy$: DestroyService,
    private userInfoService: UserInfoService,
    private menuServices: MenuStoreService,
    private splitNavStoreService: SplitNavStoreService,
    private activatedRoute: ActivatedRoute,
    private tabService: TabService,
    private cdr: ChangeDetectorRef,
    private themesService: ThemeService,
    private titleServe: Title,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(MENU_TOKEN) private menuToken: Menu[]
  ) {
    this.initMenus();

    this.subTheme$ = this.isOverMode$.pipe(
      switchMap(res => {
        this.isOverMode = res;
        return this.themesOptions$;
      }),
      tap(options => {
        this.themesMode = options.mode;
        this.isMixiMode = this.themesMode === 'mixi';
      }),
      share(),
      takeUntil(this.destroy$)
    );

    // Listen to the left menu data source in mixed mode
    this.subMixiModeSideMenu();
    // Listen to collapse menu events
    this.subIsCollapsed();
    this.subAuth();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.subTheme$.subscribe(() => {
            // When the theme is switched to mixed mode, set the data source of the left menu
            // If it is placed in the ngInit monitor, it will be in mixed mode, after refreshing the page to switch routes，runOutSideAngular
            if (this.isMixiMode) {
              this.setMixModeLeftMenu();
            }
          });
          // @ts-ignore
          this.routerPath = this.activatedRoute.snapshot['_routerState'].url;
          this.clickMenuItem(this.menus);
          this.clickMenuItem(this.copyMenus);
          // 是折叠的菜单并且不是over菜单,解决折叠左侧菜单时，切换tab会有悬浮框菜单的bug
          if (this.isCollapsed && !this.isOverMode) {
            this.closeMenuOpen(this.menus);
          }

          // The top menu mode is not the over mode. When the top mode is used
          //there will be a floating box menu bug when switching tabs
          if (this.themesMode === 'top' && !this.isOverMode) {
            this.closeMenu();
          }
        }),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => {
          return route.outlet === 'primary';
        }),
        mergeMap(route => {
          return route.data;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(routeData => {
        // Whether the details page is in the form of opening a new tab page
        let isNewTabDetailPage = routeData['newTab'] === 'true';

        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }

        this.tabService.addTab(
          {
            snapshotArray: [route.snapshot],
            title: routeData['title'],
            path: this.routerPath
          },
          isNewTabDetailPage
        );
        this.tabService.findIndex(this.routerPath);
        this.titleServe.setTitle(`${routeData['title']} - Ant Design`);
        // In the mixed mode, switch the tab to make the left menu change accordingly
        this.setMixModeLeftMenu();
      });
  }

  initMenus(): void {
    this.menus = this.menuToken;
    this.copyMenus = this.cloneMenuArray(this.menus);
    this.clickMenuItem(this.menus);
    this.clickMenuItem(this.copyMenus);
    this.cdr.markForCheck();
    console.log('static--->', this.menuToken);
    // console.log(this.copyMenus);

    // this.menuServices
    //   .getMenuArrayStore()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(menusArray => {
    //     this.menus = menusArray;
    //     console.log('API--->', this.menus);
    //     this.copyMenus = this.cloneMenuArray(this.menus);
    //     this.clickMenuItem(this.menus);
    //     this.clickMenuItem(this.copyMenus);
    //     this.cdr.markForCheck();
    //   });
  }

  // When the mixed mode is set, the data source of the left menu "auto split menu" mode
  setMixModeLeftMenu(): void {
    this.menus.forEach(item => {
      if (item.selected) {
        this.splitNavStoreService.setSplitLeftNavArrayStore(item.children || []);
      }
    });
  }

  // deep copy clone menu array
  cloneMenuArray(sourceMenuArray: Menu[], target: Menu[] = []): Menu[] {
    sourceMenuArray.forEach(item => {
      const obj: Menu = { menuName: '', menuType: 'C', path: '', id: -1, fatherId: -1 };
      for (let i in item) {
        if (item.hasOwnProperty(i)) {
          // @ts-ignore
          if (Array.isArray(item[i])) {
            // @ts-ignore
            obj[i] = this.cloneMenuArray(item[i]);
          } else {
            // @ts-ignore
            obj[i] = item[i];
          }
        }
      }
      target.push({ ...obj });
    });
    return target;
  }

  // Blend Mode Click on the first-level menu to make the first submenu under the first-level menu selected
  changTopNav(index: number): void {
    // The currently selected first-level menu object
    const currentTopNav = this.menus[index];
    let currentLeftNavArray = currentTopNav.children || [];
    // If there is a second-level menu under the first-level menu
    if (currentLeftNavArray.length > 0) {
      // Current left navigation array
      /*Added permission version*/
      // Get the authorized secondary menu collection (shown on the left)
      currentLeftNavArray = currentLeftNavArray.filter(item => {
        return this.authCodeArray.includes(item.code!);
      });
      // If the first second level menu, no third level menu
      if (currentLeftNavArray.length > 0 && !currentLeftNavArray[0].children) {
        this.router.navigateByUrl(currentLeftNavArray[0].path!);
      } else if (currentLeftNavArray.length > 0 && currentLeftNavArray[0].children) {
        // If there is a three-level menu, jump to the first three-level menu
        this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      }
      /*Added permission version end*/
      /*Annotated version without permission*/
      // const currentLeftNavArray = currentTopNav.children;
      // if (!currentLeftNavArray[0].children) {
      //   this.router.navigateByUrl(currentLeftNavArray[0].path!);
      //   this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
      // } else {
      //   this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      //   this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
      // }
    }
    this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
  }

  flatMenu(menus: Menu[], routePath: string): void {
    menus.forEach(item => {
      item.selected = false;
      item.open = false;
      if (routePath.includes(item.path) && !item.newLinkFlag) {
        item.selected = true;
        item.open = true;
      }
      if (!!item.children && item.children.length > 0) {
        this.flatMenu(item.children, routePath);
      }
    });
  }

  clickMenuItem(menus: Menu[]): void {
    if (!menus) {
      return;
    }
    const index = this.routerPath.indexOf('?') === -1 ? this.routerPath.length : this.routerPath.indexOf('?');
    const routePath = this.routerPath.substring(0, index);
    this.flatMenu(menus, routePath);
    this.cdr.markForCheck();
  }

  // Change the current menu display state
  changeOpen(currentMenu: Menu, allMenu: Menu[]): void {
    allMenu.forEach(item => {
      item.open = false;
    });
    currentMenu.open = true;
  }

  closeMenuOpen(menus: Menu[]): void {
    menus.forEach(menu => {
      menu.open = false;
      if (menu.children && menu.children.length > 0) {
        this.closeMenuOpen(menu.children);
      } else {
        return;
      }
    });
  }

  changeRoute(e: MouseEvent, menu: Menu): void {
    if (menu.newLinkFlag) {
      fnStopMouseEvent(e);
      window.open(menu.path, '_blank');
      return;
    }
    this.router.navigate([menu.path]);
  }

  // Listen to collapse menu events
  subIsCollapsed(): void {
    this.isCollapsed$.subscribe(isCollapsed => {
      this.isCollapsed = isCollapsed;
      // menu expand
      if (!this.isCollapsed) {
        this.menus = this.cloneMenuArray(this.copyMenus);
        this.clickMenuItem(this.menus);
        // In the mixed mode, click on the data source of the left menu, otherwise, when the menu with the secondary menu changes from the folded state to the expanded state, it will not
        if (this.themesMode === 'mixi') {
          this.clickMenuItem(this.leftMenuArray);
        }
      } else {
        // menu collapsed
        this.copyMenus = this.cloneMenuArray(this.menus);
        this.closeMenuOpen(this.menus);
      }
      this.cdr.markForCheck();
    });
  }

  closeMenu(): void {
    this.clickMenuItem(this.menus);
    this.clickMenuItem(this.copyMenus);
    this.closeMenuOpen(this.menus);
  }

  subAuth(): void {
    this.userInfoService
      .getUserInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.authCodeArray = res.authCode));
  }

  // 监听混合模式下左侧菜单数据源
  private subMixiModeSideMenu(): void {
    this.leftMenuArray$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.leftMenuArray = res;
    });
  }

  ngOnInit(): void {
    // 顶部模式时要关闭menu的open状态
    this.subTheme$.subscribe(options => {
      if (options.mode === 'top' && !this.isOverMode) {
        this.closeMenu();
      }
    });
  }
}
