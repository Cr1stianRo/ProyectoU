import { Router } from "express";
import { getHomeConfig, updateHomeConfig } from "../controllers/Home/homeConfigController.js";

import { getBloquePrincipal,updateBloquePrincipal } from "../controllers/Home/BloquePrincipalController.js";

import { getCuidadoDia, updateCuidadoDia } from "../controllers/Home/cuidadoBloqueController.js";
import { getCarrusel, updateCarrusel } from "../controllers/Home/carruselController.js";

const router = Router();

router.get("/", getHomeConfig);
router.put("/", updateHomeConfig);

router.get("/bloquep", getBloquePrincipal);
router.put("/bloquep", updateBloquePrincipal);

router.get("/cuidadod", getCuidadoDia);
router.put("/cuidadod", updateCuidadoDia);

router.get("/carrusel", getCarrusel);
router.put("/carrusel", updateCarrusel);



export default router;
