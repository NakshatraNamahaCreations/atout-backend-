const express = require('express');
const router = express.Router();
const { createBanner, getBanners, updateBanner, deleteBanner } = require('.././Controllers/bannerController');


router.get('/banners', getBanners);


router.post('/banners', createBanner);


router.put('/banners/:bannerId', updateBanner);

router.delete('/banners/:bannerId', deleteBanner);

module.exports = router;
