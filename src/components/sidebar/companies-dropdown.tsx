'use client';
import Image from 'next/image';
import React, { useState } from 'react';

interface Company {
  name: string;
  location: string;
}

export const CompaniesDropdown = () => {
  const [company, setCompany] = useState<Company>({
    name: 'MLGold',
    location: 'Việt Nam',
  });
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="logo" width={32} height={32} />
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">{company.name}</h3>
        <span className="text-xs font-medium text-default-500">{company.location}</span>
      </div>
    </div>
  );
};
