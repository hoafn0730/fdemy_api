const router = require('express').Router();

const invoiceController = require('~/controllers/InvoiceController');
const { authMiddleware } = require('~/middlewares/authMiddleware');

router.all('*', authMiddleware);

router.get('/', invoiceController.get);
router.get('/:id', invoiceController.getById);
router.post('/', invoiceController.create);
router.put('/:id', invoiceController.update);
router.delete('/:id', invoiceController.delete);

module.exports = router;
