// Clients can submit orders to their own instance of orderbook, and the order is distributed to other instances, too
// by sending a request to the `submit_order` worker with the order payload

// Clients can subscribe to the `orderbook_updated` event and get the updated orderbook from DHT using `link.get` with the supplied DHT `hash` value

'use strict';

const Orderbook = require('../utils/orderbook');
const createClient = require('../utils/client');
const client = createClient('http://127.0.0.1:30001');
const { v4: uuidv4 } = require('uuid');

const clientId = uuidv4();

let orderbook = new Orderbook();


const createServer = require('../utils/server');
const { link, service } = createServer(
    'http://127.0.0.1:30001', // grape
    1024 + Math.floor(Math.random() * 1000), // port
);

setInterval(function () {
    link.announce('update_orderbook', service.port, {});
}, 1000);

service.on('request', async (rid, key, payload, handler) => {
    console.log(rid, key, payload);

    handler.reply(null, { msg: `Message received. Response from client: ${clientId} and port: ${service.port}` });
    // Get orderbook from DHT by hash
    link.get(payload, (err, data) => {
        console.log('data requested to the DHT', err, data);
        if (data) {
            const updatedOrderbook = JSON.parse(data.v);
            orderbook.setOrderbook(updatedOrderbook);
            console.log("Updated Orderbook:");
            console.table(updatedOrderbook);
        }
    });
});

/* An Order would look like
    - id: UUID
    - createdBy: Client UUID
    - createdAt: Unix timestamp when the order took place
    - type: Buy or Sell
    - amount: Amount of currency
    - Price: Price for one unit of currency
*/

// Create a sample order
setTimeout(() => {
    const order = {
        id: uuidv4(),
        createdBy: clientId,
        createdAt: Date.now(),
        type: 'Buy',
        amount: Math.floor(Math.random() * 100),
        price: Math.floor(Math.random() * 10),
    };

    // Clients submit orders to their own instance of orderbook
    orderbook.addOrder(order);

    // The order is distributed to other clients orderbooks
    orderbook.distributeOrder(order, client);
}, 2000);