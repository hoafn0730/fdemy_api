const express = require('express');
const router = express.Router();
const invoiceController = require('~/controllers/InvoiceController');

router.get('/', invoiceController.index);
router.post('/', invoiceController.store);
router.get('/:id/edit', invoiceController.edit);
router.put('/:id', invoiceController.updateWeb);
router.delete('/:id', invoiceController.destroy);

module.exports = router;
