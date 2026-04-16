const totalPrice = document.getElementById('total_price');
const clearCartBtn = document.getElementById('clear_cart');


// products['apples']
// const products = [
//   {
//     name: 'apples',
//     quantity: 1,
//     price: 1,
//   },
//   {
//     name: 'bananas',
//     quantity: 10,
//     price: 1,
//   },
//   {
//     name: 'bread',
//     quantity: 10,
//     price: 1,
//   },
//   {
//     name: 'eggs',
//     quantity: 1,
//     price: 1,
//   }
// ];

const products = {
  apples: {
    quantity: 1,
    price: 1,
  },
  bananas: {
    quantity: 1,
    price: 1,
  },
  bread: {
    quantity: 1,
    price: 1,
  },
  eggs: {
    quantity: 1,
    price: 1,
  }
}

let total = 0;

document.addEventListener('DOMContentLoaded', () => {
  calculateTotal();
  Object.keys(products).forEach(productName => {
    const addProductBtn = document.getElementById(`${productName}_add`);
    const removeProductBtn = document.getElementById(`${productName}_remove`);
    const productQuantity = document.getElementById(`${productName}_quantity`);
    const productCartItem = document.getElementById(`${productName}_cart`);
    const incrementButton = document.getElementById(`${productName}_increment`);

    productQuantity.textContent = products[productName].quantity;

    addProductBtn.addEventListener('click', () => addProduct(productName, productQuantity, productCartItem));
    removeProductBtn.addEventListener('click', () => removeProduct(productName, productCartItem));
  });
});

function calculateTotal () {
  total = 0;
  Object.keys(products).forEach(productName => {
    total = total + products[productName].quantity * products[productName].price;
    totalPrice.textContent = total;
  });
}


function removeProduct(productName, productCartItem) {
  products[productName].quantity = 0;
  productCartItem.classList.add('hidden');
  
  calculateTotal();
}


function addProduct (productName, productQuantitySpan, productCartItem) {
  if (products[productName].quantity === 0) productCartItem.classList.remove('hidden');

  products[productName].quantity += 1;
  productQuantitySpan.textContent = products[productName].quantity;
  
  calculateTotal();
}


// TODO: clearCart functionality, decrement & increment buttons functionality
