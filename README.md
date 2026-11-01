# Biblioteca CAD — versión 2

[**Descargar BIBLIOTECA_CAD_v2.zip**](BIBLIOTECA_CAD_v2.zip?raw=true)

Extrae el ZIP en una carpeta nueva y abre `BIBLIOTECA_CAD_V2/BIBLIOTECA_BLOQUES_MAESTRA.dxf` en AutoCAD. Después usa **Guardar como → DWG**.

Esta revisión corrige el error de apertura «Error en la tabla LTYPE: número insuficiente de elementos de tipo de línea» detectado en AutoCAD: se restauraron 15 patrones HIDDEN/DASHED incompletos usando definiciones válidas existentes con idéntica longitud y cantidad de elementos. También se corrigieron 12 valores de color fuera de rango en estilos de cotas. Los tags de BLOCKS, ENTITIES y OBJECTS permanecen idénticos.

La apertura de esta versión en AutoCAD está pendiente de comprobación por el usuario; aquí se verificaron las definiciones, los rangos de color y la lectura/auditoría de ezdxf.

Incluye 1.609 entradas organizadas en siete categorías, índice CSV, muestra PDF, informe y los 1.612 originales DWG. Tres fuentes no pudieron incorporarse: B0795 Ómnibus, B0924 Tina 16Alzado y B1093 Det Est; se conservan en ORIGINALES.

No se incluye un DWG maestro validado. Hay scripts AutoLISP opcionales de guardado y ensamblado para AutoCAD completo de Windows, no ejecutados en este entorno.
