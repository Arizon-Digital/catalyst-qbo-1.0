'use server';

export const CreateSubscribeUsers = async (postData: any) => {
  try {
    let data = await fetch(
      `https://api.bigcommerce.com/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3/customers/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.BIGCOMMERCE_ACCESS_TOKEN,
        },
        body: JSON.stringify(postData),
        cache: 'no-store'
      },
    ).then(res => res.json())
    .then(jsonData => {
      return jsonData;
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};