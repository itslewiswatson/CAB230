import MUIDataTable, { MUIDataTableColumnDef } from "mui-datatables";
import React from "react";
import { onRowClick } from "../../common/stock-clicker";

interface StockTableProps {
  columns: MUIDataTableColumnDef[];
  title: string;
  data: (object | number[] | string[])[];
  onRowClick?: (rowData: string[]) => void;
}

export const StockTable = (props: StockTableProps) => {
  const { title, data, columns, onRowClick: onRowClickOverride } = props;

  return (
    <MUIDataTable
      columns={columns}
      data={data}
      title={title}
      options={{
        selectableRows: "none",
        onRowClick: !onRowClickOverride
          ? (rowData: string[]) => onRowClick(rowData)
          : onRowClickOverride,
      }}
    />
  );
};
