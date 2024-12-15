import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';

const TableWrapper: React.FC<TableProps> = ({ data, columns, renderRow, isLoading }) => {
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className=" w-full flex flex-col gap-4">
      <Table removeWrapper isStriped aria-label="Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column?.accessor}
              align={column?.accessor === 'actions' ? 'center' : 'start'}
              className="uppercase"
            >
              {column.header}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => <TableRow>{(columnKey) => <TableCell>{renderRow({ item, columnKey })}</TableCell>}</TableRow>}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableWrapper;
