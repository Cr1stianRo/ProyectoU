import { Router } from "express";
import { verifyToken, optionalAuth } from "../middleware/authMiddleware.js";
import { getHomeConfig, updateHomeConfig } from "../controllers/Home/homeConfigController.js";
import { getBloquePrincipal, updateBloquePrincipal } from "../controllers/Home/bloquePrincipalController.js";
import { getCuidadoDia, updateCuidadoDia } from "../controllers/Home/cuidadoBloqueController.js";
import { getCarrusel, updateCarrusel } from "../controllers/Home/carruselController.js";
import { getPage, updatePage } from "../controllers/Home/pageConfigController.js";
import { getMapa, updateMapa } from "../controllers/Home/mapaController.js";
import { getValores, updateValores } from "../controllers/Home/valoresController.js";
import { getGaleriaHogar, updateGaleriaHogar } from "../controllers/Home/galeriaHogarController.js";
import { getServicios, updateServicios } from "../controllers/Home/serviciosController.js";
import { getDiseno, updateDiseno } from "../controllers/Home/disenoController.js";
import { getSobreNosotros, updateSobreNosotros } from "../controllers/Home/sobreNosotrosController.js";
import { getEquipo, updateEquipo } from "../controllers/Home/equipoController.js";
import { getVideo, updateVideo } from "../controllers/Home/videoController.js";

const router = Router();

// GET routes use optionalAuth (public access with ?userId= or JWT)
// PUT routes require verifyToken (authenticated only)

router.get("/", optionalAuth, getHomeConfig);
router.put("/", verifyToken, updateHomeConfig);

router.get("/page", optionalAuth, getPage);
router.put("/page", verifyToken, updatePage);

router.get("/bloquep", optionalAuth, getBloquePrincipal);
router.put("/bloquep", verifyToken, updateBloquePrincipal);

router.get("/cuidadod", optionalAuth, getCuidadoDia);
router.put("/cuidadod", verifyToken, updateCuidadoDia);

router.get("/carrusel", optionalAuth, getCarrusel);
router.put("/carrusel", verifyToken, updateCarrusel);

router.get("/mapa", optionalAuth, getMapa);
router.put("/mapa", verifyToken, updateMapa);

router.get("/valores", optionalAuth, getValores);
router.put("/valores", verifyToken, updateValores);

router.get("/galeriahogar", optionalAuth, getGaleriaHogar);
router.put("/galeriahogar", verifyToken, updateGaleriaHogar);

router.get("/servicios", optionalAuth, getServicios);
router.put("/servicios", verifyToken, updateServicios);

router.get("/diseno", optionalAuth, getDiseno);
router.put("/diseno", verifyToken, updateDiseno);

router.get("/sobrenosotros", optionalAuth, getSobreNosotros);
router.put("/sobrenosotros", verifyToken, updateSobreNosotros);

router.get("/equipo", optionalAuth, getEquipo);
router.put("/equipo", verifyToken, updateEquipo);

router.get("/video", optionalAuth, getVideo);
router.put("/video", verifyToken, updateVideo);

export default router;
