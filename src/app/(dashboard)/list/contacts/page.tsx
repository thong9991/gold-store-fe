'use client';

import FormModal from '@/components/FormModal';
import Table from '@/components/Table';
import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { vietnameseTrans } from '@/lib/vietnameseTrans';
import { getAllContacts } from '@/services/contacts';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { contactsColumns } from './columns/contactsColumns';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import Link from 'next/link';
import { Input, Pagination } from '@nextui-org/react';
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon';
import { InfoIcon } from '@/components/icons/accounts/info-icon';
import { ContactIcon } from '@/components/icons/sidebar/contact-icon';

type Contact = {
  id: number;
  name: string;
  phoneType: string;
  phone: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const ContactListPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(SnackbarMessageType.Info);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const response = await getAllContacts(currentPage);

        setContacts(response.body);
        setTotalPages(response.last_page);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [currentPage]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (isRefresh) {
          setIsLoading(true);
          const response = await getAllContacts(currentPage);
          if (response.body.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            setContacts(response.body);
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

    fetchContacts();
  }, [currentPage, isRefresh]);

  useEffect(() => {
    if (showMessage === true) {
      toast(message, { type: messageType });
      setShowMessage(false);
    }
  }, [showMessage, message, messageType]);

  const renderRow = ({ item, columnKey }: { item: Contact; columnKey: string | React.Key }) => {
    switch (columnKey) {
      case 'name':
        return (
          <div>
            <p className="text-bold text-sm">{item?.name}</p>
          </div>
        );
      case 'phoneType':
        return (
          <div>
            <p className="text-bold text-sm">{item?.phoneType}</p>
          </div>
        );
      case 'phone':
        return (
          <div>
            <p className="text-bold text-sm">{item?.phone}</p>
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
            <span>Trang chủ</span>{' '}
          </Link>
          <span> / </span>
        </li>

        <li className="flex gap-2">
          <ContactIcon />
          <span>Danh bạ</span>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <span>&nbsp;Danh sách</span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Tất cả danh bạ</h3>
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
            table="contact"
            type="create"
            setIsRefresh={setIsRefresh}
            setShowMessage={setShowMessage}
            setMessageType={setMessageType}
            setMessage={setMessage}
          />
        </div>
      </div>
      {/* LIST */}
      <Table data={contacts} columns={contactsColumns} renderRow={renderRow} isLoading={false} />
      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-2">
        <Pagination showControls total={totalPages} initialPage={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};
export default ContactListPage;
