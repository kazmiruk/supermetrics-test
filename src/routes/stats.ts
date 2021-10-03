import express from "express";

import controller from "../controllers/stats";

const router = express.Router();

router.get("/", controller.getStats);

export = router;
