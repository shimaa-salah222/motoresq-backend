const express = require("express");
const router = express.Router();

const controller = require("../controllers/device.controller");

router.post("/update", controller.updateDevice);
router.get("/status/:device_id", controller.getStatus);
router.post("/relay", controller.controlRelay);
router.post("/register-token", controller.registerToken);
router.get("/accidents/:device_id", controller.getAccidents);

module.exports = router;