/* Requirements:
    1. Each client will have its own instance of the orderbook which contains a list of orders, i.e., buy and sell.
    2. Clients submit orders to their own instance of orderbook. The order is distributed to other instances, too.
    3. If a client’s order matches with another order, any remainder is added to the orderbook, too.
*/

/* Orderbook class:
    - orderbook: Array of orders
    - addOrder(): Function to add a order to the orderbook
    - distributeOrder(): Function to distribute order to other nodes
    - getOrderbook(): Function to get orderbook
    - setOrderbook(): Function to set orderbook
*/

class Orderbook {
    constructor() {
        this.orderbook = [];
    }

    getOrderbook() {
        return this.orderbook;
    }

    setOrderbook(value) {
        this.orderbook = value;
    }

    addOrder = (order) => {
        // TODO: Orderbook business logic for matching and executing orders
        this.orderbook.push(order);
    };

    distributeOrder(order, client) {
        client.request('add_order', order, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
            }
        });
    }
}

module.exports = Orderbook;