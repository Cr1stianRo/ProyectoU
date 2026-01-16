import { Router } from "express";
import { getHomeConfig, updateHomeConfig } from "../controllers/homeConfigController.js";

import { getBloquePrincipal,updateBloquePrincipal } from "../controllers/BloquePrincipalController.js";

const router = Router();

router.get("/", getHomeConfig);
router.put("/", updateHomeConfig);

router.get("/bloquep", getBloquePrincipal);
router.put("/bloquep", updateBloquePrincipal);



export default router;
