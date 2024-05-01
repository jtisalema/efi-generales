-- pagination reference http://www.oracle.com/technetwork/issue-archive/2006/06-sep/o56asktom-086197.html
SELECT *
FROM
  (SELECT
     a.*,
     rownum rnum
   FROM
     (SELECT *
      FROM brk_t_incap_siniestro i
      ORDER BY i.CD_INC_SINIESTRO) a
   WHERE rownum <= :MAX_ROW_TO_FETCH
  )
WHERE rnum >= :MIN_ROW_TO_FETCH;
--en pagination

-- search siniestros
SELECT
  s.CD_RECLAMO,
  s.CD_COMPANIA,
  c.ALIAS_COMPANIA,
  s.NUM_SINIESTRO,
  i.ITEM,
  i.CD_INC_SINIESTRO,
  s.ANO_SINIESTRO,
  s.CD_ASEGURADO_TIT,
  e.alias_estado,
  s.POLIZA,
  r.NM_ALIAS                                                                  NM_RAMO,
  r.NM_RAMO                                                                   NM_RAMO_ALIAS,
  A.NM_ALIAS                                                                  NM_ASEG,
  os.CL_ASEGURADO,
  os.DSC_OBJETO,
  i.CD_INCAPACIDAD,
  ic.NM_INCAPACIDAD,
  TRUNC(i.fc_ultimodoc)                                                       fc_ultimodoc,
  (to_date(SYSDATE, 'dd/mm/yyyy') - to_date(sg.FC_SEGUIMIENTO, 'dd/mm/yyyy')) dias,
  o.DSC_OBJETO                                                                TITULAR,
  i.TP_SINIESTRO,
  f_sum_val_incurrido_vam(i.cd_compania, i.cd_inc_siniestro)                  val_incurrido

FROM BRK_T_COMPANIA c, BRK_T_ASEGURADORAS A,
  BRK_T_RAMOS r,
  BRK_T_SINIESTRO s,
  brk_t_obj_siniestro os,
  brk_t_incap_siniestro i,
  BRK_T_INCAPACIDADES ic,
  BRK_T_SEG_SINIESTRO sg,
  BRK_T_EST_SINIESTRO e,
  brk_t_obj_cotizacion o
WHERE c.CD_COMPANIA = i.CD_COMPANIA
      AND s.CD_RAMO = r.CD_RAMO
      AND s.CD_ASEGURADORA = A.CD_ASEGURADORA
      AND s.CD_COMPANIA = os.CD_COMPANIA
      AND s.CD_RECLAMO = os.CD_RECLAMO
      AND i.CD_INCAPACIDAD = ic.CD_INCAPACIDAD
      AND i.CD_COMPANIA = ic.CD_COMPANIA
      AND (os.cd_compania = i.cd_compania (+))
      AND (os.cd_obj_siniestro = i.cd_obj_siniestro (+))
      AND (sg.CD_COMPANIA (+) = i.CD_COMPANIA)
      AND (sg.CD_INC_SINIESTRO (+) = i.CD_INC_SINIESTRO)
      AND (sg.CD_EST_SINIESTRO = e.CD_EST_SINIESTRO (+))
      AND (sg.ACTIVO (+) = 1)
      AND s.cd_compania = o.cd_compania (+)
      AND s.cd_asegurado_tit = o.cd_asegurado (+)
      AND s.cd_ramo_cotizacion = o.cd_ramo_cotizacion (+)
      --
      AND (nvl(i.estado, '0') <> 'X')
      AND (s.FLG_AMV = 1)
      AND (s.CD_CLIENTE = :cdCliente)
      AND (:numSiniestro IS NULL OR s.NUM_SINIESTRO = :numSiniestro)
      AND (:poliza IS NULL OR s.POLIZA = :poliza)
      AND (:cdRamo IS NULL OR s.CD_RAMO = :cdRamo)
      AND (:cdAseguradora IS NULL OR s.CD_ASEGURADORA = :cdAseguradora)
      AND (:fcDesde IS NULL OR s.FC_SINIESTRO BETWEEN :fcDesde AND :fcHasta)
      AND (:anoSiniestro IS NULL OR s.ANO_SINIESTRO = :anio)
