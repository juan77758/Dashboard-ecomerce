# Biblioteca CAD — versión 3

[**Descargar BIBLIOTECA_CAD_v3.zip**](BIBLIOTECA_CAD_v3.zip?raw=true)

Extrae en una carpeta nueva y abre `BIBLIOTECA_CAD_V3/BIBLIOTECA_BLOQUES_MAESTRA.dxf`. Tras comprobar la apertura en AutoCAD, usa **Guardar como → DWG**.

Esta versión corrige el error de apertura «Imposible añadir VERTEX ... el bloque SRC_0297 no estaba definido». Se restauraron tres encabezados POLYLINE dentro de su bloque HC1 original, con los diez vértices, flags de cierre y punto base obtenidos del DWG original. Se comprobaron todas las secuencias de vértices y atributos del archivo: cero registros huérfanos. Incluye las correcciones anteriores de 15 tipos de línea y 12 colores de estilos de cotas.

La apertura de esta versión en AutoCAD está pendiente de la comprobación del usuario. Aquí se verificaron la estructura, los patrones de línea y la auditoría de ezdxf; no hay AutoCAD instalado.

La biblioteca contiene 1.609 entradas organizadas, muestra PDF, índice CSV y los 1.612 originales. Las fuentes B0795, B0924 y B1093 siguen pendientes de lectura nativa. Los informes y detalles están dentro del ZIP.

No se incluye un DWG maestro validado; los scripts AutoLISP opcionales permiten guardar o ensamblar desde AutoCAD completo para Windows, sin ejecución de prueba aquí.
