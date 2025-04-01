import { ChangePasswordAction, ChangePasswordForm } from './change-password-form';
import { Account, UpdateAccountAction, UpdateAccountForm } from './update-account-form';

interface Props {
  title?: string;
  account: Account;
  updateAccountAction: UpdateAccountAction;
  updateAccountSubmitLabel?: string;
  changePasswordTitle?: string;
  changePasswordAction: ChangePasswordAction;
  changePasswordSubmitLabel?: string;
}

export function AccountSettingsSection({
  title = 'Account Settings',
  account,
  updateAccountAction,
  updateAccountSubmitLabel,
  changePasswordTitle = 'Change Password',
  changePasswordAction,
  changePasswordSubmitLabel,
}: Props) {
  return (
    <div className="@container flex flex-col items-center w-full">
      {/* Breadcrumbs navigation */}
      <nav className="flex font-robotoslab text-black font-bold max-w-2xl mx-auto mb-5 mt-9">
        <ol className="flex items-center space-x-2 text-sm">
          <li className="text-contrast-500">
            <a href="/account/orders/" className="hover:text-contrast-700">
              Orders
            </a>
          </li>
          <li className="text-contrast-500">/</li>
          <li className="text-contrast-500">
            <a href="/account/addresses" className="hover:text-contrast-700">
              Addresses
            </a>
          </li>
          <li className="text-contrast-500">/</li>
          <li className="text-contrast-800 font-medium">
            <a href="/account/settings/" className="border-b-2 border-primary-500 pb-1">
              Account settings
            </a>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-y-24 @xl:flex-row">
        <div className="flex w-full flex-col @xl:max-w-[102rem] ml-10 mr-10">
          <div className="pb-12">
            <h1 className="mb-8 text-3xl font-black lg:text-4xl text-center font-robotoslab">{title}</h1>
            <UpdateAccountForm
              account={account}
              action={updateAccountAction}
              submitLabel={updateAccountSubmitLabel}
            />
          </div>
          <div className="border-t border-contrast-100 pt-12">
            <h1 className="mb-10 text-2xl font-medium leading-none @xl:text-2xl font-robotoslab">
              {changePasswordTitle}
            </h1>
            <ChangePasswordForm
              action={changePasswordAction}
              submitLabel={changePasswordSubmitLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}