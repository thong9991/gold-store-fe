'use client';
import { useEffect, useState } from 'react';

import { CardAgents } from '@/components/card-balance/card-agents';
import { CardBalance1 } from '@/components/card-balance/card-balance1';
import { CardBalance2 } from '@/components/card-balance/card-balance2';
import { CardBalance3 } from '@/components/card-balance/card-balance3';
import { CardTransactions } from '@/components/card-balance/card-transactions';
import { getOrderStatistic } from '@/services/orderDetails';
import TableWrapper from '@/components/Table';
import { usersColumns } from './columns/usersColumns';
import { Pagination } from '@nextui-org/react';
import { getAllUsers } from '@/services/users';
import { vietnameseTrans } from '@/lib/vietnameseTrans';

type OrderStatistic = {
  day: {
    total: number;
    sum: number;
  };
  week: {
    total: number;
    sum: number;
  };
  month: {
    total: number;
    sum: number;
  };
};

type User = {
  id: number;
  role: string;
  email: string;
  username: string;
  staff: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
};

const AdminPage = () => {
  const [orderStatistic, setOrderStatistic] = useState<OrderStatistic>();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    const fetchOrderStatisitc = async () => {
      try {
        setIsLoading(true);
        const response = await getOrderStatistic();

        setOrderStatistic(response.body);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStatisitc();
  }, []);

  useEffect(() => {
    const fetchUsersStaffs = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUsers(currentPage);
        setUsers(response.body);
        setTotalPages(response.last_page);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersStaffs();
  }, [currentPage]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (isRefresh) {
          setIsLoading(true);
          const response = await getAllUsers(currentPage);
          if (response.body.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setUsers(response.body);
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

    fetchUsers();
  }, [currentPage, isRefresh]);

  const renderRow = ({ item, columnKey }: { item: User; columnKey: string | React.Key }) => {
    switch (columnKey) {
      case 'username':
        return (
          <div>
            <p className="text-bold text-sm">{item?.username}</p>
          </div>
        );
      case 'role':
        return (
          <div>
            <p className="text-bold text-sm">{vietnameseTrans[item?.role]}</p>
          </div>
        );
      case 'email':
        return (
          <div>
            <p className="text-bold text-sm">{item?.email}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Báo cáo thống kê</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
              <CardBalance1 data={orderStatistic?.day} />
              <CardBalance2 data={orderStatistic?.week} />
              <CardBalance3 data={orderStatistic?.month} />
            </div>
          </div>
          <div className="h-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Người dùng gần đây</h3>
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
              {/* LIST */}
              <TableWrapper data={users} columns={usersColumns} renderRow={renderRow} isLoading={isLoading} />
              {/* PAGINATION */}
              <div className="flex items-center justify-center mt-2">
                <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
              </div>
            </div>
          </div>
        </div>

        {/* Left Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <CardAgents />
            <CardTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
