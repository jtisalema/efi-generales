SELECT NVL(ea.nm_agente, ' ') || ' ' || NVL(ea.ap_agente, ' ')
from BRK_T_EJECUTIVOS_ADM ea
where ea.CD_EJECUTIVO = (select rc.CD_EJECUTIVO_SINIESTRO
                         from BRK_T_RAMOS_COTIZACION rc
                         where rc.CD_COMPANIA = :cdCompania
                           and rc.CD_RAMO_COTIZACION = :cdRamoCotizacion)