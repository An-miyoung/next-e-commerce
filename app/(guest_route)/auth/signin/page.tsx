"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
import AuthFormContainer from "@components/AuthFormContainer";
import { filterFormikErrors } from "@/app/utils/formikHelpers";
import React from "react";
import { useFormik } from "formik";
import Link from "next/link";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("이메일 형식이 다릅니다.")
    .required("이메일은 필수입력입니다."),
  password: yup
    .string()
    .min(7, "비밀번호는 최소 7글자이상 입력해주세요.")
    .required("비밀번호는 필수입력입니다."),
});

export default function SignIn() {
  const router = useRouter();
  const {
    values,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, actions) => {
      const { email, password } = values;
      const signinRes = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (signinRes?.error === "CredentialsSignin") {
        toast.error("존재하지 않는 사용자입니다.");
      }
      if (!signinRes?.error) {
        router.refresh();
      }
    },
  });

  const errorsToRender = filterFormikErrors(touched, errors, values);

  type valueKeys = keyof typeof values;

  const { email, password } = values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="로그인 합니다." onSubmit={handleSubmit}>
      <Input
        name="email"
        label="이메일"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
        crossOrigin={undefined}
      />
      <Input
        name="password"
        label="비밀번호"
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password")}
        type="password"
        crossOrigin={undefined}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        color="blue"
      >
        로그인
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup" className="text-sm text-blue-gray-800">
          회원가입
        </Link>
        <Link
          href="/auth/forget-password"
          className="text-sm text-blue-gray-800"
        >
          비밀번호 찾기
        </Link>
      </div>
      <div className="">
        {errorsToRender.map((item) => {
          return (
            <div
              key={item}
              className="space-x-1 flex items-center text-red-500"
            >
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{item}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
