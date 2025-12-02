/**
 * GUÍA DE VERSIONAMIENTO ESCALABLE
 * 
 * ESTRUCTURA ACTUAL:
 * - /api/v1/orders       <- Endpoints actuales
 * - /api/v2/orders       <- Endpoints futuros (cuando sea necesario)
 * 
 * CÓMO AGREGAR UNA NUEVA VERSIÓN:
 * 
 * 1. Crear una nueva carpeta en src/routes/vX (donde X es el número de versión)
 *    mkdir src/routes/v3
 * 
 * 2. Crear src/routes/v3/index.ts con las nuevas rutas:
 *    export const v3Routes = () => {
 *        const router = Router();
 *        // Define tus rutas aquí
 *        return router;
 *    }
 * 
 * 3. Importar en src/routes/index.ts:
 *    import { v3Routes } from "./v3";
 * 
 * 4. Registrar la nueva versión:
 *    router.use('/v3', v3Routes());
 * 
 * VENTAJAS DE ESTA ESTRUCTURA:
 * 
 * ✅ Escalable: Agregar nuevas versiones es simple y rápido
 * ✅ Mantenible: Cada versión es independiente en su carpeta
 * ✅ Compatible: Los clientes pueden seguir usando versiones antiguas
 * ✅ Limpio: Cambios en v2 no afectan a v1
 * ✅ Testeable: Puedes probar cada versión por separado
 * 
 * ESTRATEGIA DE DEPRECACIÓN:
 * 
 * Cuando desees deprecar una versión:
 * 
 * 1. Agrega un middleware que avise sobre deprecación:
 *    router.use('/v1', deprecationWarning('v1', 'v2'), v1Routes());
 * 
 * 2. Crea un middleware en src/middlewares/deprecation.ts:
 *    export const deprecationWarning = (oldVersion: string, newVersion: string) => {
 *        return (req, res, next) => {
 *            res.setHeader('Deprecation', 'true');
 *            res.setHeader('Sunset', new Date('2025-12-31').toUTCString());
 *            res.setHeader('Link', `</api/${newVersion}${req.path}>; rel="successor-version"`);
 *            next();
 *        };
 *    };
 * 
 * ESTRUCTURA DE CARPETAS FINAL:
 * 
 * src/
 *   routes/
 *     v1/
 *       index.ts          <- Rutas v1
 *     v2/
 *       index.ts          <- Rutas v2
 *     v3/
 *       index.ts          <- Rutas v3 (futuro)
 *     orders.routes.ts    <- Componentes compartidos
 *     index.ts            <- Punto de entrada de todas las versiones
 * 
 * EJEMPLOS DE LLAMADAS:
 * 
 * GET  /api/v1/orders
 * POST /api/v1/orders
 * GET  /api/v2/orders
 * POST /api/v2/orders
 */
