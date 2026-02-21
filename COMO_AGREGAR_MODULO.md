# 📦 CÓMO AGREGAR UN NUEVO MÓDULO EDITABLE

## 🎯 Prompt para Claude

```
Necesito agregar un nuevo módulo editable a la página Home siguiendo la arquitectura actual del proyecto.

INFORMACIÓN DEL MÓDULO:
- **Nombre del módulo**: [nombre descriptivo, ej: "Testimonios", "Equipo", "FAQ"]
- **Tipo (type)**: [nombre corto sin espacios, ej: "testimonios", "equipo", "faq"]
- **Propósito**: [para qué sirve este módulo]
- **Ubicación en la página**: [dónde debe aparecer en Home]
- **Order**: [número de orden, ej: 4, 5, 6...]

CAMPOS QUE DEBE TENER:
1. Campo 1: [nombre] - [tipo: texto/número/array/etc] - [descripción]
2. Campo 2: [nombre] - [tipo] - [descripción]
3. Campo 3: [nombre] - [tipo] - [descripción]
...

DATOS DE EJEMPLO (opcional):
[Si tienes datos de ejemplo o URLs de referencia para hacer webscraping]

INSTRUCCIONES:
Por favor, crea el módulo completo siguiendo la arquitectura de módulos existente
(bloquep, carrusel, cuidadod, mapa) que está documentada en /cambios/cambios.txt
```

---

## 📚 Contexto de la Arquitectura Actual

### Estructura de Archivos

**Backend:**
- `backend/src/controllers/Home/[nombre]Controller.js` - Controlador con GET y PUT
- `backend/src/routes/homeConfigRoutes.js` - Agregar rutas del módulo
- `backend/src/models/Home/PageConfig.js` - Modelo compartido (ya existe)

**Frontend:**
- `frontend/src/pages/ModulosEdición/Home/[Nombre]Config.jsx` - Panel de edición
- `frontend/src/App.jsx` - Agregar ruta
- `frontend/src/pages/Home.jsx` - Agregar case en renderSection()
- `frontend/src/pages/AdminPanel.jsx` - Agregar tarjeta del módulo

### Patrón del Backend

**Controlador (`[nombre]Controller.js`):**
```javascript
import PageConfig from "../../models/Home/PageConfig.js";

const TYPE = "[type]"; // ej: "testimonios"

const getOrCreate = async () => {
  let doc = await PageConfig.findOne();
  if (!doc) doc = await PageConfig.create({ sections: [] });
  return doc;
};

export const get[Nombre] = async (req, res) => {
  try {
    const doc = await getOrCreate();
    const section = doc.sections.find((s) => s.type === TYPE);
    return res.status(200).json(section?.config ?? { /* defaults */ });
  } catch (error) {
    console.error("get[Nombre] error:", error);
    return res.status(500).json({ message: "Error obteniendo [Nombre]" });
  }
};

export const update[Nombre] = async (req, res) => {
  try {
    const { campo1, campo2, ... } = req.body || {};

    const config = {
      campo1: String(campo1 || "").trim(),
      campo2: String(campo2 || "").trim(),
      // ... más campos
    };

    const doc = await getOrCreate();
    const idx = doc.sections.findIndex((s) => s.type === TYPE);

    if (idx >= 0) {
      doc.sections[idx].config = config;
    } else {
      doc.sections.push({
        id: `${TYPE}-1`,
        type: TYPE,
        order: [N], // número de orden
        config
      });
    }

    doc.markModified("sections");
    await doc.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error("update[Nombre] error:", error);
    return res.status(500).json({ message: "Error guardando [Nombre]" });
  }
};
```

**Rutas (`homeConfigRoutes.js`):**
```javascript
import { get[Nombre], update[Nombre] } from "../controllers/Home/[nombre]Controller.js";

router.get("/[type]", get[Nombre]);
router.put("/[type]", update[Nombre]);
```

### Patrón del Frontend

