"use client";

import { SnackbarMessageType } from "@/enums/snackbarMessages";
import { citiesData } from "@/lib/cities";
import { districtsData } from "@/lib/districts";
import { vendorSchema, VendorSchema } from "@/lib/formValidationSchemas";
import { wardsData } from "@/lib/wards";
import { createVendor, updateVendor } from "@/services/vendors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InputField from "../InputField";
import { FormProps } from "./@types/FormProps";

const VendorForm: React.FC<FormProps> = ({
  type,
  data,
  setOpen,
  setIsRefresh,
  setShowMessage,
  setMessageType,
  setMessage,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VendorSchema>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      city: "-1",
      district: "-1",
      ward: "-1",
    },
  });
  const districtsOptions = districtsData;
  const wardsOptions = wardsData;

  const [cities] = useState<{ id: string; name: string }[]>(citiesData);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    data && data.city != "-1" ? districtsData[data.city] : [],
  );
  const [wards, setWards] = useState<{ id: string; name: string }[]>(
    data && data.district != "-1" ? wardsData[data.district] : [],
  );

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<VendorSchema> = async (data) => {
    try {
      setLoading(true);

      const cityName = cities.find((e) => e.id == data.city)?.name;
      const districtName = districts.find((e) => e.id == data.district)?.name;
      const ward = wards.find((e) => e.id == data.ward);
      const address = [
        data.homeNumber,
        ward ? ward.name : " ",
        districtName,
        cityName,
      ].join(",");

      if (type === "create") {
        await createVendor({ ...data, vendorAddress: address });
      } else {
        await updateVendor(data.id!, { ...data, vendorAddress: address });
      }

      setMessage(
        type === "create"
          ? "Thêm thành công"
          : "Chỉnh sữa thông tin thành công",
      );
      setShowMessage(true);
      setMessageType(SnackbarMessageType.Success);
      setIsRefresh(true);
    } catch (error) {
      setMessageType(SnackbarMessageType.Error);
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("An unknown error occurred while registering the user.");
      }
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("city", data.city ?? "-1");
      setValue("district", data.district ?? "-1");
      setValue("ward", data.ward ?? "-1");
      setValue("homeNumber", data.homeNumber ?? "");
    }
  }, [setValue]);

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Thêm đại lý phân phối"
          : "Chỉnh sữa đại lý phân phối"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Thông Tin Đại Lý Phân Phối
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Tên Đại Lý Phân Phối"
          name="vendorName"
          defaultValue={data?.vendorName}
          register={register}
          error={errors?.vendorName}
        />
        <InputField
          label="Mã"
          name="vendorCode"
          defaultValue={data?.vendorCode}
          register={register}
          error={errors?.vendorCode}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <input
            {...register("id")}
            className="hidden"
            defaultValue={data?.id}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">Địa Chỉ</span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Tỉnh, thành phố</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("city")}
            onChange={(e) => {
              const selectedCity = e.target.value;
              setDistricts(districtsOptions[selectedCity] || []);
              setWards([]);
              setValue("district", "-1");
              setValue("ward", "-1");
            }}
          >
            <option value="-1" key="-1">
              Chọn tỉnh thành
            </option>
            {cities.map((city: { id: string; name: string }) => (
              <option value={city.id} key={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city?.message && (
            <p className="text-xs text-red-400">
              {errors.city.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Quận, huyện</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("district")}
            onChange={(e) => {
              const selectedDistrict = e.target.value;
              setWards(wardsOptions[selectedDistrict] || []);
              setValue("ward", "-1");
            }}
          >
            <option value="-1" key="-1">
              Chọn quận, huyện
            </option>
            {districts.map((district: { id: string; name: string }) => (
              <option value={district.id} key={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.district?.message && (
            <p className="text-xs text-red-400">
              {errors.district.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Xã, thị trấn</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("ward")}
          >
            <option value="-1" key="-1">
              Chọn xã, thị trấn
            </option>
            {wards.map((ward: { id: string; name: string }) => (
              <option value={ward.id} key={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
          {errors.ward?.message && (
            <p className="text-xs text-red-400">
              {errors.ward.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Số Nhà"
          name="homeNumber"
          defaultValue={data?.homeNumber}
          register={register}
          error={errors.homeNumber}
        />
      </div>
      <button
        className="bg-blue-400 text-white p-2 rounded-md"
        disabled={loading}
      >
        {type === "create" ? "Thêm" : "Xong"}
      </button>
    </form>
  );
};

export default VendorForm;