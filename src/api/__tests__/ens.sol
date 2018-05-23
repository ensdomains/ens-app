pragma solidity ^0.4.23;

/**
 * The ENS registry contract.
 */
contract ENS {
    struct Record {
        address owner;
        address resolver;
    }
    
    mapping(bytes32=>Record) records;
    
    // Logged when the owner of a node assigns a new owner to a subnode.
    event NewOwner(bytes32 indexed node, bytes32 indexed label, address owner);

    // Logged when the owner of a node transfers ownership to a new account.
    event Transfer(bytes32 indexed node, address owner);

    // Logged when the owner of a node changes the resolver for that node.
    event NewResolver(bytes32 indexed node, address resolver);
    
    // Permits modifications only by the owner of the specified node.
    modifier only_owner(bytes32 node) {
        if(records[node].owner != msg.sender) throw;
        _;
    }
    
    /**
     * Constructs a new ENS registrar, with the provided address as the owner of the root node.
     */
    function ENS(address owner) {
        records[0].owner = owner;
    }
    
    /**
     * Returns the address that owns the specified node.
     */
    function owner(bytes32 node) constant returns (address) {
        return records[node].owner;
    }
    
    /**
     * Returns the address of the resolver for the specified node.
     */
    function resolver(bytes32 node) constant returns (address) {
        return records[node].resolver;
    }

    /**
     * Transfers ownership of a node to a new address. May only be called by the current
     * owner of the node.
     * @param node The node to transfer ownership of.
     * @param owner The address of the new owner.
     */
    function setOwner(bytes32 node, address owner) only_owner(node) {
        Transfer(node, owner);
        records[node].owner = owner;
    }

    /**
     * Transfers ownership of a subnode sha3(node, label) to a new address. May only be
     * called by the owner of the parent node.
     * @param node The parent node.
     * @param label The hash of the label specifying the subnode.
     * @param owner The address of the new owner.
     */
    function setSubnodeOwner(bytes32 node, bytes32 label, address owner) only_owner(node) {
        var subnode = sha3(node, label);
        NewOwner(node, label, owner);
        records[subnode].owner = owner;
    }

    /**
     * Sets the resolver address for the specified node.
     * @param node The node to update.
     * @param resolver The address of the resolver.
     */
    function setResolver(bytes32 node, address resolver) only_owner(node) {
        NewResolver(node, resolver);
        records[node].resolver = resolver;
    }
}

contract Resolver {
    event AddrChanged(bytes32 indexed node, address a);
    event ContentChanged(bytes32 indexed node, bytes32 content);
    event NameChanged(bytes32 indexed node, string name);

    function setName(bytes32 node, string name) public;
    function has(bytes32 node, bytes32 kind) returns (bool);
    function addr(bytes32 node) constant returns (address ret);
}

/**
 * A simple resolver anyone can use; only allows the owner of a node to set its
 * address.
 */
contract PublicResolver is Resolver {
    ENS ens;

    struct Reverse {
        uint256 contentType;
        bytes data;
    }

    mapping(bytes32=>address) addresses;
    mapping(bytes32=>bytes32) contents;
    mapping(bytes32=>string) names;
    mapping(bytes32=>Reverse) reverses;
    
    modifier only_owner(bytes32 node) {
        if(ens.owner(node) != msg.sender) throw;
        _;
    }

    /**
     * Constructor.
     * @param ensAddr The ENS registrar contract.
     */
    function PublicResolver(address ensAddr) {
        ens = ENS(ensAddr);
    }

    /**
     * Fallback function.
     */
    function() {
        throw;
    }

    /**
     * Returns true if the specified node has the specified record type.
     * @param node The ENS node to query.
     * @param kind The record type name, as specified in EIP137.
     * @return True if this resolver has a record of the provided type on the
     *         provided node.
     */
    function has(bytes32 node, bytes32 kind) returns (bool) {
        return kind == "addr" && addresses[node] != 0;
    }
    
    /**
     * Returns the address associated with an ENS node.
     * @param node The ENS node to query.
     * @return The associated address.
     */
    function addr(bytes32 node) constant returns (address ret) {
        ret = addresses[node];
        if(ret == 0)
            throw;
    }

    /**
     * Sets the address associated with an ENS node.
     * May only be called by the owner of that node in the ENS registry.
     * @param node The node to update.
     * @param addr The address to set.
     */
    function setAddr(bytes32 node, address addr) only_owner(node) {
        addresses[node] = addr;
        AddrChanged(node, addr);
    }

    function content(bytes32 node) constant returns (bytes32 ret) {
        ret = contents[node];
        if(ret == 0)
            throw;
    }

    function setContent(bytes32 node, bytes32 content) only_owner(node) {
        contents[node] = content;
        ContentChanged(node, content);
    }

    /**
     * Returns the name associated with an ENS node.
     * @param node The ENS node to query.
     * @return The associated name.
     */
    function name(bytes32 node) constant returns (string ret) {
        ret = names[node];
        if(bytes(ret).length == 0)
            throw;
        return ret;
    }

    /**
     * Sets the name associated with an ENS node.
     * May only be called by the owner of that node in the ENS registry.
     * @param node The node to update.
     * @param name The name to set.
     */
    function setName(bytes32 node, string name) only_owner(node) {
        names[node] = name;
        NameChanged(node, name);
    }

    function ABI(bytes32 node, uint256 contentType) constant returns (uint256, bytes) {
        var record = reverses[node];
        if((record.contentType & contentType) == 0)
            return (0, "");
        return (record.contentType, record.data);
    }

    function setABI(bytes32 node, uint256 contentType, bytes data) only_owner(node) {
        reverses[node] = Reverse(contentType, data);
    }
}

