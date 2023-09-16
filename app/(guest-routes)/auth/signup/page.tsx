"use client";
import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorRender from "@/app/components/FormError";
import { filterFormikErrors } from "@/app/utils/formikHelpers";
import { POST } from "@/app/api/users/route";
import { toast } from "react-toastify";
import Link from "next/link";

const validationSchema = yup.object().shape({
  name: yup.string().required("이름은 필수입력입니다."),
  email: yup
    .string()
    .email("이메일 형식이 다릅니다.")
    .required("이메일은 필수입력입니다."),
  password: yup
    .string()
    .min(7, "비밀번호는 최소 7글자이상 입력해주세요.")
    .required("비밀번호는 필수입력입니다."),
});

export default function SignUp() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (res.ok) {
          const { message } = (await res.json()) as { message: string };
          toast.success(message);
        }
        action.setSubmitting(false);
      });
    },
  });
  const touchedKeys = Object.entries(touched).map(([key, value]) => key);

  // const formErrors: string[] = filterFormikErrors(touched, errors, values);

  const { name, email, password } = values;

  return (
    <AuthFormContainer title="새 계정을 만듭니다." onSubmit={handleSubmit}>
      <Input
        name="name"
        label="이름"
        value={name}
        crossOrigin={undefined}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <div className="h-5">
        {errors.name !== undefined && touchedKeys.includes("name") && (
          <div className="space-x-1 flex items-center text-red-500">
            <ErrorRender errorMessage={errors.name} />
          </div>
        )}
      </div>
      <Input
        name="email"
        label="이메일"
        value={email}
        crossOrigin={undefined}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <div className="h-5">
        {errors.email !== undefined && touchedKeys.includes("email") && (
          <div className="space-x-1 flex items-center text-red-500">
            <ErrorRender errorMessage={errors.email} />
          </div>
        )}
      </div>
      <Input
        name="password"
        label="비밀번호"
        type="password"
        value={password}
        crossOrigin={undefined}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <div className="h-5">
        {errors.password !== undefined && touchedKeys.includes("password") && (
          <div className="space-x-1 flex items-center text-red-500">
            <ErrorRender errorMessage={errors.password} />
          </div>
        )}
      </div>
      <Button
        disabled={isSubmitting}
        type="submit"
        className="w-full"
        color="blue"
      >
        가입하기
      </Button>
      <div className="h-5"></div>
      <div className="flex items-center justify-between">
        <Link href="/auth/signin" className="text-sm text-blue-gray-800">
          로그인
        </Link>
        <Link
          href="/auth/forget-password"
          className="text-sm text-blue-gray-800"
        >
          비밀번호 찾기
        </Link>
      </div>

      {/* {formErrors.map((err) => {
        return (
          <div key={err} className="space-x-1 flex items-center text-red-500">
            <ErrorRender errorMessage={err} />
          </div>
        );
      })} */}
    </AuthFormContainer>
  );
}
