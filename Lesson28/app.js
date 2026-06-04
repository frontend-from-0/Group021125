const ORDER_STATUSES = {
  received: 'Received',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
};

let ORDERS = [];

const form = document.getElementById('order-form');
const nameInput = document.getElementById('name-input');
const orderInput = document.getElementById('order-input');
const totalOrders = document.getElementById('total-orders');
const activeOrders = document.getElementById('active-orders');
const servedOrders = document.getElementById('served-orders');
const ordersList = document.getElementById('orders-list');

function handleFormSubmit(event) {
  event.preventDefault();

  // TODO: Validate name and order input, provide feedback to the user if needed

  const newOrder = {
    id: Date.now(),
    name: nameInput.value.trim(),
    order: orderInput.value.trim(),
    status: ORDER_STATUSES.received,
  };

  console.log('newOrder');

  ORDERS.push(newOrder);
  displayOrder(newOrder);
}

function handleOrderStatusChange(orderId) {
  console.debug('Updaing status of order:', orderId);
  const currentOrder = ORDERS.filter(o => o.id === orderId)[0];
  console.log('Found current order', currentOrder);
  let newStatus = '';
  switch (currentOrder.status) {
    case ORDER_STATUSES.received:
      newStatus = ORDER_STATUSES.preparing;
      break;
    case ORDER_STATUSES.preparing:
      newStatus = ORDER_STATUSES.ready;
      break;
    case ORDER_STATUSES.ready:
      newStatus = ORDER_STATUSES.served;
      break;
    default: 
      console.warn('Cannot transition order status from', currentOrder.status, 'for order',  currentOrder.id);
      newStatus = currentOrder.status;
  }

  const updatedOrders = ORDERS.map(order => {
    if (order.id === orderId) {
      return {
        ...currentOrder, status: newStatus
      }
    }
    return currentOrder;
  });
  console.log(updatedOrders); 
  ORDERS = updatedOrders;
  // console.log(orders);
  updateOrderDetails(orderId);
  // Update total numbers
}

function updateOrderDetails(orderId) {
  const status = document.getElementById(orderId);
  console.log( status);
  const newStatus = ORDERS.filter(order => order.id === orderId)[0].status;
  status.textContent = newStatus;
}

function displayOrder(orderToShow) {
  const li = document.createElement('li');
  li.classList.add('order-card');
  const orderCardHeader = document.createElement('div');
  orderCardHeader.classList.add('order-card-header');

  const name = document.createElement('h3');
  name.textContent = orderToShow.name;
  const orderText = document.createElement('p');
  orderText.textContent = orderToShow.order;
  const status = document.createElement('span');
  status.textContent = orderToShow.status;
  status.setAttribute('id', orderToShow.id);


  const updateStatusButton = document.createElement('button');
  updateStatusButton.textContent = 'Update status';
  updateStatusButton.addEventListener('click', () => handleOrderStatusChange(orderToShow.id));

  orderCardHeader.appendChild(name);
  orderCardHeader.appendChild(status);

  li.appendChild(orderCardHeader);
  li.appendChild(orderText);
  li.appendChild(updateStatusButton);

  ordersList.appendChild(li);
}

form.addEventListener('submit', (e) => handleFormSubmit(e));
