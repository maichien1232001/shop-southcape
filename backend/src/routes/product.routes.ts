import { Router } from 'express';
import { getProducts, getProductDetails } from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductDetails);

export default router;
