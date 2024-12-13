"use client";

import { SnackbarMessageType } from "@/enums/snackbarMessages";
import { cashFlowSchema, CashFlowSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InputField from "../InputField";
import { FormProps } from "./@types/FormProps";
import { createCashFlow } from "@/services/cashFlows";

const CashFlowForm: React.FC<FormProps & { relatedData?: any }> = ({
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
  } = useForm<CashFlowSchema>({
    resolver: zodResolver(cashFlowSchema),
  });

  const [loading, setLoading] = useState(false);
  const { assetId } = relatedData;

  const onSubmit: SubmitHandler<CashFlowSchema> = async (data) => {
    try {
      setLoading(true);
      const newData = {
        asset: {
          id: assetId
        },
        amount: data?.amount,
      }
      await createCashFlow(newData);
      setMessage(
        type === "create"
          ? "Thêm thành công"
          : "Chỉnh sữa thông tin thành công",
      );
      setShowMessage(true);
      setMessageType(SnackbarMessageType.Success);
      setIsRefresh(true);
      setOpen(false);
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

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Thêm dòng tiền" : "Chỉnh dòng tiền"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Thông Tin Dòng Tiền
      </span>
      <div className="flex gap-4 flex-col">
        <InputField
          label="Số tiền"
          name="amount"
          register={register}
          error={errors?.amount}
          classStyles='md:w-full'
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

export default CashFlowForm;
