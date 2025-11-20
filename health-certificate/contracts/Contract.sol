// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol"; // Gives you role-based permissions (e.g., admin, publisher). Instead of one owner, you can have multiple roles.

import "@openzeppelin/contracts/security/Pausable.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title HealthCertAnchor
 * @notice Public Ethereum anchor for healthcare certifications issued in a private network.
 *         Stores certificate hash + minimal metadata for public verification.
 *         All state changes mirror Hyperledger via a trusted publisher (bridge/oracle).
 *
 *      - NO PHI on-chain. Only keccak256 hashes of off-chain payloads.
 *      - Cert identity on-chain = bytes32 certHash (e.g., keccak256(serialized JSON)).
 *      - Optional Merkle batch anchoring for gas-efficient proofs.
 */

contract HealthCertAnchor is AccessControl, Pausable {
    bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER_ROLE");

    enum Status { Active, Suspended, Revoked }

    struct CertRecord {
        bytes32 schemaHash;    // hash of the JSON Schema/spec used to issue
        uint256  issuedAt;      // block timestamp when first anchored
        uint256  expiresAt;     // 0 => no expiry
        Status  status;        // Active/Suspended/Revoked
        bool    exists;        // simple presence check
    }

    // Single-cert storage
    mapping(bytes32 => CertRecord) public certifications; // certHash => record

    // Merkle batch storage (optional)
    struct BatchRoot {
        bytes32 root;
        uint64  anchoredAt;
        bool    exists;
    }
    mapping(bytes32 => BatchRoot) public batch; // batchId => root info

    // ----------------- Events -----------------
    event PublisherAdded(address indexed account); // When you write indexed before a parameter, Solidity stores it in a topic that’s a searchable field in the blockchain log.
    event PublisherRemoved(address indexed account);

    event CertAnchored(
        bytes32 indexed certHash,
        bytes32 indexed schemaHash,
        uint256 issuedAt,
        uint256 expiresAt,
        Status status
    );
    event CertStatusUpdated(bytes32 indexed certHash, Status newStatus);
    event CertExpiryUpdated(bytes32 indexed certHash, uint64 newExpiresAt);

    event BatchAnchored(bytes32 indexed batchId, bytes32 indexed root, uint64 anchoredAt);

    // ----------------- Init -----------------
    constructor(address admin, address initialPublisher) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        if (initialPublisher != address(0)) {
            _grantRole(PUBLISHER_ROLE, initialPublisher);
            emit PublisherAdded(initialPublisher);
        }
    }

    // ----------------- Admin/Pause -----------------
    function addPublisher(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(PUBLISHER_ROLE, account);
        emit PublisherAdded(account);
    }

    function removePublisher(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(PUBLISHER_ROLE, account);
        emit PublisherRemoved(account);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }

    // ----------------- Single anchoring -----------------
    /**
     * @dev Mirror a new certificate from Hyperledger (or re-anchor if not seen before).
     * @param certHash keccak256 of your off-chain payload (encrypted if needed)
     * @param schemaHash keccak256 of your issuance schema definition
     * @param expiresAt unix seconds; 0 = no expiry
     */
    function anchorCertificate(
        bytes32 certHash,
        bytes32 schemaHash,
        uint256  expiresAt
    ) external whenNotPaused onlyRole(PUBLISHER_ROLE)
    {
        CertRecord storage r = certifications[certHash];

        // First time anchoring
        if (!r.exists) {
            r.exists     = true;
            r.schemaHash = schemaHash;
            r.issuedAt   = uint256(block.timestamp);
            r.expiresAt  = expiresAt;
            r.status     = Status.Active;
        } else {
            // If already exists, allow schema rotation/expiry refresh to match private chain
            // (We do NOT auto-change status here)
            r.schemaHash = schemaHash;
            r.expiresAt  = expiresAt;
        }

        emit CertAnchored(certHash, schemaHash, r.issuedAt, r.expiresAt, r.status);
    }

    function setStatus(bytes32 certHash, Status newStatus)
        external
        whenNotPaused
        onlyRole(PUBLISHER_ROLE)
    {
        CertRecord storage r = _requireCert(certHash);
        r.status = newStatus;
        emit CertStatusUpdated(certHash, newStatus);
    }

    function extendExpiry(bytes32 certHash, uint64 newExpiresAt)
        external
        whenNotPaused
        onlyRole(PUBLISHER_ROLE)
    {
        CertRecord storage r = _requireCert(certHash);
        // Allow setting to 0 (no expiry) or a later timestamp
        require(newExpiresAt == 0 || newExpiresAt > r.expiresAt, "bad expiry");
        r.expiresAt = newExpiresAt;
        emit CertExpiryUpdated(certHash, newExpiresAt);
    }

    // ----------------- Batch anchoring (Merkle) -----------------
    /**
     * @notice Anchor a batch Merkle root. Leaves must encode:
     *         keccak256(abi.encodePacked(certHash, schemaHash, expiresAt, statusByte))
     *         where statusByte = uint8(Status).
     */
    function anchorBatch(bytes32 batchId, bytes32 root)
        external
        whenNotPaused
        onlyRole(PUBLISHER_ROLE)
    {
        require(!batch[batchId].exists, "batch exists");
        batch[batchId] = BatchRoot({ root: root, anchoredAt: uint64(block.timestamp), exists: true });
        emit BatchAnchored(batchId, root, uint64(block.timestamp));
    }

    /**
     * @dev Stateless verification against a stored batch root.
     */
    function verifyInBatch(
        bytes32 certHash,
        bytes32 schemaHash,
        uint64  expiresAt,
        Status  status_,
        bytes32 batchId,
        bytes32[] calldata merkleProof
    ) external view returns (bool isValid, string memory reason) {
        BatchRoot memory b = batch[batchId];
        if (!b.exists) return (false, "BATCH_NOT_FOUND");

        bytes32 leaf = keccak256(abi.encodePacked(certHash, schemaHash, expiresAt, uint8(status_)));
        bool included = MerkleProof.verify(merkleProof, b.root, leaf);
        if (!included) return (false, "NOT_IN_BATCH");
        if (status_ == Status.Revoked) return (false, "REVOKED");
        if (status_ == Status.Suspended) return (false, "SUSPENDED");
        if (expiresAt != 0 && block.timestamp > expiresAt) return (false, "EXPIRED");
        return (true, "ACTIVE");
    }

    // ----------------- Read API -----------------
    function verify(bytes32 certHash) external view returns (bool isValid, string memory reason) {
        CertRecord storage r = certifications[certHash];
        if (!r.exists) return (false, "NOT_FOUND");
        if (r.status == Status.Revoked) return (false, "REVOKED");
        if (r.status == Status.Suspended) return (false, "SUSPENDED");
        if (r.expiresAt != 0 && block.timestamp > r.expiresAt) return (false, "EXPIRED");
        return (true, "ACTIVE");
    }

    function get(bytes32 certHash)
        external
        view
        returns (bool exists, bytes32 schemaHash, uint256 issuedAt, uint256 expiresAt, Status status_)
    {
        CertRecord storage r = certifications[certHash];
        return (r.exists, r.schemaHash, r.issuedAt, r.expiresAt, r.status);
    }

    // ----------------- Internals -----------------
    function _requireCert(bytes32 certHash) internal view returns (CertRecord storage) {
        CertRecord storage r = certifications[certHash];
        require(r.exists, "cert not anchored");
        return r;
    }
}