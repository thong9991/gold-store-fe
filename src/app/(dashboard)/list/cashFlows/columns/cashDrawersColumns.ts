export const cashDrawersColumns: TableColumn[] = [
  {
    header: "ID",
    accessor: "id",
  },
  {
    header: "Tài sản",
    accessor: "amount",
    className: "hidden md:table-cell",
  },
  {
    header: "Thao Tác",
    accessor: "action",
  },
];
