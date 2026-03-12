/*
===========================================================
  SHOPPING CART APPLICATION
===========================================================
In this project, you'll create a simple Shopping Cart to
simulate adding items, removing items, calculating totals,
and applying discounts.

You'll practice:
1. Classes and objects
2. Encapsulation and abstraction
3. Methods (functions inside a class)
4. Arrays and basic array methods (push, filter, find)
5. Conditional statements (if-else)

Below is a step-by-step guide with comments explaining
each part. You can test each step by running the code in
Node.js or a browser console.
*/

/*
-----------------------------------------------------------
  STEP 1: Create the ShoppingCart Class
-----------------------------------------------------------
1. Define a `ShoppingCart` class.
2. Add a constructor that initializes an empty private 
   array `#items` to store the cart items.
3. Add a `viewCart` method to display all items in the cart.
*/

class ShoppingCart {
  #items;
  #discounts = {
    SAVE10: 0.1,
    SAVE20: 0.2,
  };

  constructor() {
    this.#items = [];
  }

  viewCart() {
    console.log('Viewing cart...');

    if (this.#items.length > 0) {
      for (const item of this.#items) {
        console.log(
          `Name: ${item.name}, Price: ${item.price.amount} ${item.price.currency}, Quantity: ${item.quantity}`,
        );
      }
    } else {
      console.log('Cart is empty.');
    }

    console.log('-------------------');
  }

  addItem(name, price, quantity) {
    console.log('Adding item to the cart...');
    for (const item of this.#items) {
      if (item.name === name) {
        console.log(
          `The item with name ${name} already exists. Incrementing quantity by ${quantity}`,
        );
        item.quantity += quantity;
        console.log('-------------------');
        return;
      }
    }
    console.log(
      `Item with name ${name} is not found, adding a new item to the cart.`,
    );
    this.#items.push({ name, price, quantity }); // {name: name, price:price, quantity: quantity}

    console.log('-------------------');
  }

  removeItem(name) {
    console.log('Removing item..');
    for (let i = 0; i < this.#items.length; i++) {
      if (this.#items[i].name === name) {
        this.#items.splice(i, 1);
        console.log(`Item with name ${name} was succsessfully removed!`);
        return;
      }
    }
    console.log(`Item with name ${name} doesn\'t exist.`);
  }

  getTotal() {
    console.log('Calculating total.');
    let total = 0;
    for (let i = 0; i < this.#items.length; i++) {
      total += this.#items[i].price.amount * this.#items[i].quantity;
    }
    console.log(
      'The total amount is ',
      total + ' ' + this.#items[0].price.currency,
    );
    return total;
  }

  applyDiscount(discountCode) {
    const maybeDiscount = this.#discounts[discountCode];
    if (maybeDiscount) {
      const total = this.getTotal();
      const totalAfterDiscount = total - total * maybeDiscount;
      console.log(`Total after discount ${discountCode}: ${totalAfterDiscount}`);
      return totalAfterDiscount;
    } else {
      console.log(`Discount code ${discountCode} is not valid`);
      return null;
    }
  }
}

// This class helps us create a common structure for all items that we use
class Item {
  constructor(name, price) {
    if (typeof name === 'string' && name.trim().length > 2) {
      this.name = name;
    } else {
      throw Error('Name should be a string with more than 2 characters');
    }

    // TODO add validation to verify that price is an object with amount and currency keys, and that the currency is in uppercase 3 letter format
    this.price = price;
  }
}

const laptop = new Item('Laptop', { amount: 1000, currency: 'EUR' });
const phone = new Item('Phone', { amount: 800, currency: 'EUR' });

const shoppingCart1 = new ShoppingCart();
shoppingCart1.viewCart();
shoppingCart1.addItem(laptop.name, laptop.price, 1);
shoppingCart1.addItem(laptop.name, laptop.price, 2);
shoppingCart1.addItem(phone.name, phone.price, 5);
shoppingCart1.viewCart();
shoppingCart1.getTotal();

shoppingCart1.removeItem(laptop.name);

shoppingCart1.viewCart();
shoppingCart1.getTotal();

shoppingCart1.applyDiscount('SAVE30');
shoppingCart1.applyDiscount('SAVE10');

/*
-----------------------------------------------------------
  STEP 2: Add Items to the Cart
-----------------------------------------------------------
1. Create an `addItem` method in the `ShoppingCart` class.
2. The method should:
   - Accept `name`, `price`, and `quantity` as parameters.
   - Check if the item already exists in the cart.
     - If it exists, increase the quantity.
     - Otherwise, add the new item to the `#items` array.
*/

/*
-----------------------------------------------------------
  STEP 3: Remove Items from the Cart
-----------------------------------------------------------
1. Add a `removeItem` method to the `ShoppingCart` class.
2. The method should:
   - Accept the `name` of the item to remove.
   - Remove the item from the `#items` array if it exists.
*/

/*
-----------------------------------------------------------
  STEP 4: Calculate the Total Cost
-----------------------------------------------------------
1. Add a `getTotal` method to the `ShoppingCart` class.
2. The method should:
   - Calculate and return the total cost of all items in 
     the cart.
*/

/*
-----------------------------------------------------------
  STEP 5: Apply a Discount
-----------------------------------------------------------
1. Add an `applyDiscount` method to the `ShoppingCart` class.
2. The method should:
   - Accept a discount code (e.g., 'SAVE10', 'SAVE20').
   - Apply a percentage discount to the total cost if the 
     code is valid.
3. Use an object to store discount codes and their values.
*/
