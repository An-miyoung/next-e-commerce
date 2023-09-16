"use client";
import React from "react";
import FormContainer from "@/app/components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { filterFormikErrors } from "@/app/utils/formikHelpers";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const validationSchema = yup.object().shape({
  password1: yup
    .string()
    .min(7, "비밀번호는 최소 7글자이상 입력해주세요.")
    .required("비밀번호는 필수입력입니다."),
  password2: yup
    .string()
    .oneOf([yup.ref("password1")], "비밀번호가 다릅니다.")
    .required("비밀번호 확인은 필수입력입니다."),
});

interface Props {
  userId: string;
  token: string;
}

export default function UpdatePassword({ token, userId }: Props) {
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
    initialValues: { password1: "", password2: "" },
    validationSchema,
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);
      const res = await fetch("/api/users/update-password", {
        method: "POST",
        body: JSON.stringify({ password: values.password1, token, userId }),
      });
      const { message, error } = await res.json();
      if (res.ok) {
        toast.success(message);
        actions.setSubmitting(false);
        router.replace("/auth/signin");
      }
      if (!res.ok && error) {
        toast.error(error);
      }
      actions.setSubmitting(false);
    },
  });

  const errorsToRender = filterFormikErrors(touched, errors, values);

  type valueKeys = keyof typeof values;

  const { password1, password2 } = values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <FormContainer title="비밀번호를 재설정합니다." onSubmit={handleSubmit}>
      <Input
        name="password1"
        label="비밀번호"
        value={password1}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password1")}
        type="password"
        crossOrigin={undefined}
      />
      <div className="h-5"></div>
      <Input
        name="password2"
        label="비밀번호 확인"
        value={password2}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password2")}
        type="password"
        crossOrigin={undefined}
      />
      <div className="h-5"></div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        color="blue"
      >
        비밀번호 재설정
      </Button>
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
    </FormContainer>
  );
}
