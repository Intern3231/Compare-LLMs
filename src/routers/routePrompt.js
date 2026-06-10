import { Router } from "express";
import compareModels from "../controllers/compareModels.js";
import getModels from "../controllers/getModels.js";
import validateCompareRequest from "../validators/validateCompareRequest.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = Router();

router.post(
    "/compare",
    validateCompareRequest,
    asyncHandler(compareModels)
);

router.get("/models", asyncHandler(getModels));

export default router;
