import { vietnameseTrans } from '@/lib/vietnameseTrans';
import { getAllGoldPrices } from '@/services/goldPrice';
import { Card, CardBody } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

type GoldPrice = {
  goldType: string;
  askPrice: number;
  bidPrice: number;
  createdAt?: string;
  updatedAt?: string;
};

export const CardTransactions = () => {
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGoldPrices = async () => {
      try {
        setIsLoading(true);
        const response = await getAllGoldPrices(1);

        setGoldPrices(response.body);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoldPrices();
  }, []);

  return (
    <Card className=" bg-default-50 rounded-xl shadow-md px-3">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">Giá vàng</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 ">
          {goldPrices.map((item) => (
            <div key={item.goldType} className="grid grid-cols-3 w-full">
              <span className="text-default-900  font-semibold">{vietnameseTrans[item.goldType]}</span>
              <div className="text-center">
                <span className="text-success text-base">{item.askPrice}</span>
              </div>
              <div className="text-center">
                <span className="text-default-500 text-base">{item.bidPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
