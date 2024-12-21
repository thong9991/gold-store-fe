'use client';

import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { productSchema, ProductSchema } from '@/lib/formValidationSchemas';
import { vietnameseTrans } from '@/lib/vietnameseTrans';
import { createProduct, updateProduct } from '@/services/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { FormProps } from './@types/FormProps';
import { formatFloatNumber } from '@/utils/formatContent';
import { getAllGoldPrices } from '@/services/goldPrice';

const ProductForm: React.FC<FormProps & { relatedData?: any }> = ({
  type,
  data,
  setOpen,
  setIsRefresh,
  setShowMessage,
  setMessageType,
  setMessage,
  relatedData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });
  const [goldPrices, setGoldPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const newData = data;

  useEffect(() => {
    const fetchVendorsGoldPrices = async () => {
      try {
        setIsLoading(true);
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

  const { vendors } = relatedData;
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    try {
      setLoading(true);

      const processedData = {
        ...data,
        goldPrice: {
          goldType: data.goldType,
        },
        vendor: {
          id: parseInt(data.vendorId),
        },
        totalWeight: parseFloat(data.totalWeight),
        goldWeight: parseFloat(data.goldWeight),
        gemWeight: parseFloat(data.gemWeight),
      };

      if (type === 'create') {
        await createProduct(processedData);
      } else {
        await updateProduct(newData.id!, processedData);
      }

      setMessage(type === 'create' ? 'Thêm thành công' : 'Chỉnh sửa thông tin thành công');
      setShowMessage(true);
      setMessageType(SnackbarMessageType.Success);
      setIsRefresh(true);
      setOpen(false);
    } catch (error) {
      setMessageType(SnackbarMessageType.Error);
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred while registering the user.');
      }
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">{type === 'create' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}</h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Tên Sản Phẩm"
          name="productName"
          defaultValue={newData?.productName}
          register={register}
          error={errors?.productName}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">Phân Loại Sản Phẩm</span>
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Phân Loại</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('category')}
            defaultValue={newData?.category ?? 'other'}
          >
            <option value="other" key="other">
              Chọn loại trang sức
            </option>
            <option value="ring" key="ring">
              Nhẫn
            </option>
            <option value="necklace" key="necklace">
              Dây chuyền
            </option>
            <option value="bracelet" key="bracelet">
              Vòng cổ
            </option>
          </select>
          {errors.category?.message && <p className="text-xs text-red-400">{errors.category.message.toString()}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Loại Vàng</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('goldType')}
            defaultValue={newData?.goldPrice?.goldType}
          >
            <option value="">Chọn loại vàng</option>
            {goldPrices.map((goldPrice: { goldType: string }) => (
              <option value={goldPrice?.goldType} key={goldPrice?.goldType}>
                {vietnameseTrans[goldPrice.goldType]}
              </option>
            ))}
          </select>
          {errors.goldType?.message && <p className="text-xs text-red-400">{errors.goldType.message.toString()}</p>}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Đại Lý Phân Phối</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('vendorId')}
            defaultValue={newData?.vendor?.id}
          >
            <option value="">Chọn dại lý</option>
            {vendors.map((vendor: { id: string; vendorName: string }) => (
              <option value={vendor.id} key={vendor.id}>
                {vendor.vendorName}
              </option>
            ))}
          </select>
          {errors.vendorId?.message && <p className="text-xs text-red-400">{errors.vendorId.message.toString()}</p>}
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">Thông Tin Sản Phẩm</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Tổng Trọng Lượng (chỉ)"
          name="totalWeight"
          defaultValue={newData?.totalWeight}
          register={register}
          type="number"
          inputProps={{
            onChange: (event) => {
              const progressedValue = formatFloatNumber(event.target.value);
              setValue('totalWeight', progressedValue);
            },
            step: 'any',
          }}
          error={errors?.totalWeight}
        />
        <InputField
          label="Trọng Lượng Vàng (chỉ)"
          name="goldWeight"
          defaultValue={newData?.goldWeight}
          register={register}
          type="number"
          inputProps={{
            onChange: (event) => {
              const progressedValue = formatFloatNumber(event.target.value);
              setValue('goldWeight', progressedValue);
            },
            step: 'any',
          }}
          error={errors?.goldWeight}
        />
        <InputField
          label="Trọng Lượng Đá (chỉ)"
          name="gemWeight"
          defaultValue={newData?.gemWeight}
          register={register}
          type="number"
          inputProps={{
            onChange: (event) => {
              const progressedValue = formatFloatNumber(event.target.value);
              setValue('gemWeight', progressedValue);
            },
            step: 'any',
          }}
          error={errors?.gemWeight}
        />
        <InputField
          label="Tiền Công"
          name="wage"
          defaultValue={newData?.wage}
          register={register}
          type="number"
          error={errors?.wage}
        />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md" disabled={loading}>
        {type === 'create' ? 'Thêm' : 'Xong'}
      </button>
    </form>
  );
};

export default ProductForm;
