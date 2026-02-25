// Middlewares de autenticación JWT — verifyToken bloquea, optionalAuth permite acceso público
import jwt from "jsonwebtoken";

// Middleware obligatorio: rechaza la petición si no hay token válido
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido o expirado." });
  }
};

// Middleware opcional: intenta extraer userId del token o del query param ?userId=
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch (_) {}
  }
  if (!req.userId && req.query.userId) {
    req.userId = req.query.userId;
  }
  next();
};
