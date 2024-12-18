'use client';

import { Input, Pagination, Tooltip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FormModal from '@/components/FormModal';
import TableWrapper from '@/components/Table';
import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { vietnameseTrans } from '@/lib/vietnameseTrans';
import { getAllStaffs } from '@/services/staffs';
import { getAllUsers } from '@/services/users';
import { usersColumns } from './columns/usersColumns';
import Link from 'next/link';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import { UsersIcon } from '@/components/icons/sidebar/users-icon';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';

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

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(SnackbarMessageType.Info);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        setIsLoading(true);
        const response = await getAllStaffs(-1);
        setStaffs(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffs();
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

  useEffect(() => {
    if (showMessage === true) {
      toast(message, { type: messageType });
      setShowMessage(false);
    }
  }, [showMessage, message, messageType]);

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
      case 'staff':
        return (
          <div>
            <p className="text-bold text-sm">
              {item?.staff ? `${item?.staff?.firstName} ${item?.staff?.lastName}` : 'Ẩn danh'}
            </p>
          </div>
        );

      case 'action':
        return (
          <div className="flex items-center gap-4">
            <FormModal
              table="user"
              type="update"
              data={item}
              relatedData={{
                staffs: staffs,
              }}
              setIsRefresh={setIsRefresh}
              setShowMessage={setShowMessage}
              setMessageType={setMessageType}
              setMessage={setMessage}
            />
            <FormModal
              table="user"
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
          <UsersIcon />
          <span>Người dùng</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>&nbsp;Danh sách</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Tất cả người dùng</h3>
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
      <TableWrapper data={users} columns={usersColumns} renderRow={renderRow} isLoading={isLoading} />
      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-2">
        <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};
export default UserListPage;
