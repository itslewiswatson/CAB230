import { getAppUrlFromWindowLocation } from "./get-app-url";

export const onRowClick = (rowData: string[]) => {
  const symbol = rowData[0];
  const appUrl = getAppUrlFromWindowLocation();
  window.location.replace(`${appUrl}/price-history?symbol=${symbol}`);
};
