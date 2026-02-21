import { Router } from "express";
import { getHomeConfig, updateHomeConfig } from "../controllers/Home/homeConfigController.js";
import { getBloquePrincipal, updateBloquePrincipal } from "../controllers/Home/bloquePrincipalController.js";
import { getCuidadoDia, updateCuidadoDia } from "../controllers/Home/cuidadoBloqueController.js";
import { getCarrusel, updateCarrusel } from "../controllers/Home/carruselController.js";
import { getPage, updatePage } from "../controllers/Home/pageConfigController.js";
import { getMapa, updateMapa } from "../controllers/Home/mapaController.js";
import { getValores, updateValores } from "../controllers/Home/valoresController.js";

const router = Router();

router.get("/", getHomeConfig);
router.put("/", updateHomeConfig);

router.get("/page", getPage);
router.put("/page", updatePage);

router.get("/bloquep", getBloquePrincipal);
router.put("/bloquep", updateBloquePrincipal);

router.get("/cuidadod", getCuidadoDia);
router.put("/cuidadod", updateCuidadoDia);

router.get("/carrusel", getCarrusel);
router.put("/carrusel", updateCarrusel);

router.get("/mapa", getMapa);
router.put("/mapa", updateMapa);

router.get("/valores", getValores);
router.put("/valores", updateValores);

export default router;
