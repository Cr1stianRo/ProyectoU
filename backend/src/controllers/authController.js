// Controlador de autenticación — registro con creación de PageConfig por defecto e inicio de sesión con JWT
import User from "../models/User.js";
import PageConfig from "../models/Home/PageConfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Secciones que se crean automáticamente al registrar un usuario nuevo (multi-tenant)
const defaultSections = [
  {
    id: "bloquep-1", type: "bloquep", order: 0,
    config: { badgeText: "", heroTitle: "", heroDescription: "", button2Text: "", whatsappNumber: "", pills: [] },
  },
  { id: "carrusel-1", type: "carrusel", order: 1, config: { slides: [] } },
  {
    id: "servicios-1", type: "servicios", order: 2,
    config: {
      sectionTitle: "",
      sectionSubtitle: "",
      services: [], highlights: [],
    },
  },
];

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Create default PageConfig for the new user
    await PageConfig.create({ userId: newUser._id, sections: defaultSections });

    res.status(201).json({
      msg: "Usuario creado",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    // Token con expiración de 7 días — contiene solo el id del usuario
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      msg: "Login exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });

  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
