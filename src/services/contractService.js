const Contract = require('../models/contract');

function getContractsWithUnapprovedMetadata() {
  return Contract.find({
    pendingMetadata: true
  }).exec();
}

function getContract(address) {
  return Contract.findOne({
    address: address
  }).exec();
}

async function applyReviewDecision(contract, accept, metadataType, value) {
  const matchAllTypes = !metadataType;
  const matchAllValues = !value;

  // Tags
  if (matchAllTypes || metadataType === 'tags') {
    contract.tags = contract.tags.map( t => {
      if (!matchAllValues && t.tag !== value) {
        return t;
      } else {
        if (accept) {
          return {
            tag: t.tag,
            approved: true
          }
        } else {
          return null;
        }
      }
    }).filter( t => t );
  }

  // Links
  if (matchAllTypes && contract.pendingLinks[0]) {
    if (accept) {
      contract.link = contract.pendingLinks[0];
    }
    contract.pendingLinks = [];
  } else if (metadataType === 'links') {
    if (accept) {
      contract.link = value;
    }
    const idx = contract.pendingLinks.indexOf(
      contract.pendingLinks.find( l => l === value ));
    contract.pendingLinks.splice(idx, 1);
  }

  // Descriptions
  if (matchAllTypes && contract.pendingDescriptions[0]) {
    if (accept) {
      contract.description = contract.pendingDescriptions[0];
    }
    contract.pendingDescriptions = [];
  } else if (metadataType === 'descriptions') {
    if (accept) {
      contract.description = value;
    }
    const idx = contract.pendingDescriptions.indexOf(
      contract.pendingDescriptions.find( d => d === value ));
    contract.pendingDescriptions.splice(idx, 1);
  }

  await contract.save();

  return contract;
}

module.exports.getContractsWithUnapprovedMetadata = getContractsWithUnapprovedMetadata;
module.exports.getContract = getContract;
module.exports.applyReviewDecision = applyReviewDecision;