ORDER BY i.CD_INC_SINIESTRO;
-- search count
SELECT count(i.CD_INC_SINIESTRO)

FROM
  BRK_T_SINIESTRO s,
  brk_t_obj_siniestro os,
  brk_t_incap_siniestro i,
  BRK_T_SEG_SINIESTRO sg
WHERE (s.CD_COMPANIA = os.CD_COMPANIA)
      AND (s.CD_RECLAMO = os.CD_RECLAMO)
      AND (os.cd_compania = i.cd_compania (+))
      AND (os.cd_obj_siniestro = i.cd_obj_siniestro (+))
      AND (sg.CD_COMPANIA (+) = i.CD_COMPANIA)
      AND (sg.CD_INC_SINIESTRO (+) = i.CD_INC_SINIESTRO)
      AND (sg.ACTIVO (+) = 1)
      --
      AND (nvl(i.estado, '0') <> 'X')
      AND (s.FLG_AMV = 1)
      AND (s.CD_CLIENTE = :cdCliente)
      AND (:numSiniestro IS NULL OR s.NUM_SINIESTRO = :numSiniestro)
      AND (:poliza IS NULL OR s.POLIZA = :poliza)
      AND (:cdRamo IS NULL OR s.CD_RAMO = :cdRamo)
      AND (:cdAseguradora IS NULL OR s.CD_ASEGURADORA = :cdAseguradora)
      AND (:fcDesde IS NULL OR s.FC_SINIESTRO BETWEEN :fcDesde AND :fcHasta)
      AND (:anoSiniestro IS NULL OR s.ANO_SINIESTRO = :anio)
ORDER BY i.CD_INC_SINIESTRO;

SELECT *
FROM BRK_T_SINIESTRO s
WHERE s.CD_RECLAMO > 35821;
SELECT *
FROM BRK_T_OBJ_SINIESTRO o
WHERE o.CD_RECLAMO > 35821;
SELECT *
FROM BRK_T_OBJ_COTIZACION u
WHERE u.CD_OBJ_COTIZACION = 752439;

SELECT *
FROM BRK_T_SINIESTRO s
WHERE s.ANO_SINIESTRO > 2012 AND s.FLG_AMV = 1 AND s.CD_CLIENTE = 2;

SELECT
  s.CD_RECLAMO,
  ic.NM_INCAPACIDAD,
  i.estado
FROM BRK_T_SINIESTRO s,
  brk_t_obj_siniestro os,
  brk_t_incap_siniestro i,
  BRK_T_SEG_SINIESTRO sg,
  BRK_T_INCAPACIDADES ic
WHERE (s.CD_COMPANIA = os.CD_COMPANIA)
      AND (s.CD_RECLAMO = os.CD_RECLAMO)
      AND (os.cd_compania = i.cd_compania (+))
      AND (os.cd_obj_siniestro = i.cd_obj_siniestro (+))
      AND (sg.CD_COMPANIA (+) = i.CD_COMPANIA)
      AND (sg.CD_INC_SINIESTRO (+) = i.CD_INC_SINIESTRO)
      AND i.CD_INCAPACIDAD = ic.CD_INCAPACIDAD
      AND i.CD_COMPANIA = ic.CD_COMPANIA
      AND (sg.ACTIVO (+) = 1)
      --AND (nvl(i.estado, '0') <> 'X')
      AND s.ANO_SINIESTRO > 2012 AND s.FLG_AMV = 1 AND s.CD_CLIENTE = 2;
---

