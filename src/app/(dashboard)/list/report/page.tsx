'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@nextui-org/react';

import { getOrderReport } from '@/services/orderDetails';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';
import { ReportsIcon } from '@/components/icons/sidebar/reports-icon';
import Table from '@/components/Table';
import { orderDetailColumns } from './columns/orderDetailColumns';
import { vietnameseTrans } from '@/lib/vietnameseTrans';

type OrderExchange = {
  id: number;
  amount: string;
  goldPrice: {
    goldType: string;
    askPrice: number;
    bidPrice: number;
    createdAt: string;
    updatedAt: string;
  };
};

type OrderDetail = {
  id: number;
  total: number;
  goldToCash: number;
  discount: number;
  description: string;
  isChecked: boolean;
  __orderExchanges__: OrderExchange[];
};

const ReportPage = () => {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await getOrderReport();
        setOrders(response.body);
      } catch (error) {
        console.error('Error fetch assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const convertDateOrderExchange = (orders: OrderExchange[]): Record<string, number> => {
    if (!orders.length) return {};

    return orders.reduce((accumulator, currentValue) => {
      const goldType = currentValue?.goldPrice?.goldType;

      if (!goldType) {
        return accumulator;
      }

      if (!accumulator[goldType]) {
        accumulator[goldType] = 0;
      }

      accumulator[goldType] += +parseFloat(currentValue.amount.replace(/\./g, ''));
      return accumulator;
    }, {} as Record<string, number>);
  };

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
      case 'orderExchanges':
        const dataOrderExchange = convertDateOrderExchange(item.__orderExchanges__);
        return (
          <div>
            {Object.keys(dataOrderExchange).length &&
              Object.entries(dataOrderExchange).map(([key, value]) => (
                <p key={key} className="text-bold text-sm">
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{vietnameseTrans[key]}:</span> {value}
                </p>
              ))}
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
    </div>
  );
};
export default ReportPage;
