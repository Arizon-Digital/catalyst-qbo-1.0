import { FragmentOf, graphql } from '~/client/graphql';

export const DeliveryinformationFragment = graphql(`
  fragment TechDataFragment on Product {
    sku
    condition
    availability
  }
`);

interface Props {
  product: FragmentOf<typeof DeliveryinformationFragment>;
}

const Deliveryinformation: React.FC<Props> = ({ product }) => {

  if (!product.sku && !product.condition && !product.availability) {
    return null; // Return null if no technical data is available
  }

  return (
    <div className="Deliveryinformation">
      <div id="Canada" className="tabcontent">
            <h1 className="text-3xl font-normal !text-[#1a] font-oswald">Delivery Information</h1>
            <div className="border-t-2 !border-[#ca9618] my-2"></div>
      
        <br />
        <p>
        We have one of the largest stocks of bearings, lubricants and ancillary products available online anywhere in Canada. We take pride in our great customer service, quality products and express shipping. 98% of our products are typically dispatch same day, with a 1-3 day delivery to Canada. All of our website prices include any taxes and duties in Canada.
        </p>
        
        <table className="delivery-info" style={{ width: '100%' }} border="0px solid #ffffff">


          <tbody>
            <tr>
              <td width="70%" className="delivery123">
                <h2 style={{ fontFamily: 'Roboto Slab' }}>1-3 Day Express Service</h2>
              </td>
              <td align="center" width="15%" className="delivery1234">
                <img src="https://cdn11.bigcommerce.com/s-03842/content/NewSite/Icons/DHL.jpg" alt="DHL logo" className="delivery-image" />
              </td>
              {/* <td align="center" width="15%" className="delivery1234">
                <img src="https://cdn11.bigcommerce.com/s-03842/images/stencil/320w/image-manager/fedex-logo.png?t=1739275696" alt="Second delivery logo" className="delivery-image" />
              </td> */}
            </tr>
          </tbody>
        </table>
        <br />
        <table className="deliverytable" >
          <tbody>
            <tr>
              <th style={{ width: '50%' }}>Order Value</th>
              <th style={{ width: '50%' }}>Delivery Cost</th>
            </tr>
            <tr>
              <td className="deliverytable-d1">$0.00 to $300.00</td>
              <td className="deliverytable-d1">$20.00</td>
            </tr>
            <tr>
              <td className="deliverytable-d2">Over $300.00</td>
              <td className="deliverytable-d2">Free Of Charge</td>
            </tr>
          </tbody>
        </table>
        <div>
          <h4>
            If you have any specific delivery requirements, call our sales team on 438 800 2658 or email us at <a href="mailto:sales@qualitybearingsonline.com">sales@qualitybearingsonline.com</a> and they will be happy to help you.
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Deliveryinformation;
