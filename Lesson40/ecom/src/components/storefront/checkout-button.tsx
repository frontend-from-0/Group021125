import { Button } from '@/components/ui/button';

export type CheckoutLineItem = {
  priceId: string;
  quantity: string | number;
};

type CheckoutButtonProps =
  | {
      items: CheckoutLineItem[];
      priceId?: never;
      quantity?: never;
    }
  | {
      priceId: string;
      quantity: string | number;
      items?: never;
    };

function resolveLineItems(props: CheckoutButtonProps): CheckoutLineItem[] {
  if (props.items) {
    return props.items;
  }

  return [{ priceId: props.priceId, quantity: props.quantity }];
}

export function CheckoutButton(props: CheckoutButtonProps) {
  const lineItems = resolveLineItems(props);

  return (
    <form action="/api/checkout" method="POST">
      {lineItems.map((item, index) => (
        <span key={`${item.priceId}-${index}`}>
          <input type="hidden" name="priceId" value={item.priceId} />
          <input
            type="hidden"
            name="quantity"
            value={String(item.quantity)}
          />
        </span>
      ))}
      <section>
        <Button type="submit" role="link">
          Checkout
        </Button>
      </section>
    </form>
  );
}
