'use client';

import { SnackbarMessageType } from '@/enums/snackbarMessages';
import { userSchema, UserSchema } from '@/lib/formValidationSchemas';
import { updateUser } from '@/services/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { FormProps } from './@types/FormProps';

const UserForm: React.FC<FormProps & { relatedData?: any }> = ({
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
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  });
  const { staffs } = relatedData;

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<UserSchema> = async (data) => {
    try {
      setLoading(true);

      await updateUser(data.id!, {
        ...data,
        staff: data.staffId ? { id: data.staffId } : undefined,
      });

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

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">{type === 'create' ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'}</h1>
      <div className="flex flex-col justify-between gap-4">
        <InputField
          label="Tên Đăng Nhập"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors?.email} />
        <>
          <input {...register('id')} className="hidden" defaultValue={data?.id} />
        </>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Chức Vụ</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('role')}
            defaultValue={data?.role}
          >
            <option value="">Chọn chức vụ</option>
            <option value="sales" key="mobile">
              Nhân viên bán hàng
            </option>
            <option value="manager" key="home">
              Quản lý cửa hàng
            </option>
          </select>
          {errors.role?.message && <p className="text-xs text-red-400">{errors.role.message.toString()}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Người dùng</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('staffId')}
            defaultValue={data.staff ? data.staff.id : ''}
          >
            <option value="">Chọn người dùng</option>
            {staffs.map((staff: { id: string; firstName: string; lastName: string }) => (
              <option value={staff.id} key={staff.id}>
                {staff.firstName + ' ' + staff.lastName}
              </option>
            ))}
          </select>
          {errors.staffId?.message && <p className="text-xs text-red-400">{errors.staffId.message.toString()}</p>}
        </div>
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md" disabled={loading}>
        {type === 'create' ? 'Thêm' : 'Xong'}
      </button>
    </form>
  );
};

export default UserForm;
