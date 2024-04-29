const { PeerRPCServer } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

/*
    Creates an RPC server on `port` to a given `grape` in 
    a Grenache network and returns the link and RPC server.
 */
const createServer = (grape, port) => {
    const link = new Link({ grape });
    link.start();

    const peer = new PeerRPCServer(link, {
        timeout: 300000
    });
    peer.init();

    const service = peer.transport('server');
    service.listen(port);
    console.log('New server created and listening on port', port);

    return { link, service };
};

module.exports = createServer;
