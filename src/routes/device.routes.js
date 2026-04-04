const express = require("express");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

const controller = require("../controllers/device.controller");

router.post("/update", auth, controller.updateDevice);
router.get("/status/:device_id", auth, controller.getStatus);
router.post("/relay", auth, controller.controlRelay);
router.post("/register-token", controller.registerToken);
router.get("/accidents/:device_id", controller.getAccidents);
router.get("/accidents", controller.getAllAccidents);
router.delete("/accident/:id", controller.deleteAccident);
router.put("/accident/:id", controller.resolveAccident);
router.get("/stats", auth, controller.getStats);

module.exports = router;