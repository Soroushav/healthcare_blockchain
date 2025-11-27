# Hybrid Blockchain Medical Certificate Platform

## Project Description
This project implements a secure, privacy-preserving system for managing the lifecycle of medical certificates using a hybrid blockchain architecture. It leverages **Hyperledger Fabric** as a permissioned layer for doctors to issue and revoke certificates with strict data governance, and **Ethereum** as a public layer to allow third parties to verify certificate authenticity without accessing sensitive patient data. The solution addresses issues of forgery, lack of interoperability, and privacy by combining the control of a private ledger with the transparency of a public network.

## Project Structure
* **/security**: Single-page application built with React and Vite providing role-based dashboards for doctors, patients, and verifiers.
* **/bridge**: Node.js/TypeScript middleware service that exposes REST APIs and orchestrates communication between the frontend and both blockchain layers.
* **/chaincode**: Contains the Hyperledger Fabric smart contracts (JavaScript) responsible for the authoritative issuance, revocation, and storage of certificate history.
* **/health-certificate**: Solidity smart contracts deployed on Ethereum (via Thirdweb) managing public directory roles and storing non-sensitive verification metadata.

## Tools & Technologies

### Frontend
* **React (Vite)**: Core framework for the user interface.
* **Tailwind CSS**: Utility-first CSS framework for styling.
* **React Context API**: State management for blockchain interactions.
* **Thirdweb SDK**: Handles wallet connections and Ethereum contract interactions.

### Backend & Middleware
* **Node.js & TypeScript**: Runtime and language for the middleware bridge.
* **Express**: Web framework for REST API endpoints.
* **Hyperledger Fabric SDK**: Facilitates secure communication with the permissioned network.

### Permissioned Blockchain (Private Layer)
* **Hyperledger Fabric**: The underlying permissioned blockchain framework.
* **JavaScript**: Used for implementing the Chaincode (Smart Contracts).
* **Docker**: Manages the containerized network infrastructure.

### Public Blockchain (Verification Layer)
* **Ethereum (Sepolia Testnet)**: The public network used for global verification.
* **Solidity**: Language used for the verification Smart Contracts.
* **OpenZeppelin**: Libraries used for secure Access Control (AccessControlEnumerable).
* **Thirdweb**: Used for contract deployment and management.