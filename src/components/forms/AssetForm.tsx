'use client';

import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { assetSchema, AssetSchema } from '@/lib/formValidationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { FormProps } from './@types/FormProps';
import { createAsset } from '@/services/assets';
import { assetTypes } from '@/constants';

const AssetForm: React.FC<FormProps & { relatedData?: any }> = ({
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
  } = useForm<AssetSchema>({
    resolver: zodResolver(assetSchema),
  });

  const [loading, setLoading] = useState(false);
  const { drawerId } = relatedData;

  const onSubmit: SubmitHandler<AssetSchema> = async (data) => {
    try {
      setLoading(true);
      const newData = {
        cashDrawer: {
          id: drawerId ?? '',
        },
        amount: data.amount,
        assetType: data.assetType,
      };
      await createAsset(newData);
      setMessage(type === 'create' ? 'Thêm thành công' : 'Chỉnh sữa thông tin thành công');
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

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">{type === 'create' ? 'Thêm tài sản' : 'Chỉnh tài sản'}</h1>
      <div className="flex gap-4 flex-col">
        <label className="text-xs text-gray-500">Loại tài sản</label>
        <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register('assetType')}>
          <option value="-1" key="-1">
            Chọn loại tài sản
          </option>
          {assetTypes.map((item) => (
            <option value={item.value} key={item.value}>
              {item.name}
            </option>
          ))}
        </select>
        <InputField label="Tài sản" name="amount" register={register} error={errors?.amount} classStyles="md:w-full" />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md" disabled={loading}>
        {type === 'create' ? 'Thêm' : 'Xong'}
      </button>
    </form>
  );
};

export default AssetForm;