contract ReverseRegistrar {
    ENS public ens;
    bytes32 public rootNode;
    Resolver public defaultResolver;
    
    /**
     * @dev Constructor
     * @param ensAddr The address of the ENS registry.
     * @param node The node hash that this registrar governs.
     */
    function ReverseRegistrar(ENS ensAddr, bytes32 node, Resolver resolverAddr ) {
        ens = ensAddr;
        rootNode = node;
        defaultResolver = resolverAddr;
    }

    /**
     * @dev Transfers ownership of the reverse ENS record associated with the
     *      calling account.
     * @param owner The address to set as the owner of the reverse record in ENS.
     * @return The ENS node hash of the reverse record.
     */
    function claim(address owner) public returns (bytes32) {
        return claimWithResolver(owner, 0);
    }

    /**
     * @dev Transfers ownership of the reverse ENS record associated with the
     *      calling account.
     * @param owner The address to set as the owner of the reverse record in ENS.
     * @param resolver The address of the resolver to set; 0 to leave unchanged.
     * @return The ENS node hash of the reverse record.
     */
    function claimWithResolver(address owner, address resolver) public returns (bytes32) {
        var label = sha3HexAddress(msg.sender);
        bytes32 node = keccak256(rootNode, label);
        var currentOwner = ens.owner(node);

        // Update the resolver if required
        if (resolver != 0 && resolver != ens.resolver(node)) {
            // Transfer the name to us first if it's not already
            if (currentOwner != address(this)) {
                ens.setSubnodeOwner(rootNode, label, this);
                currentOwner = address(this);
            }
            ens.setResolver(node, resolver);
        }

        // Update the owner if required
        if (currentOwner != owner) {
            ens.setSubnodeOwner(rootNode, label, owner);
        }

        return node;
    }

    /**
     * @dev Sets the `name()` record for the reverse ENS record associated with
     * the calling account. First updates the resolver to the default reverse
     * resolver if necessary.
     * @param name The name to set for this address.
     * @return The ENS node hash of the reverse record.
     */
    function setName(string name) public returns (bytes32) {
        bytes32 node = claimWithResolver(this, defaultResolver);
        defaultResolver.setName(node, name);
        return node;
    }

    /**
     * @dev Returns the node hash for a given account's reverse records.
     * @param addr The address to hash
     * @return The ENS node hash.
     */
    function node(address addr) constant returns (bytes32 ret) {
        return sha3(rootNode, sha3HexAddress(addr));
    }

    /**
     * @dev An optimised function to compute the sha3 of the lower-case
     *      hexadecimal representation of an Ethereum address.
     * @param addr The address to hash
     * @return The SHA3 hash of the lower-case hexadecimal encoding of the
     *         input address.
     */
    function sha3HexAddress(address addr) private returns (bytes32 ret) {
        addr; ret; // Stop warning us about unused variables
        assembly {
            let lookup := 0x3031323334353637383961626364656600000000000000000000000000000000
            let i := 40
        loop:
            i := sub(i, 1)
            mstore8(i, byte(and(addr, 0xf), lookup))
            addr := div(addr, 0x10)
            i := sub(i, 1)
            mstore8(i, byte(and(addr, 0xf), lookup))
            addr := div(addr, 0x10)
            jumpi(loop, i)
            ret := keccak256(0, 40)
        }
    }
}

