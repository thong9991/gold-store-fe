import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarItem } from '@nextui-org/react';
import React, { useCallback } from 'react';
import { DarkModeSwitch } from './darkmodeswitch';
import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';

export const UserDropdown = () => {
  const router = useRouter();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') as any);

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('userInfo');
    router.replace('/sign-in');
  }, [router]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar as="button" color="secondary" size="md" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="User menu actions" onAction={(actionKey) => console.log({ actionKey })}>
        <DropdownItem key="profile" className="flex flex-col justify-start w-full items-start">
          <p>Đăng nhập bởi</p>
          <p>{userInfo?.email}</p>
        </DropdownItem>
        <DropdownItem key="settings">Cài đặt của bạn</DropdownItem>
        <DropdownItem key="logout" color="danger" className="text-danger" onPress={handleLogout}>
          Đăng xuất
        </DropdownItem>
        <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
