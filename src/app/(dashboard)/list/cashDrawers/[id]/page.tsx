'use client';

import FormModal from '@/components/FormModal';
import Table from '@/components/Table';
import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { assetsColumns } from './columns/assetsColumns';
import { getAllAssets } from '@/services/assets';
import { useParams } from 'next/navigation';
import { assetTypes } from '@/constants';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import Link from 'next/link';
import { WalletIcon } from '@/components/icons/sidebar/wallet-icon';
import { Input, Pagination } from '@nextui-org/react';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';

type Assets = {
  id: number;
  assetType: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

const AssetsListPage = () => {
  const [assets, setAssets] = useState<Assets[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(SnackbarMessageType.Info);
  const [message, setMessage] = useState('');
  const { id: assetId } = useParams();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setIsLoading(true);
        const response = await getAllAssets(currentPage, +assetId!);
        setAssets(response.body);
        setTotalPages(response.last_page);
      } catch (error) {
        console.error('Error fetch assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [currentPage]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        if (isRefresh) {
          setIsLoading(true);
          const response = await getAllAssets(currentPage, +assetId!);
          if (response.body.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setAssets(response.body);
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

    fetchAssets();
  }, [currentPage, isRefresh]);

  useEffect(() => {
    if (showMessage === true) {
      toast(message, { type: messageType });
      setShowMessage(false);
    }
  }, [showMessage, message, messageType]);

  const renderRow = ({ item, columnKey }: { item: Assets; columnKey: string | React.Key }) => {
    switch (columnKey) {
      case 'assetsType':
        return (
          <div>
            <p className="text-bold text-sm">{assetTypes.find((asset) => asset.value === item?.assetType)?.name}</p>
          </div>
        );
      case 'amount':
        return (
          <div>
            <p className="text-bold text-sm">{item?.assetType === 'MONEY' ? `${item?.amount}đ` : item?.amount}</p>
          </div>
        );

      case 'action':
        return (
          <div className="flex items-center gap-4">
            <FormModal
              table="assets"
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
          <span>Tài sản</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>&nbsp;Danh sách</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Tất cả tài sản</h3>
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
            table="assets"
            type="create"
            setIsRefresh={setIsRefresh}
            setShowMessage={setShowMessage}
            setMessageType={setMessageType}
            setMessage={setMessage}
            relatedData={{
              drawerId: assetId,
            }}
          />
        </div>
      </div>
      {/* LIST */}
      <Table data={assets} columns={assetsColumns} renderRow={renderRow} isLoading={isLoading} />
      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-2">
        <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};
export default AssetsListPage;