contract DeployENS {
    ENS public ens;
    ReverseRegistrar public reverseregistrar;
    Resolver public publicresolver;
    
    constructor() public {
        var tld = sha3('eth');
        var tldnode = sha3(bytes32(0), tld);
        ens = new ENS(this);
        var resolver = new PublicResolver(ens);
        publicresolver = resolver;

        // Set addr.reverse up with the reverse registrar
        var reversenode = sha3(bytes32(0), sha3('reverse'));
        bytes32 ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;
        //var addrReverseNode = sha3(reversenode, sha3('addr'));
        reverseregistrar = new ReverseRegistrar(ens, ADDR_REVERSE_NODE , resolver);
        ens.setSubnodeOwner(0, sha3('reverse'), this);
        ens.setSubnodeOwner(reversenode, sha3('addr'), reverseregistrar);

        // Set up the reverse record for ourselves
        var ournode = reverseregistrar.claim(address(this));
        ens.setResolver(ournode, resolver);
        resolver.setName(ournode, "deployer.eth");
        resolver.setABI(ournode, 2, hex"789c754e390ac33010fccbd4aa0249a1af98141b2183c0590969b630c27f8f6c12838b74c3dc5347c8da284a78568b0e498bb1c14f4f079577840763231cb2f12bf59f3258ae65479694b7fb03db881559e5b50c7696a5c5d3329b06a6acd85cbfccfcf11fcfaa05e63a6a3f5f113a4a");
        
        // Set foo.eth up with a resolver, ABI, and addr record
        ens.setSubnodeOwner(0, tld, this);
        ens.setSubnodeOwner(tldnode, sha3('foo'), this);
        var fooDotEth = sha3(tldnode, sha3('foo'));
        ens.setResolver(fooDotEth, resolver);
        resolver.setAddr(fooDotEth, msg.sender);
        resolver.setContent(fooDotEth, '123456789');
        resolver.setABI(fooDotEth, 1, '[{"constant":true,"inputs":[],"name":"test2","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]');
        
        
        ens.setSubnodeOwner(fooDotEth, sha3('1'), this);
        var OneDotFootDotEth = sha3(fooDotEth, sha3('1'));
        ens.setResolver(OneDotFootDotEth, resolver);
        resolver.setAddr(OneDotFootDotEth, msg.sender);
        resolver.setContent(OneDotFootDotEth, 'hello');
        ens.setSubnodeOwner(fooDotEth, sha3('2'), msg.sender);
        ens.setSubnodeOwner(fooDotEth, sha3('3'), msg.sender);

        // Set bar.eth up with a resolver but no addr record, owned by the sender
        ens.setSubnodeOwner(tldnode, sha3('bar'), this);
        var barDotEth = sha3(tldnode, sha3('bar'));
        ens.setResolver(barDotEth, resolver);
        ens.setOwner(barDotEth, msg.sender);

        // Set up baz.eth with a resolver and addr record
        ens.setSubnodeOwner(tldnode, sha3('baz'), this);
        var bazDotEth = sha3(tldnode, sha3('baz'));
        ens.setResolver(bazDotEth, resolver);
        resolver.setAddr(bazDotEth, this);

        // Set up foobar.eth without a resolver, owned by the sender

        ens.setSubnodeOwner(tldnode, sha3('foobar'), this);
        var fooBarDotEth = sha3(tldnode, sha3('foobar'));
        ens.setOwner(fooBarDotEth, msg.sender);

        // Set up givethisaway.eth without a resolver, owned by the sender

        ens.setSubnodeOwner(tldnode, sha3('givethisaway'), this);
        var giveThisAwayDotEth = sha3(tldnode, sha3('givethisaway'));
        ens.setOwner(giveThisAwayDotEth, msg.sender);

        // Set up givesub.eth, owner by send to give away subdomains

        ens.setSubnodeOwner(tldnode, sha3('givesub'), this);
        var giveSubDotEth = sha3(tldnode, sha3('givesub'));
        ens.setOwner(giveSubDotEth, msg.sender);

    }
}