--- original search vam
SELECT
  BRK_T_SINIESTRO.CD_COMPANIA,
  BRK_T_SINIESTRO.NUM_SINIESTRO,
  BRK_T_INCAP_SINIESTRO.ITEM,
  BRK_T_SINIESTRO.ANO_SINIESTRO,
  BRK_T_SINIESTRO.CD_ASEGURADO_TIT,
  BRK_T_EST_SINIESTRO.alias_estado,
  BRK_T_SINIESTRO.CD_RECLAMO,
  BRK_T_SINIESTRO.POLIZA,
  BRK_T_CLIENTES.CD_CLIENTE,
  BRK_T_CLIENTES.NM_CLIENTE,
  BRK_T_CLIENTES.AP_CLIENTE,
  BRK_T_RAMOS.NM_ALIAS                                                                         RM,
  BRK_T_ASEGURADORAS.NM_ALIAS                                                                  ASEG,
  BRK_T_OBJ_SINIESTRO.CL_ASEGURADO,
  BRK_T_OBJ_SINIESTRO.DSC_OBJETO,
  BRK_T_INCAP_SINIESTRO.CD_INCAPACIDAD,
  TRUNC(BRK_T_INCAP_SINIESTRO.fc_ultimodoc)                                                    fc_ultimodoc,
  BRK_T_INCAP_SINIESTRO.cd_inc_siniestro,
  (to_date(sysdate, 'dd/mm/yyyy') - to_date(BRK_T_SEG_SINIESTRO.FC_SEGUIMIENTO, 'dd/mm/yyyy')) dias,
  brk_t_obj_cotizacion.DSC_OBJETO                                                              TITULAR,
  BRK_T_INCAP_SINIESTRO.TP_SINIESTRO,
  f_sum_val_incurrido_vam(brk_t_incap_siniestro.cd_compania, brk_t_incap_siniestro.cd_inc_siniestro)
FROM BRK_T_ASEGURADORAS,
  BRK_T_CLIENTES,
  BRK_T_RAMOS,
  BRK_T_SINIESTRO,
  brk_t_obj_siniestro,
  brk_t_incap_siniestro,
  BRK_T_SEG_SINIESTRO,
  BRK_T_EST_SINIESTRO,
  brk_t_obj_cotizacion,
  BRK_T_CRED_HOSPITAL,
  brk_t_ramos_cotizacion
WHERE (BRK_T_SINIESTRO.CD_RAMO = BRK_T_RAMOS.CD_RAMO) AND
      (BRK_T_SINIESTRO.CD_ASEGURADORA = BRK_T_ASEGURADORAS.CD_ASEGURADORA) AND
      (BRK_T_SINIESTRO.CD_COMPANIA = brk_t_obj_siniestro.CD_COMPANIA) AND
      (BRK_T_SINIESTRO.CD_RECLAMO = brk_t_obj_siniestro.CD_RECLAMO) AND
      (BRK_T_SINIESTRO.CD_CLIENTE = BRK_T_CLIENTES.CD_CLIENTE) AND
      brk_t_siniestro.cd_compania = brk_t_ramos_cotizacion.cd_compania AND
      brk_t_siniestro.cd_ramo_cotizacion = brk_t_ramos_cotizacion.cd_ramo_cotizacion AND
      brk_t_incap_siniestro.cd_compania = BRK_T_CRED_HOSPITAL.cd_compania (+) AND
      brk_t_incap_siniestro.CD_INC_SINIESTRO = BRK_T_CRED_HOSPITAL.CD_INC_SINIESTRO (+) AND

      (BRK_T_SINIESTRO.FLG_AMV = 1) AND
      (brk_t_obj_siniestro.cd_compania = BRK_T_INCAP_SINIESTRO.cd_compania (+)) AND
      (brk_t_obj_siniestro.cd_obj_siniestro = BRK_T_INCAP_SINIESTRO.cd_obj_siniestro (+)) AND

      (nvl(brk_t_incap_siniestro.estado, '0') <> 'X') AND

      (BRK_T_SEG_SINIESTRO.CD_COMPANIA (+) = BRK_T_INCAP_SINIESTRO.CD_COMPANIA) AND
      (BRK_T_SEG_SINIESTRO.CD_INC_SINIESTRO (+) = BRK_T_INCAP_SINIESTRO.CD_INC_SINIESTRO) AND
      (BRK_T_SEG_SINIESTRO.CD_EST_SINIESTRO = BRK_T_EST_SINIESTRO.CD_EST_SINIESTRO (+)) AND
      (BRK_T_SEG_SINIESTRO.ACTIVO (+) = 1)
      AND brk_t_siniestro.cd_compania = brk_t_obj_cotizacion.cd_compania (+)
      AND brk_t_siniestro.cd_asegurado_tit = brk_t_obj_cotizacion.cd_asegurado (+)
      AND brk_t_siniestro.cd_ramo_cotizacion = brk_t_obj_cotizacion.cd_ramo_cotizacion (+)
      AND BRK_T_SINIESTRO.CD_CLIENTE = 2;


