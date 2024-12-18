import { Card, CardBody } from '@nextui-org/react';
import React from 'react';
import { Community } from '../icons/community';

interface Props {
  data?: {
    total: number;
    sum: number;
  };
}

export const CardBalance2 = ({ data }: Props) => {
  return (
    <Card className="xl:max-w-sm bg-default-50 rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">
        <div className="flex gap-2.5 mb-2">
          <Community />
          <div className="flex flex-col">
            <span className="text-default-900">Thống kê theo tuần</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center justify-between">
          <span className="text-default-900 text-lg font-semibold">Tổng đơn hàng</span>
          <span className="text-lg">{data?.total || 0}</span>
        </div>
        <div className="flex gap-2.5 py-2 items-center justify-between">
          <span className="text-default-900 text-lg font-semibold">Doanh thu</span>
          <span className="text-lg">{data?.sum || 0},000đ</span>
        </div>
      </CardBody>
    </Card>
  );
};
