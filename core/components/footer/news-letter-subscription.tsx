'use client';

import { AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateSubscribeUsers } from '~/components/management-apis';
import { Button } from '~/components/ui/button';

export const NewsLetterSubscriptions = ({ channelId} : {channelId: any}) => {

  const subscribeNewsLetter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const emailAddress: any = formData.get('nl_email') || '';
    if(validateEmail(emailAddress)) {
      let postData: any = {
        "email": emailAddress,
        "channel_id": channelId
      }
      let status = await CreateSubscribeUsers(postData);
      if(status?.data?.email) {
        toast.success('Email address added successfully',
          { icon: <Check className="text-success-secondary" /> },
         
        );
      } else {
        toast.error(status?.title), {
          icon: <AlertCircle className="text-error-secondary" />,
        }
      }
    } else {
      toast.error('Please enter valid email address.'), {
        icon: <AlertCircle className="text-error-secondary" />,
      }
    }

  }

  const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  return (
    <form className="form" onSubmit={subscribeNewsLetter} style={{ display: 'flex', alignItems: 'center' }}>
      <fieldset className="form-fieldset" style={{ display: 'flex', alignItems: 'center', border: 'none' }}>
        <div className="form-field" style={{ display: 'flex', alignItems: 'center' }}>
          <label className="form-label is-srOnly" htmlFor="nl_email">
          </label>
          <div className="form-prefixPostfix wrap" id='warp' style={{ display: 'flex', alignItems: 'center' }}>
            <input
              className="px-4 py-2 bg-white text-black border-none w-full md:w-64"
              id="nl_email"
              name="nl_email"
              type="email"
              placeholder="Your email address"
              aria-required="true"
              required
            />
            <Button
              id="subscribe"
              className="button form-prefixPostfix-button--postfix"
              loadingText="processing"
              type="submit"
            >
              SUBSCRIBE
            </Button>
          </div>
        </div>
      </fieldset>
    </form>
  )
}