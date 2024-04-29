const { PeerRPCClient } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

/*
    Creates an RPC client to a given `grape` in 
    a Grenache network and return the peer RPC client.
*/
const createClient = (grape) => {
    const link = new Link({ grape });
    link.start();

    const peer = new PeerRPCClient(link, {});
    peer.init();

    return peer;
};

module.exports = createClient;
