const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');
const errors = require('../helpers/errors');
const errorHandler = require('../helpers/errorHandler');

router.get('/unapproved', async(request, response) => {
  try {
    const validationResult = await request.getValidationResult();
    if (!validationResult.isEmpty()) {
      throw new errors.RequestError(validationResult.array());
    }
    const contracts = await contractService.getContractsWithUnapprovedMetadata();

    const unapprovedData = contracts.map( c => {
      return {
        type: 'contract',
        address: c.address,
        unapprovedData: {
          tags: c.tags.filter( t => !t.approved ).map( t => t.tag ),
          links: c.pendingLinks,
          descriptions: c.pendingDescriptions
        }
      };
    });

    return response.status(200).json({
      data: unapprovedData
    });
  } catch (e) {
    errorHandler.handle(e, response);
  }
});

module.exports = router;
