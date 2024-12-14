export const assetsColumns: TableColumn[] = [
  {
    header: 'Loại tài sản',
    accessor: 'assetsType',
  },
  {
    header: 'Tài sản',
    accessor: 'amount',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Thao Tác',
    accessor: 'action',
  },
];
