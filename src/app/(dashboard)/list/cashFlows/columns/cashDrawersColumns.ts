export const cashDrawersColumns: TableColumn[] = [
  {
    header: "ID",
    accessor: "id",
  },
  {
    header: "Số tiền",
    accessor: "amount",
    className: "hidden md:table-cell",
  },
  {
    header: "Thao Tác",
    accessor: "action",
  },
];
