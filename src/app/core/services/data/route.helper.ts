import { AppRouteUrlConstant } from "src/app/models/api.constants";

export function mergeRoutePaths(paths: string[]): string {
  let finalPath = '';
  if (paths && paths.length) {
    for (let i = 0; i < paths.length; i++) {
      if (paths[i] && paths[i].trim()) {
        let path = paths[i].trim();
        if (i === 0) {
          //if first path does not ends with "/" add it
          if (!path.endsWith(AppRouteUrlConstant.ROUTE_DEVIDER)) { path = path + AppRouteUrlConstant.ROUTE_DEVIDER };
        } else if (i === paths.length - 1) {
          //last item can not start with "/"
          if (path.startsWith(AppRouteUrlConstant.ROUTE_DEVIDER)) { path = path.replace(AppRouteUrlConstant.ROUTE_DEVIDER, '').trim(); }
          //last item can not end with '/'
          // if (path.endsWith(AppRouteUrlConstant.ROUTE_DEVIDER)) { path = path.substring(0, path.lastIndexOf(AppRouteUrlConstant.ROUTE_DEVIDER)).trim(); }
        } else {
          //other items can not start with "/"
          if (path.startsWith(AppRouteUrlConstant.ROUTE_DEVIDER)) { path = path.replace(AppRouteUrlConstant.ROUTE_DEVIDER, '').trim(); }
          //if path does not ends with "/" add it
          if (!path.endsWith(AppRouteUrlConstant.ROUTE_DEVIDER)) { path = path + AppRouteUrlConstant.ROUTE_DEVIDER };
        }
        //merge the path
        finalPath = finalPath + path;
      }
    }
  }
  return finalPath;
}
