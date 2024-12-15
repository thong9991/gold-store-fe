'use client';

import FormModal from '@/components/FormModal';
import Table from '@/components/Table';
import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { cashDrawersColumns } from './columns/cashDrawersColumns';
import Link from 'next/link';
import { getAllCashFlows } from '@/services/cashFlows';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import { Input, Pagination } from '@nextui-org/react';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';
import { CashflowIcon } from '@/components/icons/sidebar/cashflow-icon';

type CashFlows = {
  id: number;
  amount: number;
  createdAt: string;
};

const CashFlowsListPage = () => {
  const [cashFlow, setCashFlow] = useState<CashFlows[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(SnackbarMessageType.Info);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCashDrawers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllCashFlows(currentPage);
        setCashFlow(response.body);
        setTotalPages(response.last_page);
      } catch (error) {
        console.error('Error fetch cash flow:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCashDrawers();
  }, [currentPage]);

  useEffect(() => {
    const fetchCashDrawers = async () => {
      try {
        if (isRefresh) {
          setIsLoading(true);
          const response = await getAllCashFlows(currentPage);
          if (response.body.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setCashFlow(response.body);
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

    fetchCashDrawers();
  }, [currentPage, isRefresh]);

  useEffect(() => {
    if (showMessage === true) {
      toast(message, { type: messageType });
      setShowMessage(false);
    }
  }, [showMessage, message, messageType]);

  const renderRow = ({ item, columnKey }: { item: CashFlows; columnKey: string | React.Key }) => {
    switch (columnKey) {
      case 'id':
        return (
          <div>
            <p className="text-bold text-sm">{item?.id}</p>
          </div>
        );
      case 'amount':
        return (
          <div>
            <p className="text-bold text-sm">{item?.amount}</p>
          </div>
        );

      case 'action':
        return (
          <div className="flex items-center gap-4">
            <FormModal
              table="cashFlow"
              type="delete"
              id={item.id}
              setIsRefresh={setIsRefresh}
              setShowMessage={setShowMessage}
              setMessageType={setMessageType}
              setMessage={setMessage}
            />
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
            <span>Trang chủ</span>{' '}
          </Link>
          <span> / </span>
        </li>

        <li className="flex gap-2">
          <CashflowIcon />
          <span>Dòng tiền</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>&nbsp;Danh sách</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Tất cả dòng tiền</h3>
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
      <Table data={cashFlow} columns={cashDrawersColumns} renderRow={renderRow} isLoading={isLoading} />
      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-2">
        <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};
export default CashFlowsListPage;
