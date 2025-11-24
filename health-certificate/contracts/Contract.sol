// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

/**
 * @title NetworkDirectory
 * @notice Manages:
 *         - Admins (DEFAULT_ADMIN_ROLE)
 *         - Publishers (PUBLISHER_ROLE) with metadata (name, joinedAt)
 *         - Normal users (tracked explicitly)
 *
 * Certificate data still lives off-chain / in Fabric.
 */
contract NetworkDirectory is AccessControlEnumerable {
    /// @dev Role identifier for publishers.
    bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER_ROLE");

    // -------------------- Events --------------------

    event PublisherAdded(address indexed account, string name, uint64 joinedAt);
    event PublisherRemoved(address indexed account);
    event PublisherNameUpdated(address indexed account, string oldName, string newName);
    event UserRegistered(address indexed account);

    // -------------------- Publisher metadata --------------------

    struct PublisherMetadata {
        string name;
        uint64 joinedAt;
        bool exists;
    }

    /// @notice On-chain metadata for each publisher.
    mapping(address => PublisherMetadata) public publisherMetadata;

    // -------------------- User registry --------------------

    mapping(address => bool) public isUser;
    address[] private _users;

    /**
     * @param admin                 Address that will receive DEFAULT_ADMIN_ROLE.
     * @param initialPublisher      Optional initial publisher (can be address(0)).
     * @param initialPublisherName  Optional name for the initial publisher.
     */
    constructor(
        address admin,
        address initialPublisher,
        string memory initialPublisherName
    ) {
        require(admin != address(0), "admin is zero");

        // Admin that can grant/revoke roles
        _grantRole(DEFAULT_ADMIN_ROLE, admin);

        // Optionally set up an initial publisher with metadata
        if (initialPublisher != address(0)) {
            _addPublisherWithMetadata(initialPublisher, initialPublisherName);
        }
    }

    // ---------------------------------------------------------------------
    // Internal helpers
    // ---------------------------------------------------------------------

    function _addPublisherWithMetadata(address account, string memory name) internal {
        _grantRole(PUBLISHER_ROLE, account);

        if (!publisherMetadata[account].exists) {
            publisherMetadata[account] = PublisherMetadata({
                name: name,
                joinedAt: uint64(block.timestamp),
                exists: true
            });
        } else {
            // If already exists, just update the name (optional behavior)
            publisherMetadata[account].name = name;
        }

        emit PublisherAdded(account, name, uint64(block.timestamp));
    }

    // ---------------------------------------------------------------------
    // Publisher management
    // ---------------------------------------------------------------------

    /**
     * @notice Add a new publisher with a name.
     * @dev Only callable by DEFAULT_ADMIN_ROLE.
     */
    function addPublisher(address account, string memory name)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(account != address(0), "zero address");
        _addPublisherWithMetadata(account, name);
    }

    /**
     * @notice Remove an existing publisher.
     * @dev Only callable by DEFAULT_ADMIN_ROLE.
     */
    function removePublisher(address account)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _revokeRole(PUBLISHER_ROLE, account);
        // keep metadata for history; if you want to wipe it:
        // delete publisherMetadata[account];
        emit PublisherRemoved(account);
    }

    /**
     * @notice Update the stored name for a publisher.
     * @dev Only callable by DEFAULT_ADMIN_ROLE.
     */
    function setPublisherName(address account, string memory newName)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        PublisherMetadata storage meta = publisherMetadata[account];
        require(meta.exists, "publisher not found");

        string memory old = meta.name;
        meta.name = newName;

        emit PublisherNameUpdated(account, old, newName);
    }

    /**
     * @notice Check if an address is a publisher.
     */
    function isPublisher(address account) external view returns (bool) {
        return hasRole(PUBLISHER_ROLE, account);
    }

    /**
     * @notice Total number of publishers.
     */
    function publisherCount() external view returns (uint256) {
        return getRoleMemberCount(PUBLISHER_ROLE);
    }

    /**
     * @notice Get publisher address at a given index.
     * @dev Index must be < publisherCount().
     */
    function publisherAt(uint256 index) external view returns (address) {
        return getRoleMember(PUBLISHER_ROLE, index);
    }

    /**
     * @notice Get all publisher addresses.
     * @dev For large sets this is a view function meant for off-chain calls.
     */
    function getAllPublishers() external view returns (address[] memory) {
        uint256 count = getRoleMemberCount(PUBLISHER_ROLE);
        address[] memory publishers = new address[](count);

        for (uint256 i = 0; i < count; i++) {
            publishers[i] = getRoleMember(PUBLISHER_ROLE, i);
        }

        return publishers;
    }

    /**
     * @notice Convenience helper to fetch publisher status and metadata.
     */
    function getPublisherInfo(address account)
        external
        view
        returns (bool isPub, string memory name, uint64 joinedAt)
    {
        isPub = hasRole(PUBLISHER_ROLE, account);
        PublisherMetadata memory meta = publisherMetadata[account];
        name = meta.name;
        joinedAt = meta.joinedAt;
    }

    // ---------------------------------------------------------------------
    // Normal user management
    // ---------------------------------------------------------------------

    /**
     * @notice Register a normal user in the directory.
     * @dev Only callable by DEFAULT_ADMIN_ROLE (e.g. your backend/oracle).
     *      You can call this when a user submits their first certificate request.
     */
    function registerUser(address account)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(account != address(0), "zero address");

        if (!isUser[account]) {
            isUser[account] = true;
            _users.push(account);
            emit UserRegistered(account);
        }
    }

    /**
     * @notice Total number of registered users (non-role-specific).
     */
    function userCount() external view returns (uint256) {
        return _users.length;
    }

    /**
     * @notice Get user address at a given index.
     * @dev Index must be < userCount().
     */
    function userAt(uint256 index) external view returns (address) {
        require(index < _users.length, "index out of bounds");
        return _users[index];
    }

    /**
     * @notice Get all registered user addresses.
     * @dev For large sets this is a view function meant for off-chain calls.
     */
    function getAllUsers() external view returns (address[] memory) {
        return _users;
    }
}