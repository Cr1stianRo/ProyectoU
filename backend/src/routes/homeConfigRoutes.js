import { Router } from "express";
import { getHomeConfig, updateHomeConfig } from "../controllers/Home/homeConfigController.js";

import { getBloquePrincipal,updateBloquePrincipal } from "../controllers/Home/BloquePrincipalController.js";

const router = Router();

router.get("/", getHomeConfig);
router.put("/", updateHomeConfig);

router.get("/bloquep", getBloquePrincipal);
router.put("/bloquep", updateBloquePrincipal);



export default router;
