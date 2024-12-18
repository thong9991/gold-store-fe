'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Input, Pagination } from '@nextui-org/react';

import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { getAllOrders } from '@/services/orderDetails';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';
import { ReportsIcon } from '@/components/icons/sidebar/reports-icon';
import Table from '@/components/Table';
import { orderDetailColumns } from './columns/orderDetailColumns';

type OrderDetail = {
  id: number;
  total: number;
  goldToCash: number;
  discount: number;
  description: string;
  isChecked: boolean;
  createdAt: string;
  updatedAt: string;
};

const ReportPage = () => {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(SnackbarMessageType.Info);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await getAllOrders(currentPage);
        setOrders(response.body);
        setTotalPages(response.last_page);
      } catch (error) {
        console.error('Error fetch assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (isRefresh) {
          setIsLoading(true);
          const response = await getAllOrders(currentPage);
          if (response.body.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setOrders(response.body);
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

    fetchOrders();
  }, [currentPage, isRefresh]);

  useEffect(() => {
    if (showMessage === true) {
      toast(message, { type: messageType });
      setShowMessage(false);
    }
  }, [showMessage, message, messageType]);

  const renderRow = ({ item, columnKey }: { item: OrderDetail; columnKey: string | React.Key }) => {
    switch (columnKey) {
      case 'id':
        return (
          <div>
            <p className="text-bold text-sm">{item?.id}</p>
          </div>
        );
      case 'total':
        return (
          <div>
            <p className="text-bold text-sm">{item?.total},000</p>
          </div>
        );
      case 'goldToCash':
        return (
          <div>
            <p className="text-bold text-sm">{item?.goldToCash},000</p>
          </div>
        );
      case 'discount':
        return (
          <div>
            <p className="text-bold text-sm">{item?.discount},000</p>
          </div>
        );
      case 'description':
        return (
          <div>
            <p className="text-bold text-sm">{item?.description}</p>
          </div>
        );
      default:
        return null;
    }
  };

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
          <ReportsIcon />
          <span>Báo cáo</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>&nbsp;Danh sách</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Tất cả đơn đặt hàng trong hôm nay</h3>
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
      <Table data={orders} columns={orderDetailColumns} renderRow={renderRow} isLoading={isLoading} />
      {/* PAGINATION */}
      {/* <div className="flex items-center justify-center mt-2">
        <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
      </div> */}
    </div>
  );
};
export default ReportPage;
