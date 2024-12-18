export const orderDetailColumns: TableColumn[] = [
  {
    header: 'Id',
    accessor: 'id',
  },
  {
    header: 'Discount',
    accessor: 'discount',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Tổng tiền',
    accessor: 'total',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Gold to cash',
    accessor: 'goldToCash',
    className: 'hidden md:table-cell',
  },

  {
    header: 'Order exchanges',
    accessor: 'orderExchanges',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Mô tả',
    accessor: 'description',
    className: 'hidden md:table-cell',
  },
];
