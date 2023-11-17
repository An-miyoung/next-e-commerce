import nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";

type Profile = {
  name: string;
  email: string;
};

interface EmailOptions {
  profile: Profile;
  subject: "verification" | "forget-password" | "update-password";
  linkUrl?: string;
}

const TOKEN = process.env.MAILTRAP_TOKEN!;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT!;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });
const sender = {
  email: "support@nextecom.site",
  name: "Next Ecom Verification",
};

const generateMailTransport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "bba5cff856b0b4",
    pass: "ae82f06d522b95",
  },
});

const sendEmailVerificationLink = async (
  profile: Profile,
  linkUrl?: string
) => {
  // 개발용 테스트코드
  // await generateMailTransport.sendMail({
  //   from: "peanuts-closet@peanut.com",
  //   to: profile.email,
  //   html: `<h1 style='text-align:center'>Peanuts-Closet 회원가입을 환영합니다.</h1>
  //         <h2 style='text-align:center'>
  //           <a href="${linkUrl}">이 링크</a>를 클릭해 이메일 인증을 해주세요.
  //         </h2>
  //         `,
  // });
  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "51c0599e-4632-4fff-b8e3-dae8cfc74ac3",
    template_variables: {
      subject: "이메일 인증",
      user_name: profile.name,
      link: linkUrl!,
      btn_title: "이메일 인증",
    },
  });
};

const sendForgetPasswordLink = async (profile: Profile, linkUrl?: string) => {
  // await generateMailTransport.sendMail({
  //   from: "peanuts-closet@peanut.com",
  //   to: profile.email,
  //   html: `<h1 style='text-align:center'>비밀번호를 재설정합니다.</h1>
  //         <h2 style='text-align:center'>
  //           <a href="${linkUrl}">이 링크</a>를 눌러 비밀번호를 재설정하세요.
  //         </h2>
  //         `,
  // });
  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "90f77168-b392-4881-bf12-259f1b3f3465",
    template_variables: {
      subject: "비밀번호 재설정",
      title: "비밀번호를 재설정합니다.",
      email: profile.email,
      pass_reset_link: linkUrl!,
      user_email: profile.email,
      description: " 계정에 대한 비밀번호를 재설정합니다.",
      btn_name: "비밀번호재설정",
    },
  });
};

const sendUpdatePasswordLink = async (profile: Profile) => {
  // await generateMailTransport.sendMail({
  //   from: "peanuts-closet@peanut.com",
  //   to: profile.email,
  //   html: `<h1 style='text-align:center'>비밀번호가 재설정됐습니다.</h1>
  //         <h2 style='text-align:center'>재설정된 비밀번호로
  //           <a href="${process.env.SIGN_IN_URL}">로그인</a>하세요.
  //         </h2>
  //         `,
  // });
  const recipients = [
    {
      email: profile.email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    subject: "비밀번호 재설정",
    template_uuid: "90f77168-b392-4881-bf12-259f1b3f3465",
    template_variables: {
      subject: "비밀번호 재설정완료",
      title: "비밀번호를 재설정됐습니다..",
      email: profile.email,
      pass_reset_link: process.env.API_SIGN_IN_ENDPOINT!,
      user_email: profile.email,
      description: " 계정의 새로운 비밀번호로 로그인하세요",
      btn_name: "로그인",
    },
  });
};

export const sendEmail = (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification":
      return sendEmailVerificationLink(profile, linkUrl);
    case "forget-password":
      return sendForgetPasswordLink(profile, linkUrl);
    case "update-password":
      return sendUpdatePasswordLink(profile);
  }
};
