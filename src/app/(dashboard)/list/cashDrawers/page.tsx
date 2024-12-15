'use client';

import FormModal from '@/components/FormModal';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { vietnameseTrans } from '@/lib/vietnameseTrans';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { cashDrawersColumns } from './columns/cashDrawersColumns';
import { getAllCashDrawers } from '@/services/cashDrawers';
import Link from 'next/link';
import { Input, Pagination } from '@nextui-org/react';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import { WalletIcon } from '@/components/icons/sidebar/wallet-icon';

type CashDrawer = {
  id: number;
  drawerName: string;
  drawerType: string;
  createdAt: string;
  updatedAt: string;
};

const CashDrawerListPage = () => {
  const [cashDrawers, setCashDrawers] = useState<CashDrawer[]>([]);
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
        const response = await getAllCashDrawers(currentPage);
        setCashDrawers(response.body);
        setTotalPages(response.last_page);
      } catch (error) {
        console.error('Error fetch cash drawer:', error);
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
          const response = await getAllCashDrawers(currentPage);
          if (response.body.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setCashDrawers(response.body);
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

  const renderRow = ({ item, columnKey }: { item: CashDrawer; columnKey: string | React.Key }) => {
    switch (columnKey) {
      case 'drawerName':
        return (
          <div>
            <p className="text-bold text-sm">{item?.drawerName}</p>
          </div>
        );
      case 'drawerType':
        return (
          <div>
            <p className="text-bold text-sm">{item?.drawerType}</p>
          </div>
        );

      case 'action':
        return (
          <div className="flex items-center gap-4">
            <Link href={`/list/cashDrawers/${item.id}`} className="flex items-center justify-center">
              <Image src="/search.png" alt="" width={20} height={20} />
            </Link>
            <FormModal
              table="cashDrawer"
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
          &nbsp;
          <WalletIcon />
          <span>Ngăn đựng tiền</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>&nbsp;Danh sách</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Tất cả ngăn đựng tiền</h3>
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
        <div className="flex flex-row gap-3.5 flex-wrap">
          <FormModal
            table="cashDrawer"
            type="create"
            setIsRefresh={setIsRefresh}
            setShowMessage={setShowMessage}
            setMessageType={setMessageType}
            setMessage={setMessage}
          />
        </div>
      </div>
      {/* LIST */}
      <Table data={cashDrawers} columns={cashDrawersColumns} renderRow={renderRow} isLoading={isLoading} />
      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-2">
        <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};
export default CashDrawerListPage;
