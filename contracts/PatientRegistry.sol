// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PatientRegistry {
    struct PatientRecord {
        string dataHash;
        uint256 timestamp;
    }
    
    mapping(address => PatientRecord) private patientRecords;
    
    event PatientRegistered(address indexed patientAddress, string dataHash, uint256 timestamp);

    function registerPatient(address patientAddress, string memory dataHash) public {
        PatientRecord memory newRecord = PatientRecord({
            dataHash: dataHash,
            timestamp: block.timestamp
        });
        
        // Overwrite the existing record for the patient address
        patientRecords[patientAddress] = newRecord;
        
        emit PatientRegistered(patientAddress, dataHash, block.timestamp);
    }

    function getPatientRecord(address patientAddress) public view returns (PatientRecord memory) {
        return patientRecords[patientAddress];
    }
}
