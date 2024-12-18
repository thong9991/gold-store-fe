import React from 'react';
import { Sidebar } from './sidebar.styles';
import { Avatar, Tooltip } from '@nextui-org/react';
import { CompaniesDropdown } from './companies-dropdown';
import { HomeIcon } from '../icons/sidebar/home-icon';
import { PaymentsIcon } from '../icons/sidebar/payments-icon';
import { AccountsIcon } from '../icons/sidebar/accounts-icon';
import { CustomersIcon } from '../icons/sidebar/customers-icon';
import { ProductsIcon } from '../icons/sidebar/products-icon';
import { ReportsIcon } from '../icons/sidebar/reports-icon';
import { SettingsIcon } from '../icons/sidebar/settings-icon';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { FilterIcon } from '../icons/sidebar/filter-icon';
import { useSidebarContext } from '../layout/layout-context';
import { usePathname } from 'next/navigation';
import { UsersIcon } from '../icons/sidebar/users-icon';
import { ContactIcon } from '../icons/sidebar/contact-icon';
import { CartIcon } from '../icons/sidebar/cart-icon';
import { WalletIcon } from '../icons/sidebar/wallet-icon';
import { CashflowIcon } from '../icons/sidebar/cashflow-icon';

const menuItems = [
  {
    title: 'Main menu',
    items: [
      {
        icon: <UsersIcon />,
        label: 'Người dùng',
        href: '/list/users',
      },
      {
        icon: <AccountsIcon />,
        label: 'Nhân viên',
        href: '/list/staffs',
      },
      {
        icon: <ContactIcon />,
        label: 'Danh bạ',
        href: '/list/contacts',
      },
      {
        icon: <CustomersIcon />,
        label: 'Đại lý phân phối',
        href: '/list/vendors',
      },
      {
        icon: <PaymentsIcon />,
        label: 'Giá vàng',
        href: '/list/goldPrices',
      },
      {
        icon: <ProductsIcon />,
        label: 'Sản phẩm',
        href: '/list/products',
      },
      {
        icon: <CartIcon />,
        label: 'Chi tiết đặt hàng',
        href: '/list/orderDetails',
      },
      {
        icon: <WalletIcon />,
        label: 'Ngăn đựng tiền',
        href: '/list/cashDrawers',
      },
      {
        icon: <CashflowIcon />,
        label: 'Dòng tiền',
        href: '/list/cashFlows',
      },
      {
        icon: <ReportsIcon />,
        label: 'Báo cáo',
        href: '/list/report',
      },
    ],
  },
  {
    title: 'Cài đặt chung',
    items: [
      {
        icon: <SettingsIcon />,
        label: 'Cài đặt',
        href: '/settings',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      // {
      //   icon: '/logout.png',
      //   label: 'Logout',
      //   href: '/logout',
      //   visible: ['admin', 'teacher', 'student', 'parent'],
      // },
    ],
  },
];

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? <div className={Sidebar.Overlay()} onClick={setCollapsed} /> : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem title="Trang chủ" icon={<HomeIcon />} isActive={pathname === '/admin'} href="/admin" />
            {menuItems.map((i) => (
              <SidebarMenu title={i.title} key={i.title}>
                {i.items.map((item) => (
                  <SidebarItem
                    key={item.label}
                    isActive={pathname === item.href}
                    title={item.label}
                    icon={item.icon}
                    href={item.href}
                  ></SidebarItem>
                ))}
              </SidebarMenu>
            ))}
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={'Settings'} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Adjustments'} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Profile'} color="primary">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="sm" />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
