

import { ForgotPasswordAction, ForgotPasswordForm } from './forgot-password-form';

interface Props {
  title?: string;
  subtitle?: string;
  action: ForgotPasswordAction;
  emailLabel?: string;
  submitLabel?: string;
}

export function ForgotPasswordSection({
  title = 'Reset password',
  subtitle = 'Fill in your email below to request a new password. An email will be sent to the address below containing a link to verify your email address.',
  emailLabel = 'Email Address',
  submitLabel = 'RESET PASSWORD',
  action,
}: Props) {
  return (
    <div className="max-w-md mx-auto p-4">
      {/* Breadcrumb navigation */}
      <div className="text-sm mb-6 text-center">
        <a href="/" className="text-gray-500 hover:text-gray-700">HOME</a>
        <span className="text-gray-400"> / FORGOT PASSWORD</span>
      </div>
      
      {/* Main content */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-center">{title}</h1>
        <p className="text-gray-700 text-left">{subtitle}</p>
      </div>
      
      {/* Pass Tailwind classes to your existing component */}
      <ForgotPasswordForm 
        action={action} 
        emailLabel={emailLabel} 
        submitLabel={submitLabel}
        // You might need to add a className prop to your ForgotPasswordForm component
        // to accept these styles, or modify your component to apply these styles internally
        className="[&_button]:bg-amber-600 [&_button]:text-white [&_button]:font-medium [&_button]:uppercase [&_button:hover]:bg-amber-700 [&_label]:text-left [&_label]:block [&_label]:mb-2"
      />
    </div>
  );
}