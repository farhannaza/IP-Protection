const HashStorage = artifacts.require("HashStorage");
const fs = require('fs');
const path = require('path');

module.exports = function (deployer) {
  deployer.deploy(HashStorage)
    .then(() => {
      // Write contract address to a file
      const addressData = {
        address: HashStorage.address,
        network: deployer.network
      };
      
      fs.writeFileSync(
        path.join(__dirname, '../client/lib/contract-address.json'),
        JSON.stringify(addressData, null, 2)
      );
    });
};