# Módulo 2: Bitácora de Visitas de Parcelas
# Instrucciones para Antigravity

## CONTEXTO
Ya tengo el módulo 1 (Control de Combustible) funcionando con Google Sheets + Apps Script.
Ahora necesito desplegar el módulo 2: Bitácora de Visitas de Parcelas.
Misma arquitectura: PWA estática → GET request → Google Apps Script → Google Sheets.

## ARQUITECTURA
- Frontend: `bitacora-parcelas.html` (adjunto, PWA completa y funcional)
- Backend: Google Apps Script (agregar al mismo Sheet de combustible o crear uno nuevo)
- Base de datos: Google Sheets
- CORS: TODO por GET (POST no funciona por redirección 302 de Google)
- Deploy: GitHub Pages

## GOOGLE SHEET
Cuenta: driveconsdeagave@gmail.com

### Pestañas a crear:
1. **Bitácora de Visitas** — donde caen los registros
2. **Catálogo Parcelas** — 101 parcelas (datos en Inventario_y_colaboradores_26.xlsx)
3. **Catálogo Colaboradores** — 14 colaboradores (datos en el mismo Excel)

### IMPORTANTE: Catálogos Dinámicos
La app debe leer parcelas y colaboradores desde el Google Sheet al iniciar, NO hardcodeados en el HTML.
Agregar endpoint: `GET ?action=catalogos` que devuelva ambos listados como JSON.
Así cuando se agrega una parcela o colaborador en el Sheet, la app se actualiza sola.
Si no hay internet, usar última versión en caché (IndexedDB/localStorage).

### Encabezados pestaña "Bitácora de Visitas":
```
Fecha | Hora | Nombre | Rol | Parcela | Rancho | Contrato | Superficie (ha) | Inventario | Año | Cal. Camino Acceso | Obs. Camino Acceso | Cal. Camino Interno | Obs. Camino Interno | Cal. Falsete | Obs. Falsete | Cal. Lienzo | Obs. Lienzo | Cal. Guarda Raya | Obs. Guarda Raya | Cal. Cartel Ganado | Obs. Cartel Ganado | Cal. Sin Ganado | Obs. Sin Ganado | Cal. Cunetas | Obs. Cunetas | Cal. Labores Culturales | Obs. Labores Culturales | Cal. Desarrollo Planta | Obs. Desarrollo Planta | Cal. Plagas | Obs. Plagas | Cal. Basura/Geo | Obs. Basura/Geo | Cal. Malezas | Obs. Malezas | % Maleza | Tipo Maleza | Altura Maleza | Calificación Global | Semáforo | Acciones Correctivas | Latitud | Longitud | Google Maps
```

## ENDPOINTS APPS SCRIPT

### GET — Catálogos
```
?action=catalogos
→ { parcelas: [{r:"2.4",a:2020,c:"SAN PEDRO",h:11,i:46096}, ...], colaboradores: [{n:"MARCOS SANCHEZ",r:"SUPERVISOR"}, ...] }
```

### GET — Guardar bitácora
```
?action=saveBitacora&payload=<JSON encoded>
```
Payload contiene: fecha, hora, nombre, rol, parcela, rancho, contrato, superficie, inventario, año, 13 puntos (cal + obs), maleza (pct, tipo, altura), calificación global, semáforo, acciones correctivas, lat, lng.

## FLUJO DE LA APP (3 pantallas)

### Pantalla 1 — Inicio
- "Nueva Visita" → pantalla 2
- "Mis Bitácoras" → pide nombre, muestra historial read-only

### Pantalla 2 — ¿Quién eres?
- Lista de colaboradores con buscador
- Auto-detecta rol al seleccionar

### Pantalla 3 — Bitácora
- Fecha/hora automática
- GPS automático
- Parcela: desplegable buscable con auto-fill de superficie e inventario
- 13 puntos (1-10) con semáforo
- Puntos 3, 6, 7: opción N/A (no cuentan para promedio)
- Punto 13 (Malezas): si < 10 aparecen campos extra (%, tipo, altura)
- Acciones Correctivas: OBLIGATORIO
- Botón PDF para descargar bitácora individual
- Tab "Mi Historial": solo lectura

## 14 COLABORADORES
| Nombre | Puesto |
|---|---|
| MARCOS SANCHEZ | SUPERVISOR |
| JUAN CARLOS CORREA | SUPERVISOR |
| MARIO ZUÑIGA A. | SUPERVISOR |
| MANUEL TAMAYO | SUPERVISOR |
| JESUCRISTIAN GUZMAN | SUPERVISOR |
| EMANUEL RUBIO | SUPERVISOR |
| REYES VEGA | FITOSANITARIO |
| DAVIEL GONZALEZ | JIMAS |
| ALBERTO PARTIDA | JEFE DE AREA |
| ALEJANDRO RAMIREZ | JEFE DE AREA |
| TOMAS CASTAÑEDA | COORDINADOR CULTIVO |
| JORGE LOPEZ | JEFE ADMIN |
| FRANCISCO VANEGAS | GERENTE AGAVE |
| BERNARDO GARCIA | DIRECTOR GENERAL |

## 101 PARCELAS
Están en el archivo Inventario_y_colaboradores_26.xlsx, pestaña PARCELAS.
Columnas: Rancho, Año, Contrato, HAS INICIAL, INVENTARIO INICIAL.

## SYNC (CORS FIX)
La PWA actualmente tiene sync por POST con no-cors. CAMBIAR a GET:
```javascript
const payload = encodeURIComponent(JSON.stringify(data));
await fetch(APPS_SCRIPT_URL + '?action=saveBitacora&payload=' + payload);
```

## LOGO
Embebido en el HTML como base64 (constante LOGO).
Archivo fuente adjunto: Logo_Consolidacion_transparente.png

## DEPLOY
- Crear carpeta `/bitacora/` en el repo de GitHub Pages
- Deploy como PWA con manifest y service worker
- URL final: `https://[usuario].github.io/[repo]/bitacora/`

## TAREAS EN ORDEN
1. Crear Google Sheet con pestañas de catálogos y bitácora
2. Crear/actualizar Apps Script con endpoints (catalogos + saveBitacora)
3. Implementar Apps Script como App Web (Cualquier persona, GET)
4. Modificar bitacora-parcelas.html:
   - Cargar catálogos del Sheet al iniciar (no hardcodeados)
   - Sync por GET en vez de POST
   - Poner la URL del Apps Script
5. Deploy a GitHub Pages
6. Probar desde celular
