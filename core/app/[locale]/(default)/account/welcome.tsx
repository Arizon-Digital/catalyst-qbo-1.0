import { useTranslations } from "next-intl";
import { getSessionUserDetails } from "~/auth";

export async function WelcomeMessage() {
  const t = await useTranslations("Account.Home");
  const user = await getSessionUserDetails();

  return (
    <h1 className="mt-1 text-[24px] font-normal leading-[32px]">
      <span>Welcome Back ,</span>
      <span className="text-[#008BB7]">{' '}{user?.name || "Guest"}!</span>
    </h1>
  );
}
