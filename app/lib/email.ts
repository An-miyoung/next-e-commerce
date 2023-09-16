import nodemailer from "nodemailer";

type Profile = {
  name: string;
  email: string;
};

interface EmailOptions {
  profile: Profile;
  subject: "verification" | "forget-password" | "update-password";
  linkUrl?: string;
}

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
  await generateMailTransport.sendMail({
    from: "peanuts-closet@peanut.com",
    to: profile.email,
    html: `<h1 style='text-align:center'>Peanuts-Closet 회원가입을 환영합니다.</h1>
          <h2 style='text-align:center'>
            <a href="${linkUrl}">이 링크</a>를 클릭해 이메일 인증을 해주세요.
          </h2>
          `,
  });
};

const sendForgetPasswordLink = async (profile: Profile, linkUrl?: string) => {
  await generateMailTransport.sendMail({
    from: "peanuts-closet@peanut.com",
    to: profile.email,
    html: `<h1 style='text-align:center'>비밀번호를 재설정합니다.</h1>
          <h2 style='text-align:center'>
            <a href="${linkUrl}">이 링크</a>를 눌러 비밀번호를 재설정하세요.
          </h2>
          `,
  });
};

const sendUpdatePasswordLink = async (profile: Profile) => {
  await generateMailTransport.sendMail({
    from: "peanuts-closet@peanut.com",
    to: profile.email,
    html: `<h1 style='text-align:center'>비밀번호가 재설정됐습니다.</h1>
          <h2 style='text-align:center'>재설정된 비밀번호로 
            <a href="${process.env.SIGN_IN_URL}">로그인</a>하세요.
          </h2>
          `,
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
