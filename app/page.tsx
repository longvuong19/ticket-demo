"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Tên chứa tối thiểu 1 ký tự.")
    .max(50, "Tên chứa tối đa 50 ký tự.")
    .regex(/^[a-zA-Z\s]+$/, "Tên không được chứa chữ số hay kí tự đặc biệt."),

  address: z
    .string()
    .max(200, "Địa chỉ chỉ được chứa tối đa 200 ký tự.")
    .regex(/^[a-zA-Z0-9\s,\.]*$/, {
      message: "Địa chỉ không được chứa ký tự đặc biệt.",
    })
    .optional(),

  idCard: z
    .string()
    .min(1, "Yêu cầu nhập số CCCD/CMND.")
    .length(9, "ID chỉ bao gồm 9 ký tự là chữ số.")
    .regex(
      /^\d{9}$/,
      "ID chỉ được chứa số, không có khoảng trắng hoặc ký tự đặc biệt."
    ),

  dateOfBirth: z
    .string()
    .min(1, "Yêu cầu nhập ngày tháng năm sinh.")
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Ngày sinh không hợp lệ, định dạng yêu cầu là dd/mm/yyyy."
    )
    .refine(
      (val) => {
        const [day, month, year] = val.split("/").map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        if (birthDate > today) return false;

        return true;
      },
      {
        message: "Ngày sinh không được nằm trong tương lai.",
      }
    )
    .refine(
      (val) => {
        const [day, month, year] = val.split("/").map(Number);
        const maxDay = new Date(year, month, 0).getDate();

        // Nếu ngày vượt quá số ngày tối đa trong tháng => không hợp lệ
        if (day > maxDay) return false;

        return true;
      },
      {
        message: "Ngày tháng năm sinh không hợp lệ.",
      }
    ),

  typeOfClass: z.enum(["economy", "business"], {
    required_error: "Yêu cầu chọn hạng vé.",
  }),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      idCard: "",
      dateOfBirth: "",
    },
  });

  const calculateAge = (
    dateOfBirth: string
  ): { age: number; clientStatus: string } => {
    const [day, month, year] = dateOfBirth.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassedThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassedThisYear) {
      age--;
    }

    age = Math.max(age + 1, 1);

    const clientStatus = age > 7 ? "adult" : "children";
    return { age, clientStatus };
  };

  const [summary, setSummary] = useState<{
    age: number;
    clientStatus: string;
    typeOfClass: string;
    price: number;
  } | null>(null);
  const [priceConfirmed, setPriceConfirmed] = useState(false);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const { age, clientStatus } = calculateAge(values.dateOfBirth);
    console.log({ values, age, clientStatus });

    let price = 0;
    if (values.typeOfClass === "economy" && clientStatus === "adult")
      price = 3000000;
    else if (values.typeOfClass === "economy" && clientStatus === "children")
      price = 700000;
    else if (values.typeOfClass === "business" && clientStatus === "adult")
      price = 4500000;
    else if (values.typeOfClass === "business" && clientStatus === "children")
      price = 1500000;

    setSummary({ age, clientStatus, typeOfClass: values.typeOfClass, price });
    setPriceConfirmed(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-items-center p-24">
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    Tên
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên của bạn"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập địa chỉ của bạn"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="idCard"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    Số CCCD/CMND
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số CCCD/CMND của bạn"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    Ngày tháng năm sinh
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập ngày sinh của bạn"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="typeOfClass"
            render={({ field }) => {
              return (
                <FormItem className="">
                  <FormLabel>
                    Hạng vé
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vui lòng chọn hạng vé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="economy">Economy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex items-center justify-between">
            <Button onClick={() => setSummary(null)} className="cursor-pointer">
              Thành tiền
            </Button>
            {summary && (
              <div className="mt-2">
                <p>Giá vé: {summary.price.toLocaleString()} VND</p>
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full cursor-pointer"
            onClick={() => {
              handleSubmit(form.getValues());
              alert(`Đặt vé thành công!`);
              window.location.reload();
            }}
            disabled={!priceConfirmed}
          >
            Đặt vé
          </Button>
        </form>
      </Form>
    </main>
  );
}
