'use client';

import FormModal from '@/components/FormModal';
import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { vietnameseTrans } from '@/lib/vietnameseTrans';
import { getAllGoldPrices } from '@/services/goldPrice';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { goldPricesColumns } from './columns/goldPricesColumns';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import Link from 'next/link';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import {
  Table,
  Input,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  Pagination,
} from '@nextui-org/react';
import { InfoIcon } from '@/components/icons/accounts/info-icon';
import { PaymentsIcon } from '@/components/icons/sidebar/payments-icon';

type GoldPrice = {
  goldType: string;
  askPrice: number;
  bidPrice: number;
  createdAt?: string;
  updatedAt?: string;
};

const GoldPriceListPage = () => {
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(SnackbarMessageType.Info);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGoldPrices = async () => {
      try {
        setIsLoading(true);
        const response = await getAllGoldPrices(currentPage);

        setGoldPrices(response.body);
        setTotalPages(response.last_page);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoldPrices();
  }, [currentPage]);

  useEffect(() => {
    const fetchGoldPrices = async () => {
      try {
        if (isRefresh) {
          setIsLoading(true);
          const response = await getAllGoldPrices(currentPage);
          if (response.body.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setGoldPrices(response.body);
          }
          setTotalPages(response.last_page);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
        setIsRefresh(false);
      }
    };

    fetchGoldPrices();
  }, [currentPage, isRefresh]);

  useEffect(() => {
    if (showMessage === true) {
      toast(message, { type: messageType });
      setShowMessage(false);
    }
  }, [showMessage, message, messageType]);

  const renderRow = (item: GoldPrice) => (
    <tr key={item.goldType} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-blue-200">
      <td className="flex items-center gap-4 p-4">{vietnameseTrans[item.goldType]}</td>
      <td className="hidden md:table-cell">{item.askPrice.toLocaleString()},000</td>
      <td className="hidden md:table-cell">{item.bidPrice.toLocaleString()},000</td>
      <td>
        <div className="flex items-center gap-2">
          <>
            <FormModal
              table="goldPrice"
              type="update"
              data={item}
              setIsRefresh={setIsRefresh}
              setShowMessage={setShowMessage}
              setMessageType={setMessageType}
              setMessage={setMessage}
            />
          </>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      {/* TOP */}
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={'/admin'}>
            <span>Trang chủ</span>
          </Link>
          <span> / </span>
        </li>

        <li className="flex gap-2">
          <PaymentsIcon />
          <span>Giá vàng</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>&nbsp;Danh sách</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Tất cả giá vàng</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: 'w-full',
              mainWrapper: 'w-full',
            }}
            placeholder="Tìm kiếm"
          />
          <SettingsIcon />
          <InfoIcon />
        </div>
      </div>
      {/* LIST */}
      <Table removeWrapper isStriped aria-label="Table">
        <TableHeader columns={goldPricesColumns}>
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
        <TableBody>
          {goldPrices.map((row) => (
            <TableRow key={row.goldType}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === 'action' ? (
                    <FormModal
                      table="goldPrice"
                      type="update"
                      data={row}
                      setIsRefresh={setIsRefresh}
                      setShowMessage={setShowMessage}
                      setMessageType={setMessageType}
                      setMessage={setMessage}
                    />
                  ) : columnKey === 'goldType' ? (
                    vietnameseTrans[getKeyValue(row, columnKey)]
                  ) : (
                    getKeyValue(row, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-2">
        <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};
export default GoldPriceListPage;
