# 🏁 AUTITOS GT // SPECIAL STAGE: 30 DE SEPTIEMBRE

> *"Es algo tarde pero feliz 30 de septiembre >:3 disfruta del minijuego"*

Una experiencia web de carreras arcade en 3D con estética de **PlayStation 2** (inspirada en clásicos como *Need for Speed: Underground*, *Gran Turismo 3/4* y *Burnout 3*), creada para celebrar el **30 de septiembre** (la respuesta oficial al 21 de septiembre de flores amarillas, donde se regalan autitos y Hot Wheels).

---

## 🌟 Novedades y Actualizaciones Recientes

### 1. 🛣️ Asfalto y Terreno Sólidos (Solución de Transparencia)
- **Corrección de Normales y Devanado (Winding)**: Se corrigió el orden de los vértices triangulares en el generador de malla de la pista (`v1, v3, v2` y `v2, v3, v4`), eliminando el backface culling que hacía que la carretera se viera transparente desde la vista de cámara superior.
- **Materiales DoubleSide y Texturas Procedurales**:
  - **Asfalto**: Texturas de lona procedurales en alta definición con áridos, líneas continuas de carril, líneas discontinuas centrales y reflectores viales (neón cian y magenta en la fase nocturna).
  - **Terreno Sólido y Opaco**: Plano de suelo base de 620x620m con textura procedural con relieve (césped urbano con losetas en Fase 1, surcos agrícolas y tierra fértil en Fase 2, pizarra y roca granítica alpina en Fase 3), renderizado con `side: THREE.DoubleSide` a `y = -0.05` para evitar cualquier parpadeo de profundidad (Z-fighting).

### 2. 🗺️ Circuitos con Formas y Curvas Completamente Distintas
Cada una de las 3 fases cuenta ahora con una arquitectura geométrica y trazado único:

1. **FASE 1: CIUDAD & VIADUCTO HOSPITAL HRT (TALCA)**:
   - **Forma**: Circuito urbano en cuadrícula (estilo street circuit).
   - **Curvas**: Largas rectas de avenida, cuatro curvas cerradas en ángulo recto de 90°, una chicane técnica y una espectacular rampa de viaducto elevado a **Y = 9.8 metros** que describe una curva panorámica de 120° rodeando la torre principal y el helipuerto del **Hospital Regional de Talca (HRT)**.
   - **Atajo**: Desvío por la calle de acceso inferior frente a la marquesina roja de Urgencias HRT y las ambulancias 3D.

2. **FASE 2: EL CAMPO // RUTA DOBLE & TIERRA**:
   - **Forma**: Trazado rural asimétrico orgánico (forma de riñón).
   - **Curvas**: Curvas parabólicas de alta velocidad entre trigales, subida a colina, la técnica **"Horquilla del Molino"** (curva cerrada de 180° alrededor de un molino de viento de madera), y una serie de S fluidas cruzando el **Sector de Barro Rural**.
   - **Atajo**: Camino de tierra estrecho que cruza entre los graneros rojos.

3. **FASE 3: GRAN CORDILLERA & CIRCUITO NOCTURNO**:
   - **Forma**: Paso de montaña serpentine / touge de alta exigencia técnica.
   - **Curvas**: Curvas cerradas en horquilla (*switchbacks*) escalando la ladera rocosa hasta **"La Cumbre"** a **Y = 17.5 metros** de altitud, entrada y recorrido por el **Túnel de Montaña de Granito**, puente viaducto colgante sobre el abismo y bajada con escapatoria de grava.

### 3. 🚜 Penalizaciones de Tierra Específicas por Categoría de Vehículo
El sistema de física detecta dinámicamente si el auto transita por zonas de barro/tierra y aplica las penalizaciones exactas:
- **SUVs** (Lion 3008, Chevy Tahoe 4x4): **10% de penalización** (conservan el 90% de su velocidad máxima y alta tracción). ¡Ideales para dominar la Fase 2!
- **Sedanes** (Chevy Bowtie RS, Bavaria 330 M, Stuttgart Star): **25% de penalización** (conservan el 75% de velocidad máxima, comportamiento equilibrado).
- **Deportivos** (Porsche 911 GT, Corvette C8, Huracán EVO): **50% de penalización** (reducen su velocidad a la mitad, con pérdida de agarre y derrapes pronunciados).
- **Alerta de Telemetría Dinámica**: La etiqueta del HUD parpadea mostrando la penalización exacta en tiempo real según el vehículo conducido (ej: `[ ZONA DE TIERRA // PENALIZACIÓN SUV -10% ]`).

### 4. 🧭 Minimapa Dinámico con Auto-Fit
- El radar/minimapa calcula automáticamente los límites de cada circuito (`bounds`), adaptándose a las dimensiones y formas de cada pista sin cortes en los bordes.
- Se destacan en color naranja brillante los sectores de tierra/barro sobre la traza del minimapa.

---

## 🏎️ Catálogo de Autos 3D

| Modelo en Juego | Inspiración Real | Categoría | Velocidad | Maniobrabilidad | Aceleración | Penalización Tierra |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **Lion 3008** | Peugeot 3008 Crossover | SUV | 43% | 95% | 64% | **-10%** |
| **Chevy Tahoe 4x4** | Chevrolet Tahoe / Suburban | SUV | 45% | 92% | 66% | **-10%** |
| **Chevy Bowtie RS** | Chevrolet Cruze / Onix RS | SEDÁN | 68% | 68% | 69% | **-25%** |
| **Bavaria 330 M** | BMW Serie 3 M-Sport | SEDÁN | 70% | 66% | 71% | **-25%** |
| **Stuttgart Star** | Mercedes-Benz Clase C/E | SEDÁN | 69% | 67% | 70% | **-25%** |
| **Carrera 911 GT** | Porsche 911 GT | DEPORTIVO | 94% | 40% | 92% | **-50%** |
| **Stingray V8** | Chevrolet Corvette C8 | DEPORTIVO | 93% | 42% | 91% | **-50%** |
| **Toro V10 EVO** | Lamborghini Huracán EVO | DEPORTIVO | 97% | 36% | 96% | **-50%** |

---

## 🚀 Despliegue en GitHub Pages (100% Gratuito)

1. En tu cuenta de [GitHub](https://github.com/new), crea un repositorio nuevo (ej: `autitos-30-septiembre`).
2. Sube todos los archivos del proyecto (`index.html`, `README.md`, `css/` y `js/`).
3. Ve a **Settings** ➔ pestaña **Pages** en GitHub.
4. En **Source**, selecciona `Deploy from a branch` con rama `main` en `/(root)`. Haz clic en **Save**.
5. ¡Listo! En 30-60 segundos tendrás tu enlace público web para jugar en cualquier teléfono o PC.

---

¡Feliz 30 de Septiembre! 🏁
