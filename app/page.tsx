"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Yêu cầu nhập họ tên đầy đủ.")
    .max(50, "Tên không được vượt quá 50 ký tự.")
    .regex(/^[a-zA-Z\s]+$/, "Tên không được chứa chữ số hay kí tự đặc biệt."),

  address: z
    .string()
    .max(2000, "Địa chỉ chỉ được chứa tối đa 2000 ký tự.")
    .regex(
      /^[a-zA-Z0-9\s,]+$/,
      "Địa chỉ chỉ được chứa chữ cái, số, khoảng trắng và dấu phẩy."
    ),

  idCard: z
    .string()
    .min(1, "Yêu cầu nhập số ID.")
    .length(9, "ID bắt buộc bao gồm 9 ký tự.")
    .regex(
      /^\d{9}$/,
      "ID chỉ được chứa số, không có khoảng trắng hoặc ký tự đặc biệt."
    ),

  dateOfBirth: z
    .string()
    .min(1, "Yêu cầu nhập ngày sinh.")
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Ngày sinh không hợp lệ, định dạng phải là dd/mm/yyyy."
    ),

  date: z
    .string()
    .min(1, "Yêu cầu nhập ngày khởi hành.")
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Ngày không hợp lệ, định dạng phải là dd/mm/yyyy."
    ),
});

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        Test
      </main>
    </div>
  );
}
