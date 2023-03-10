import { AnalyticsUrlParams } from "analytics-client";

export const trackBalenaNavigation = (
  url: string,
  urlParamsHandler: AnalyticsUrlParams
) => {
  const baseUrl = new URL(url);
  const deviceIdQuery = urlParamsHandler.getQueryString(baseUrl);
  if (!baseUrl.search) {
    baseUrl.search = deviceIdQuery;
  } else {
    baseUrl.search = baseUrl.search + `&${deviceIdQuery}`;
  }

  return baseUrl.toString();
};
