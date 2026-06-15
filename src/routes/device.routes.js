const express = require("express");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

const controller = require("../controllers/device.controller");

router.post("/update", auth, controller.updateDevice);
router.post("/relay", auth, controller.controlRelay);
router.post("/register-token", controller.registerToken);
router.get("/accidents", controller.getAllAccidents);
router.get("/stats", auth, controller.getStats);
router.post("/heartrate", controller.updateHeartRate);

router.get("/status/:device_id", auth, controller.getStatus);
router.get("/accidents/:device_id", controller.getAccidents);
router.delete("/accident/:id", controller.deleteAccident);
router.put("/accident/:id", controller.resolveAccident);

module.exports = router;