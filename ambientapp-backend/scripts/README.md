# Scripts de Migración

Este directorio contiene scripts para migrar y mantener la base de datos.

## Migración de Límite de Diagnósticos

### 1. migrar-limite-diagnosticos.js

Actualiza el límite de diagnósticos mensuales de usuarios Free de 4 a 3.

**Uso:**
```bash
cd ambientapp-backend
node scripts/migrar-limite-diagnosticos.js
```

**¿Qué hace?**
- Busca todos los usuarios con `tipoSuscripcion: 'free'` y `limites.diagnosticosMes: 4`
- Actualiza `limites.diagnosticosMes` a 3
- Muestra un reporte de los usuarios actualizados
- Verifica que la migración se completó correctamente

### 2. resetear-planinfo.js

Resetea y verifica el planInfo de todos los usuarios Free para asegurar que reflejen los límites correctos.

**Uso:**
```bash
cd ambientapp-backend
node scripts/resetear-planinfo.js
```

**¿Qué hace?**
- Procesa todos los usuarios Free
- Asegura que `limites.diagnosticosMes` sea 3
- Ajusta `diagnosticosRealizados` si excede el nuevo límite
- Muestra el `planInfo` de cada usuario para verificación
- Guarda los cambios en la base de datos

## Orden de Ejecución Recomendado

Para actualizar correctamente todos los usuarios existentes:

```bash
# 1. Primero ejecutar la migración básica
node scripts/migrar-limite-diagnosticos.js

# 2. Luego resetear y verificar planInfo
node scripts/resetear-planinfo.js
```

## Notas Importantes

- **Respaldo:** Es recomendable hacer un respaldo de la base de datos antes de ejecutar scripts de migración
- **Entorno:** Asegúrate de tener configurado el archivo `.env` con la conexión correcta a MongoDB
- **Verificación:** Después de ejecutar los scripts, verifica en la aplicación que los usuarios ven el límite correcto

## Variables de Entorno Necesarias

```env
MONGODB_URI=mongodb://...
# o alternativamente
MONGO_URI=mongodb://...
```

## Solución de Problemas

### El frontend sigue mostrando 4 diagnósticos

Si después de ejecutar los scripts el frontend aún muestra 4:

1. Verifica que los scripts se ejecutaron correctamente
2. Cierra sesión y vuelve a iniciar sesión en la aplicación
3. Verifica en MongoDB que el campo `limites.diagnosticosMes` esté en 3
4. Revisa los logs del backend para ver qué valor retorna la API

### Usuarios con diagnósticos usados > 3

Si un usuario tiene `diagnosticosRealizados: 4` (más que el nuevo límite):
- El script `resetear-planinfo.js` lo ajustará automáticamente a 3
- El usuario verá que ha usado 3/3 diagnósticos
- En el próximo reset mensual volverá a 0/3
