import MUIDataTable, { MUIDataTableColumnDef } from "mui-datatables";
import React from "react";
import { onRowClick } from "../../common/stock-clicker";

interface StockTableProps {
  columns: MUIDataTableColumnDef[];
  title: string;
  data: (object | number[] | string[])[];
}

export const StockTable = (props: StockTableProps) => {
  const { title, data, columns } = props;

  return (
    <MUIDataTable
      columns={columns}
      data={data}
      title={title}
      options={{
        selectableRows: "none",
        onRowClick: (rowData: string[]) => onRowClick(rowData),
      }}
    />
  );
};
