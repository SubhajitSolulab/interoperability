// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Message {
    mapping(string => string) public messages;
    mapping(string => string) public documents;
    event MessageSet(string name, string message);
    event DocumentSet(string name, string message);

    constructor() {}

    function setMessage(string memory _name, string memory _message) public {
        require(
            bytes(_name).length != 0 && bytes(_message).length != 0,
            "Empty String is not allowed"
        );
        messages[_name] = _message;
        emit MessageSet(_name, _message);
    }

    function setDocument(string memory _name, string memory _document) public {
        require(
            bytes(_name).length != 0 && bytes(_document).length != 0,
            "Empty String is not allowed"
        );

        documents[_name] = _document;
        emit DocumentSet(_name, _document);
    }

    function getMessage(
        string memory _name
    ) public view returns (string memory) {
        return messages[_name];
    }

    function getDocument(
        string memory _name
    ) public view returns (string memory) {
        return documents[_name];
    }
}
