SELECT c.mail
FROM BRK_T_TELEFONOS c
WHERE c.cd_compania >= 1
  AND c.cd_codigo =
    ---param que viene de la brk_t_ramos_cotizacion cd_ejecutivo_siniestro
      (select rc.CD_EJECUTIVO_SINIESTRO
       from BRK_T_RAMOS_COTIZACION rc
       where rc.CD_COMPANIA = :cdCompania
         and rc.CD_RAMO_COTIZACION = :cdRamoCotizacion)
  AND c.mail IS NOT NULL
  AND c.cd_tabla = (SELECT t.cd_tabla
                    FROM BRK_T_TABLAS t
                    WHERE UPPER(t.nm_tabla) = 'BRK_T_EJECUTIVOS_ADM'
                      AND t.cd_compania = 1) /*Siempre debe ser cd_compania = 1*/
order by CD_TELEFONO desc