SELECT COUNT(i.CD_INC_SINIESTRO)
FROM BRK_T_SINIESTRO s, brk_t_obj_siniestro os, brk_t_incap_siniestro i, BRK_T_SEG_SINIESTRO sg
WHERE (s.CD_COMPANIA = os.CD_COMPANIA) AND (s.CD_RECLAMO = os.CD_RECLAMO) AND (os.cd_compania = i.cd_compania (+)) AND
      (os.cd_obj_siniestro = i.cd_obj_siniestro (+)) AND (sg.CD_COMPANIA (+) = i.CD_COMPANIA) AND
      (sg.CD_INC_SINIESTRO (+) = i.CD_INC_SINIESTRO) AND (sg.ACTIVO (+) = 1) AND (s.FLG_AMV = 1) AND
      (s.CD_CLIENTE = :cdCliente) AND (:numSiniestro IS NULL OR s.NUM_SINIESTRO = :numSiniestro) AND
      (:poliza IS NULL OR s.POLIZA = :poliza) AND (:cdRamo IS NULL OR s.CD_RAMO = :cdRamo) AND
      (:cdAseguradora IS NULL OR s.CD_ASEGURADORA = :cdAseguradora) AND
      (:fcDesde IS NULL OR s.FC_SINIESTRO BETWEEN :fcDesde AND :fcHasta) AND (:anio IS NULL OR s.ANO_SINIESTRO = :anio)
ORDER BY i.CD_INC_SINIESTRO;

-- credito hospitalario
SELECT
  h.CD_CRED_HOSPITAL,
  h.CD_COMPANIA,
  h.CD_HOSPITAL,
  ho.NM_HOSPITAL,
  h.CD_INC_SINIESTRO,
  h.CD_EJECUTIVO,
  h.CD_MEDICO,
  m.AP_MEDICO,
  m.NM_MEDICO,
  h.CHEQUE_A,
  h.APROBADO,
  h.VAL_PRESUPUESTO,
  h.VAL_APROBADO,
  h.VAL_NOTA_COB,
  h.VAL_NO_CUBIERTO,
  h.VAL_DEDUCIBLE,
  h.VAL_COASEGURO,
  h.FC_PREVISTA,
  h.FC_VENCE,
  h.FC_PAGO,
  h.FC_APRUEBA,
  h.FC_SEGUIMIENTO,
  h.VAL_PAGO,
  h.VAL_SALDO,
  h.PAGADO,
  h.NOTA_COBRANZA,
  h.BANCO,
  h.CHEQUE,
  h.CARTA_ASEG_NC,
  h.CARTA_CLI_NC,
  h.OBSERVACIONES,
  h.INSTRUCCIONES,
  h.CD_RECLAMO,
  h.LIQUIDA,
  h.CTA_CTE,
  h.SALDO_ANTERIOR,
  h.FORMA_PAGO,
  h.FC_CARTA_CLI,
  h.FC_CARTA_ASEG,
  h.VAL_INCURRIDO

FROM BRK_T_CRED_HOSPITAL h LEFT JOIN BRK_T_HOSPITALES ho
    ON h.CD_HOSPITAL = ho.CD_HOSPITAL AND h.CD_COMPANIA = ho.CD_COMPANIA
  LEFT JOIN BRK_T_MEDICOS m ON h.CD_MEDICO = m.CD_MEDICO AND h.CD_COMPANIA = m.CD_COMPANIA

WHERE h.CD_COMPANIA = 1
      AND h.CD_INC_SINIESTRO = 48233;