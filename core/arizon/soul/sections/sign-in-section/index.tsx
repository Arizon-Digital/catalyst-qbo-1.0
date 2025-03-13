

import { Link } from '~/components/link';
import { SignInAction, SignInForm } from './sign-in-form';

interface Props {
  children?: React.ReactNode;
  title?: string;
  action: SignInAction;
  submitLabel?: string;
  emailLabel?: string;
  passwordLabel?: string;
  forgotPasswordHref?: string;
  forgotPasswordLabel?: string;
  newCustomerTitle?: string;
  createAccountLabel?: string;
  createAccountHref?: string;
  benefits?: string[];
}

export function SignInSection({
  title = 'Sign in',
  children,
  action,
  submitLabel = 'SIGN IN',
  emailLabel = 'Email Address:',
  passwordLabel = 'Password:',
  forgotPasswordHref = '/forgot-password',
  forgotPasswordLabel = 'Forgot your password?',
  newCustomerTitle = 'New customer?',
  createAccountLabel = 'CREATE ACCOUNT',
  createAccountHref = '/register',
  benefits = [
    'Check out faster',
    'Save multiple shipping addresses',
    'Access your order history',
    'Track new orders',
    'Save items to your Wishlist',
  ],
}: Props) {
  return (
    <div className="w-full">
      {/* Breadcrumb navigation */}
      <div className="container mx-auto py-2">
        <div className="flex items-center justify-center gap-2 text-sm mb-2 mt-9 text-gray-600">
          <Link href="/" className="hover:underline">HOME</Link>
          <span>/</span>
          <span>LOGIN</span>
        </div>
      </div>

      <div className="container mx-auto pb-9  ">
        <h1 className="text-2xl font-normal text-center mb-9 ">Sign in</h1>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
          {/* Left Column - Sign In Form */}
          <div className="w-full md:w-1/2 p-6 border border-gray-200 bg-white rounded">
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">{emailLabel}</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email" 
                  className="w-full p-3 border border-gray-300 bg-gray-100" 
                  defaultValue="priyanka@arizon.digital"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-300 p-1 rounded">
                  <span className="text-sm">⋯</span>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2">{passwordLabel}</label>
              <div className="relative">
                <input 
                  type="password" 
                  id="password" 
                  className="w-full p-3 border border-gray-300 bg-gray-100" 
                  defaultValue="•••••••"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-300 p-1 rounded">
                  <span className="text-sm">⋯</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button 
                type="submit" 
                className="px-8 py-3 bg-yellow-600 text-white font-bold uppercase rounded-md"
              >
                SIGN IN
              </button>
              <Link 
                href={forgotPasswordHref} 
                className="text-black hover:underline"
              >
                {forgotPasswordLabel}
              </Link>
            </div>
          </div>

          {/* Right Column - New Customer */}
          <div className="w-full md:w-1/2 p-6 border border-gray-200 bg-white rounded">
            <h2 className="text-lg font-bold mb-2">{newCustomerTitle}</h2>
            <p className="mb-4 font-bold">Create an account with us and you'll be able to:</p>
            
            <ul className="mb-6 space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-black ml-10 font-semibold">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              href={createAccountHref} 
              className="block w-[50%] py-2 bg-yellow-600 text-white font-normal text-center uppercase rounded-md mb-10"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}