'use client';

import FormModal from '@/components/FormModal';
import Table from '@/components/Table';
import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { getAllVendors } from '@/services/vendors';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { vendorColumns } from './columns/vendorsColumns';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import Link from 'next/link';
import { CustomersIcon } from '@/components/icons/sidebar/customers-icon';
import { Input, Pagination } from '@nextui-org/react';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';

type Vendor = {
  id: number;
  vendorName: string;
  vendorCode: string;
  vendorAddress: string;
  createdAt: string;
  updatedAt: string;
};

const VendorListPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(SnackbarMessageType.Info);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setIsLoading(true);
        const response = await getAllVendors(currentPage);

        setVendors(response.body);
        setTotalPages(response.last_page);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [currentPage]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        if (isRefresh) {
          setIsLoading(true);
          const response = await getAllVendors(currentPage);
          if (response.body.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setVendors(response.body);
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

    fetchVendors();
  }, [currentPage, isRefresh]);

  useEffect(() => {
    if (showMessage === true) {
      toast(message, { type: messageType });
      setShowMessage(false);
    }
  }, [showMessage, message, messageType]);

  const renderRow = ({ item, columnKey }: { item: Vendor; columnKey: string | React.Key }) => {
    switch (columnKey) {
      case 'vendorName':
        return (
          <div>
            <p className="text-bold text-sm">{item?.vendorName}</p>
          </div>
        );
      case 'vendorCode':
        return (
          <div>
            <p className="text-bold text-sm">{item?.vendorCode}</p>
          </div>
        );
      case 'vendorAddress':
        return (
          <div>
            <p className="text-bold text-sm">{item?.vendorAddress}</p>
          </div>
        );

      case 'action':
        return (
          <div className="flex items-center gap-4">
            <FormModal
              table="vendor"
              type="update"
              data={item}
              setIsRefresh={setIsRefresh}
              setShowMessage={setShowMessage}
              setMessageType={setMessageType}
              setMessage={setMessage}
            />
            <FormModal
              table="vendor"
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
          <CustomersIcon />
          <span>Đại Lý Phân Phối</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>&nbsp;Danh sách</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Tất cả đại lý phân phối</h3>
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
            table="vendor"
            type="create"
            setIsRefresh={setIsRefresh}
            setShowMessage={setShowMessage}
            setMessageType={setMessageType}
            setMessage={setMessage}
          />
        </div>
      </div>
      {/* LIST */}
      <Table data={vendors} columns={vendorColumns} renderRow={renderRow} isLoading={isLoading} />
      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-2">
        <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};
export default VendorListPage;
