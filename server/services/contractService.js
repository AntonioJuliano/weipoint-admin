const Contract = require('../models/contract');

function getContractsWithUnapprovedMetadata() {
  return Contract.find({
    pendingMetadata: true
  }).exec();
}

module.exports.getContractsWithUnapprovedMetadata = getContractsWithUnapprovedMetadata;
