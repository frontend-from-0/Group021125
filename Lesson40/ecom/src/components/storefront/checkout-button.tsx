import { Button } from '../ui/button';

export function CheckoutButton() {
  return (
    <form action='/api/stripe/checkout' method='POST'>
      <input type="hidden" name='price_id' value='price_1Tlv90QitHtctVUTGLkWwLM3'/>
      <input type="hidden" name='quantity' value='5'/>
      <Button type='submit' role='link'>
        Checkout
      </Button>
    </form>
  );
}
