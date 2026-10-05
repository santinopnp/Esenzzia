const router = require('express').Router();
const { listProducts, getProduct, listCategories, getFeaturedProducts, searchProducts } = require('../services/productService');

router.get('/', async (req, res, next) => {
  try {
    const { category, search, page, limit, sort, featured } = req.query;
    const result = await listProducts({
      categorySlug: category,
      search,
      page:  parseInt(page  || '1'),
      limit: parseInt(limit || '24'),
      sort,
      featured: featured === 'true',
    });
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/categories', async (_req, res, next) => {
  try { res.json(await listCategories()); } catch (err) { next(err); }
});

router.get('/featured', async (req, res, next) => {
  try { res.json(await getFeaturedProducts(parseInt(req.query.limit || '8'))); } catch (err) { next(err); }
});

router.get('/search', async (req, res, next) => {
  try {
    if (!req.query.q) return res.json([]);
    res.json(await searchProducts(req.query.q, parseInt(req.query.limit || '10')));
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const product = await getProduct(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) { next(err); }
});

module.exports = router;