**Panel de Edición (`[Nombre]Config.jsx`):**
```jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/home-config/[type]";

const initialForm = {
  campo1: "",
  campo2: "",
  // ...
};

export default function [Nombre]Config() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const onSave = async () => {
    try {
      await axios.put(API_URL, form);
      alert("Guardado ✅");
    } catch (e) {
      alert("No se pudo guardar ❌");
    }
  };

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setForm((prev) => ({ ...prev, ...res.data })))
      .catch(() => setError("No se pudo cargar la configuración"));
  }, []);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start">
        {/* IZQUIERDA: editor */}
        <div className="col-lg-5">
          {/* Formulario de edición */}
        </div>

        {/* DERECHA: preview */}
        <div className="col-lg-7">
          {/* Vista previa */}
        </div>
      </div>
    </div>
  );
}
```

**Home.jsx (agregar case):**
```jsx
case "[type]":
  return (
    <section key={id} className="py-5">
      {/* Renderizar el módulo con config */}
    </section>
  );
```

**AdminPanel.jsx (agregar tarjeta):**
```javascript
{
  id: "[type]",
  title: "[Nombre del Módulo]",
  description: "Descripción de lo que hace...",
  icon: "bi bi-[icono]",
  color: "#[color]",
  route: "/[Nombre]Config",
  purpose: "Propósito del módulo",
}
```

---

## ✅ Checklist de Archivos a Crear/Modificar

**Backend:**
- [ ] `backend/src/controllers/Home/[nombre]Controller.js` (crear)
- [ ] `backend/src/routes/homeConfigRoutes.js` (modificar - agregar import y rutas)

**Frontend:**
- [ ] `frontend/src/pages/ModulosEdición/Home/[Nombre]Config.jsx` (crear)
- [ ] `frontend/src/App.jsx` (modificar - agregar import y ruta)
- [ ] `frontend/src/pages/Home.jsx` (modificar - agregar case en renderSection)
- [ ] `frontend/src/pages/AdminPanel.jsx` (modificar - agregar tarjeta)

---

## 💡 Ejemplo de Prompt Completo

```
Necesito agregar un nuevo módulo editable a la página Home siguiendo la arquitectura actual del proyecto.

INFORMACIÓN DEL MÓDULO:
- **Nombre del módulo**: Testimonios
- **Tipo (type)**: testimonios
- **Propósito**: Mostrar testimonios de familias y residentes
- **Ubicación en la página**: Después de la galería, antes del mapa
- **Order**: 5

CAMPOS QUE DEBE TENER:
1. title: texto - Título de la sección (ej: "Lo que dicen nuestras familias")
2. subtitle: texto - Subtítulo opcional
3. testimonials: array - Array de testimonios, cada uno con:
   - name: texto - Nombre de la persona
   - role: texto - Relación (ej: "Familiar", "Residente")
   - text: texto - Testimonio completo
   - imageUrl: texto - URL de la foto (opcional)
   - rating: número - Calificación de 1-5 estrellas

DATOS DE EJEMPLO:
- title: "Lo que dicen nuestras familias"
- subtitle: "Experiencias reales de quienes confían en nosotros"
- testimonials: [
    {
      name: "María González",
      role: "Hija de residente",
      text: "El mejor lugar para mi madre. Trato profesional y cariñoso.",
      rating: 5
    }
  ]

INSTRUCCIONES:
Por favor, crea el módulo completo siguiendo la arquitectura de módulos existente
(bloquep, carrusel, cuidadod, mapa) que está documentada en /cambios/cambios.txt
```

---

## 📝 Notas Importantes

1. **Todos los módulos usan el mismo modelo PageConfig** - No crear modelos nuevos
2. **El campo `type` debe ser único** - No repetir types existentes
3. **El `order` determina la posición** - Números más bajos aparecen primero
4. **Siempre usar `markModified("sections")`** - MongoDB necesita esto para Mixed types
5. **Las rutas son `/api/home-config/[type]`** - Seguir esta convención
6. **Vista previa + editor** - El componente de edición debe tener ambos
7. **Agregar al AdminPanel** - Para que sea accesible desde el dashboard

---

## 🔍 Referencias

- Documentación de cambios: `/cambios/cambios.txt`
- Módulos existentes:
  - `bloquep` - Bloque principal (hero)
  - `carrusel` - Carrusel de imágenes
  - `cuidadod` - Cuidado día
  - `mapa` - Mapa y ubicación
