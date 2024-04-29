// This RPC server will announce itself as `add_order`
// When it receives requests, it stores the payload in a queue, the queue is stored and processed in FIFO and sent to a process order worker
// Polling is used to process the queue in this example, whereas consuming AWS SQS in a Lambda or similar with retry and DLQ semantics would be preferred

'use strict';

const createServer = require('../utils/server');

const { link, service } = createServer(
    'http://127.0.0.1:30001', // grape
    1337, // port
);

setInterval(function () {
    link.announce('add_order', service.port, {});
}, 1000);

const queue = [];

service.on('request', (rid, key, payload, handler) => {
    console.log(rid, key, payload);
    queue.push(payload);
    handler.reply(null, { msg: `Order submitted for processing. Response from add order worker and port: ${service.port}` });
});

const createClient = require('../utils/client');
const client = createClient('http://127.0.0.1:30001');

// Polling to process order
setInterval(function () {
    // If queue has orders to process
    if (queue.length > 0) {
        // Send request to process order in FIFO
        client.request('process_order', queue[0], { timeout: 3000 }, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
                // On success, remove the order from queue
                queue.shift();
            }
        });
    }
}, 5000);