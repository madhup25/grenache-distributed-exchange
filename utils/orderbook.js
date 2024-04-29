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

    /* Temporary logic for matching orders:
    addOrder(order) {
        if (order.type === 'buy') {
            this.matchOrder(order, this.sellOrders, 'price', (a, b) => a >= b);
            if (order.quantity > 0) {
                this.insertOrder(this.buyOrders, order, (a, b) => b.price - a.price);
            }
        } else { // 'sell'
            this.matchOrder(order, this.buyOrders, 'price', (a, b) => a <= b);
            if (order.quantity > 0) {
                this.insertOrder(this.sellOrders, order, (a, b) => a.price - b.price);
            }
        }
    }

    matchOrder(order, oppositeOrders, priceCondition, matchCondition) {
        let i = 0;
        while (order.quantity > 0 && i < oppositeOrders.length) {
            if (matchCondition(order[priceCondition], oppositeOrders[i][priceCondition])) {
                let tradedQuantity = Math.min(order.quantity, oppositeOrders[i].quantity);
                order.quantity -= tradedQuantity;
                oppositeOrders[i].quantity -= tradedQuantity;

                if (oppositeOrders[i].quantity === 0) {
                    oppositeOrders.splice(i, 1);
                } else {
                    i++;
                }
            } else {
                break; // No more matches possible
            }
        }
    }
    */
}

module.exports = Orderbook;