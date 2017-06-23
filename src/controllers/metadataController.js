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
        type: 'address',
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

router.post('/review', async(request, response) => {
  try {
    request.check({
      'address': {
        in: 'body',
        isString: true,
        errorMessage: 'Invalid Address'
      },
      'reviewableType': {
        in: 'body',
        isString: true,
        errorMessage: 'Invalid reviewableType'
      },
      'metadataType': {
        in: 'body',
        isOptionalString: true,
        errorMessage: 'Invalid metadataType'
      },
      'value': {
        in: 'body',
        isOptionalString: true,
        errorMessage: 'Invalid value'
      },
      'accept': {
        in: 'body',
        isBoolean: true,
        errorMessage: 'Invalid accept'
      }
    });
    const validationResult = await request.getValidationResult();
    if (!validationResult.isEmpty()) {
      throw new errors.RequestError(validationResult.array());
    }

    if (request.body.reviewableType === 'contract') {
      const contract = await contractService.getContract(request.body.address);
      if (!contract) {
        throw new errors.ClientError('Contract not found');
      }

      await contractService.applyReviewDecision(
        contract,
        request.body.accept,
        request.body.metadataType,
        request.body.value
      )

      return response.status(200);
    } else {
      throw new errors.ClientError('Invalid reviewable type');
    }
  } catch (e) {
    errorHandler.handle(e, response);
  }
});

module.exports = router;
