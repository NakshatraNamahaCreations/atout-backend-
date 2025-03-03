const express = require("express");
const router = express.Router();
const VoucherController = require("../Controllers/voucher");


router.post("/addvoucher",VoucherController.addvoucher);
router.get("/getvoucher", VoucherController.getvoucher);
router.post("/deletevoucher/:id", VoucherController.postdeletevoucher);
router.post("/editvoucher/:id", VoucherController.editvoucher);
router.post("/couponcode/:id", VoucherController.couponcode);


module.exports = router;