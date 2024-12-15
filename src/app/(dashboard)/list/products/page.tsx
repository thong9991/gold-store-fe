'use client';

import FormModal from '@/components/FormModal';
import Table from '@/components/Table';
import { productsColumns } from './columns/productsColumns';
import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { vietnameseTrans } from '@/lib/vietnameseTrans';
import { getAllProducts } from '@/services/products';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllVendors } from '@/services/vendors';
import { getAllGoldPrices } from '@/services/goldPrice';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import Link from 'next/link';
import { ProductsIcon } from '@/components/icons/sidebar/products-icon';
import { Input, Pagination } from '@nextui-org/react';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';

type Product = {
  id: number;
  productName: string;
  category: string;
  totalWeight: number;
  goldWeight: number;
  gemWeight: number;
  wage: number;
  createdAt: string;
  updatedAt: string;
  goldPrice: {
    goldType: string;
  };
  vendor: {
    id: number;
    vendorName: string;
    vendorAddress: string;
  };
};

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [goldPrices, setGoldPrices] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(SnackbarMessageType.Info);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVendorsGoldPrices = async () => {
      try {
        setIsLoading(true);
        const vendors = await getAllVendors(-1);
        setVendors(vendors);
        const goldPrices = await getAllGoldPrices(-1);
        setGoldPrices(goldPrices);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorsGoldPrices();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getAllProducts(currentPage);

        setProducts(response.body);
        setTotalPages(response.last_page);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (isRefresh) {
          setIsLoading(true);
          const response = await getAllProducts(currentPage);
          if (response.body.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setProducts(response.body);
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

    fetchProducts();
  }, [currentPage, isRefresh]);

  useEffect(() => {
    if (showMessage === true) {
      toast(message, { type: messageType });
      setShowMessage(false);
    }
  }, [showMessage, message, messageType]);

  const renderRow = ({ item, columnKey }: { item: Product; columnKey: string | React.Key }) => {
    switch (columnKey) {
      case 'productInfo':
        return (
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">{item?.productName}</h3>
            <p className="text-xs text-gray-500">{item?.id}</p>
          </div>
        );
      case 'category/goldType':
        return (
          <div>
            <p className="text-bold text-sm">
              {vietnameseTrans[item?.category]} {vietnameseTrans[`category_${item?.goldPrice?.goldType}`]}
            </p>
          </div>
        );
      case 'vendorCode':
        return (
          <div>
            <p className="text-bold text-sm">{item?.vendor?.vendorName}</p>
          </div>
        );
      case 'totalWeight':
        return (
          <div>
            <p className="text-bold text-sm">{parseFloat(item?.totalWeight.toString())}</p>
          </div>
        );
      case 'goldWeight':
        return (
          <div>
            <p className="text-bold text-sm">{parseFloat(item?.goldWeight.toString())}</p>
          </div>
        );
      case 'gemWeight':
        return (
          <div>
            <p className="text-bold text-sm">{parseFloat(item.gemWeight.toString())}</p>
          </div>
        );
      case 'wage':
        return (
          <div>
            <p className="text-bold text-sm">{item?.wage}.000 đ</p>
          </div>
        );

      case 'action':
        return (
          <div className="flex items-center gap-4">
            <FormModal
              table="product"
              type="update"
              data={item}
              setIsRefresh={setIsRefresh}
              setShowMessage={setShowMessage}
              setMessageType={setMessageType}
              setMessage={setMessage}
              relatedData={{
                vendors: vendors,
                goldPrices: goldPrices,
              }}
            />
            <FormModal
              table="product"
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
          <ProductsIcon />
          <span>Sản phẩm</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>&nbsp;Danh sách</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Tất cả sản phẩm</h3>
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
            table="product"
            type="create"
            setIsRefresh={setIsRefresh}
            setShowMessage={setShowMessage}
            setMessageType={setMessageType}
            setMessage={setMessage}
            relatedData={{
              vendors: vendors,
              goldPrices: goldPrices,
            }}
          />
        </div>
      </div>
      {/* LIST */}
      <Table data={products} columns={productsColumns} renderRow={renderRow} isLoading={isLoading} />
      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-2">
        <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};
export default ProductListPage;
