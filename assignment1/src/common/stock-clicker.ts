import { getAppUrlFromWindowLocation } from "./get-app-url";

export const onRowClick = (rowData: string[]) => {
  const ticker = rowData[0];
  const appUrl = getAppUrlFromWindowLocation();
  window.location.replace(`${appUrl}/price-history?symbol=${ticker}`);
};
