package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.dto.ResultIncapSiniestroPortal;
import com.tefisoft.efiweb.entidad.CobDedSiniestro;
import com.tefisoft.efiweb.entidad.CredHospital;
import com.tefisoft.efiweb.entidad.DocSiniestro;
import com.tefisoft.efiweb.entidad.GastosVam;
import com.tefisoft.efiweb.entidad.IncapSiniestro;
import com.tefisoft.efiweb.entidad.Inspeccion;
import com.tefisoft.efiweb.entidad.PagoSiniestro;
import com.tefisoft.efiweb.entidad.ResumenGastosLiquidacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author dacopanCM on 25/08/17.
 */
@Repository
public class SiniestroJdbcDao implements Serializable {
    private JdbcTemplate jdbcTemplate;
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private static final String Q_COBERTURA = "SELECT d.CD_COB_DED_SINIESTRO, d.nm_cobertura, d.val_limite, d.aceptado, d.pct_reclamo, d.pct_v_aseg, d.val_minimo, d.val_fijo, d.observaciones, d.cd_compania, d.cd_reclamo,d.VAL_SINIESTRO,d.VAL_EXCESO,d.VAL_NOELEGIBLE,d.VAL_TOTAL, d.VAL_DEDUCIBLE, d.VAL_MONTO_COA FROM brk_t_cob_ded_siniestro d WHERE d.CD_COMPANIA=? ";
    private static final String Q_GESTION = "SELECT i.CD_INSPECCION, i.fc_inspeccion, i.inspector, i.lugar, i.observaciones, s.DSC_ESTADO as estado FROM BRK_T_INSPECCION i, BRK_T_EST_SINIESTRO s WHERE s.CD_EST_SINIESTRO = i.CD_EST_SINIESTRO and i.cd_compania = ? AND i.cd_reclamo = ? ORDER BY i.INSPECTOR";
    private static final String Q_DOCS = "SELECT d.CD_DOC_SINIESTRO, t.nm_documento, d.recibo, d.fc_recibo_brk, d.fc_envio_aseg, d.envio, d.obs_doc_siniestro, d.fc_recuerda_cli, d.doc_recuerda_cli FROM brk_t_doc_siniestro d, brk_t_tp_doc_siniestro t WHERE d.cd_tp_doc_siniestro = t.cd_tp_doc_siniestro AND d.CD_COMPANIA=? ";
    private static final String Q_FACTURAS = "SELECT g.CD_GASTOS_VAM,g.NUM_RECIBO,g.FC_GASTO,g.DETALLE,g.VALOR,g.VAL_NO_CUBIERTO,g.VALOR_A_PAGAR,g.APROBADO,g.ENVIO,g.OBS_GASTO_VAM,g.ITEM,g.TIPO,g.CARTA,g.FC_ULTIMODOC,g.IMPRESO,g.CD_RECLAMO,g.RESERVA,g.VALOR_PAGADO,g.BLOQUEO,g.CD_COBERTURA,g.DOC_ADIC,g.ADICIONAL,d.NM_COBERTURA FROM BRK_T_GASTOS_VAM g LEFT JOIN brk_t_coberturas d ON g.CD_COBERTURA = d.cd_cobertura  WHERE g.TIPO = ? AND g.cd_compania = ?";
    private static final String Q_FACTURAS_VAM = "SELECT g.CD_COMPANIA,g.CD_GASTOS_VAM,g.CD_COB_DED_SINIESTRO,g.NUM_RECIBO,g.FC_GASTO,g.DETALLE,g.VALOR,g.OBS_GASTO_VAM,g.APROBADO,g.ITEM,g.TIPO,g.CARTA,g.FC_ULTIMODOC,g.IMPRESO,g.ENVIO_CLIENTE,d.CD_INC_SINIESTRO,d.NM_COBERTURA FROM BRK_T_GASTOS_VAM g LEFT JOIN BRK_T_COB_DED_SINIESTRO d  ON g.CD_COB_DED_SINIESTRO = d.CD_COB_DED_SINIESTRO WHERE g.TIPO = ? AND g.CD_COMPANIA = ? AND d.CD_INC_SINIESTRO = ?";
    private static final String Q_LIQUIDACION = "SELECT P.CD_PAGO,P.CD_RECLAMO,P.CD_COMPANIA,P.VALOR_SOL,P.FC_PAGO_SOL,P.FORMA_PAGO,P.FC_PAGO,P.VAL_PAGO,P.FC_DOC_PAGO,P.BANCO,P.CHEQUE,P.CTA_CTE,B.DSC_RUBRO,P.OBS_PAGO,P.FINIQUITO FROM BRK_T_PAGO_SINIESTRO P,BRK_T_RUBROS B,BRK_T_TABLAS C,BRK_T_TABLAS_RUBRO D WHERE P.CD_RUBRO = D.CD_TAB_RUBRO AND p.CD_COMPANIA = d.CD_COMPANIA AND D.CD_TABLA = C.CD_TABLA AND D.CD_RUBRO = B.CD_RUBRO AND C.NM_TABLA LIKE '%BRK_T_LIQUIDA_SIN%' AND P.CD_COMPANIA = ? ";
    private static final String Q_GASTOS_LIQUIDACION = "SELECT A.CD_COMPANIA, A.CD_PRELIQ_SINIESTRO, A.CD_RECLAMO, A.VAL_PERDIDA, A.VAL_DEPRECIACION, A.VAL_DEDUCIBLE, A.VAL_INDEMNIZACION, A.VAL_RASA, A.VAL_PAGO_PARCIAL, A.VAL_SALVAMENTO, A.VAL_OTROS, A.VAL_RECIBIR, A.OBSERVACIONES, A.ACT_RASA, A.FC_SEGUIMIENTO, A.NUM_CARTA_SEG, A.NOTA_DEBITO, A.VAL_PAGO_PROV_OTROS, A.PAGO_ND,  (NVL(A.VAL_INDEMNIZACION,0)  - NVL(A.VAL_RASA,0) ) as Subtotal, (NVL(A.VAL_PERDIDA,0) - NVL(A.VAL_DEPRECIACION,0) - NVL(A.VAL_DEDUCIBLE, 0)) as Indemnizacion FROM BRK_T_PRELIQ_SINIESTRO A WHERE A.CD_COMPANIA = ? AND A.CD_RECLAMO = ?";
    private static final String Q_CRED_HOSP = "SELECT h.CD_CRED_HOSPITAL,h.CD_COMPANIA,h.CD_HOSPITAL,ho.NM_HOSPITAL,h.CD_INC_SINIESTRO,h.CD_EJECUTIVO,h.CD_MEDICO,m.AP_MEDICO,m.NM_MEDICO,h.CHEQUE_A,h.APROBADO,h.VAL_PRESUPUESTO,h.VAL_APROBADO,h.VAL_NOTA_COB,h.VAL_NO_CUBIERTO,h.VAL_DEDUCIBLE,h.VAL_COASEGURO,h.FC_PREVISTA,h.FC_VENCE,h.FC_PAGO,h.FC_APRUEBA,h.FC_SEGUIMIENTO,h.VAL_PAGO,h.VAL_SALDO,h.PAGADO,h.NOTA_COBRANZA,h.BANCO,h.CHEQUE,h.CARTA_ASEG_NC,h.CARTA_CLI_NC,h.OBSERVACIONES,h.INSTRUCCIONES,h.CD_RECLAMO,h.LIQUIDA,h.CTA_CTE,h.SALDO_ANTERIOR,h.FORMA_PAGO,h.FC_CARTA_CLI,h.FC_CARTA_ASEG,h.VAL_INCURRIDO FROM BRK_T_CRED_HOSPITAL h LEFT JOIN BRK_T_HOSPITALES ho  ON h.CD_HOSPITAL = ho.CD_HOSPITAL AND h.CD_COMPANIA = ho.CD_COMPANIA LEFT JOIN BRK_T_MEDICOS m ON h.CD_MEDICO = m.CD_MEDICO AND h.CD_COMPANIA = m.CD_COMPANIA WHERE h.CD_COMPANIA = ? AND h.CD_INC_SINIESTRO =?";
    private static final String Q_SEARCH_INCAP_SIN_VAM_FROM = "FROM BRK_T_COMPANIA c, " +
            "     BRK_T_ASEGURADORAS A, " +
            "     BRK_T_RAMOS r, " +
            "     BRK_T_SINIESTRO s, " +
            "     brk_t_obj_siniestro os, " +
            "     brk_t_incap_siniestro i, " +
            "     BRK_T_INCAPACIDADES ic, " +
            "     BRK_T_SEG_SINIESTRO sg, " +
            "     BRK_T_EST_SINIESTRO e, " +
            "     brk_t_obj_cotizacion o, " +
            "     BRK_T_RAMOS_COTIZACION rc " +
            "WHERE c.CD_COMPANIA = i.CD_COMPANIA " +
            "  AND s.CD_RAMO = r.CD_RAMO " +
            "  AND s.CD_ASEGURADORA = A.CD_ASEGURADORA " +
            "  AND s.CD_COMPANIA = os.CD_COMPANIA " +
            "  AND s.CD_RECLAMO = os.CD_RECLAMO " +
            "  AND i.CD_INCAPACIDAD = ic.CD_INCAPACIDAD " +
            "  AND (os.cd_compania = i.cd_compania (+)) " +
            "  AND (os.cd_obj_siniestro = i.cd_obj_siniestro (+)) " +
            "  AND (sg.CD_COMPANIA (+) = i.CD_COMPANIA) " +
            "  AND (sg.CD_INC_SINIESTRO (+) = i.CD_INC_SINIESTRO) " +
            "  AND (sg.CD_EST_SINIESTRO = e.CD_EST_SINIESTRO (+)) " +
            "  AND (sg.ACTIVO (+) = 1) " +
            "  AND s.cd_compania = o.cd_compania (+) " +
            "  AND s.cd_asegurado_tit = o.cd_asegurado (+) " +
            "  AND s.cd_ramo_cotizacion = o.cd_ramo_cotizacion (+) " +
            "  AND (s.FLG_AMV = 1) " +
            "  AND rc.CD_COMPANIA = s.CD_COMPANIA " +
            "  and rc.CD_RAMO_COTIZACION = s.CD_RAMO_COTIZACION " +
            "  AND (:cdCliente IS NULL OR s.cd_Cliente = :cdCliente) " +
            "  AND (:numSiniestro IS NULL OR s.NUM_SINIESTRO = :numSiniestro) " +
            "  AND (:poliza IS NULL OR s.POLIZA = :poliza) " +
            "  AND (:cdRamo IS NULL OR s.CD_RAMO = :cdRamo) " +
            "  AND (:cdAseguradora IS NULL OR s.CD_ASEGURADORA = :cdAseguradora) " +
            "  AND (:fcDesde IS NULL OR s.FC_SINIESTRO BETWEEN :fcDesde AND :fcHasta) " +
            "  AND (:anio IS NULL OR s.ANO_SINIESTRO = :anio) " +
            "  AND (:dscObjeto IS NULL OR os.DSC_OBJETO LIKE :dscObjeto) " +
            "  AND (:titular IS NULL OR o.DSC_OBJETO LIKE :titular) " +
            "  AND (:cdEjecutivo IS NULL OR rc.cd_ejecutivo = :cdEjecutivo) " +
            "  AND (:cdPool IS NULL OR rc.cd_agente IN (:cdAgente))";

    private static final String Q_SEARCH_SINIESTROS_GEN_FROM = "FROM BRK_T_COMPANIA C, " +
            "     BRK_T_ASEGURADORAS A, " +
            "     BRK_T_RAMOS r," +
            "     BRK_T_SINIESTRO_SS s," +
            "     BRK_T_OBJ_SINIESTRO_SS os," +
            "     BRK_T_INCAP_SINIESTRO_SS i," +
            "     BRK_T_INCAPACIDADES ic," +
            "     BRK_T_SEG_SINIESTRO_SS sg," +
            "     BRK_T_EST_SINIESTRO e," +
            "     brk_t_obj_cotizacion o," +
            "     BRK_T_RAMOS_COTIZACION rc," +
            "     BRK_T_CLIENTES cl " +
            "WHERE c.CD_COMPANIA = i.CD_COMPANIA" +
            "  AND s.CD_CLIENTE = cl.CD_CLIENTE" +
            "  AND s.CD_RAMO = r.CD_RAMO" +
            "  AND s.CD_ASEGURADORA = A.CD_ASEGURADORA" +
            "  AND s.CD_COMPANIA = os.CD_COMPANIA" +
            "  AND s.CD_RECLAMO = os.CD_RECLAMO" +
            "  AND i.CD_INCAPACIDAD = ic.CD_INCAPACIDAD" +
            "  AND rc.CD_COMPANIA = o.CD_COMPANIA" +
            "  and rc.CD_RAMO_COTIZACION = o.CD_RAMO_COTIZACION" +
            "  AND (os.cd_compania = i.cd_compania (+))" +
            "  AND (os.cd_obj_siniestro = i.cd_obj_siniestro (+))" +
            "  AND (sg.CD_COMPANIA (+) = i.CD_COMPANIA)" +
            "  AND (sg.CD_INC_SINIESTRO (+) = i.CD_INC_SINIESTRO)" +
            "  AND (sg.CD_EST_SINIESTRO = e.CD_EST_SINIESTRO (+))" +
            "  AND (sg.ACTIVO (+) = 1)" +
            "  AND s.CD_CLIENTE = cl.CD_CLIENTE" +
            "  AND s.cd_compania = o.cd_compania (+)" +
            "  AND s.cd_asegurado_tit = o.cd_asegurado (+)" +
            "  AND s.cd_ramo_cotizacion = o.cd_ramo_cotizacion (+)" +
            "  AND (s.FLG_AMV = 1)" +
            "  AND (:cdContratante IS NULL OR s.CD_CLIENTE = :cdContratante)" +
            "  AND (:cdRamo IS NULL OR s.CD_RAMO = :cdRamo)" +
            "  AND (:poliza IS NULL OR s.POLIZA = :poliza)" +
            "  AND (:cdEstado IS NULL OR i.ESTADO_PORTAL = :cdEstado)" +
            "  AND (:fcCreDesde IS NULL OR s.FC_CREACION BETWEEN :fcCreDesde AND :fcCreHasta)\n" +
            "  AND (:fcIncuDesde IS NULL OR i.FC_ALCANCE BETWEEN :fcIncuDesde AND :fcIncuHasta)\n" +
            "  AND (:cdReclamo IS NULL OR i.TP_SINIESTRO = :cdReclamo)" +
            "  AND (:cdEjecutivo IS NULL OR rc.CD_EJECUTIVO_SINIESTRO = :cdEjecutivo) " +
            "  AND i.LIQUIDADO <> 1 ";

    private static final String Q_SEARCH_INCAP_SIN_VAM_DATA = "SELECT s.CD_RECLAMO, s.CD_COMPANIA, c.ALIAS_COMPANIA, s.NUM_SINIESTRO, i.ITEM, i.CD_INC_SINIESTRO, s.ANO_SINIESTRO, s.CD_ASEGURADO_TIT, e.alias_estado, s.POLIZA, r.NM_ALIAS NM_RAMO_ALIAS,r.NM_RAMO NM_RAMO, A.NM_ALIAS NM_ASEG,A.NM_ASEGURADORA, os.CL_ASEGURADO, os.DSC_OBJETO, i.CD_INCAPACIDAD, ic.NM_INCAPACIDAD, TRUNC(i.fc_ultimodoc) fc_ultimodoc, (to_date(SYSDATE, 'dd/mm/yyyy') - to_date(i.fc_ultimodoc, 'dd/mm/yyyy')) dias, (to_date(i.fc_liquida, 'dd/mm/yyyy') - to_date(i.fc_ultimodoc, 'dd/mm/yyyy'))  dias2, o.DSC_OBJETO TITULAR, i.TP_SINIESTRO, f_sum_val_incurrido_vam(i.cd_compania, i.cd_inc_siniestro) val_incurrido, i.FC_ALCANCE as FC_SINIESTRO, s.CD_CLIENTE, i.estado, os.CD_ASEGURADO, rc.CD_RAMO, rc.cd_ramo_cotizacion " + Q_SEARCH_INCAP_SIN_VAM_FROM;
    private static final String Q_SEARCH_INCAP_SIN_VAM_COUNT = "SELECT COUNT(i.CD_INC_SINIESTRO) " + Q_SEARCH_INCAP_SIN_VAM_FROM;
    private static final String Q_SEARCH_RAMO_COTIZACION = "select distinct r.NM_RAMO, p.DSC_PLAN " +
            "from BROKER.BRK_T_RAMOS r, " +
            "     brk_t_planes p, " +
            "     BRK_T_UBICACION u, " +
            "     BRK_T_OBJ_COTIZACION o, " +
            "     BRK_T_RAMOS_COTIZACION rc, " +
            "     BRK_T_V_POLIZAS a " +
            "where rc.CD_RAMO = r.CD_RAMO " +
            "  AND a.cd_ramo_cotizacion = rc.cd_ramo_cotizacion " +
            "  AND o.CD_UBICACION = u.CD_UBICACION " +
            "  AND p.CD_PLAN = u.CD_PLAN " +
            "AND rc.CD_RAMO_COTIZACION = :cdRamoCotizacion and u.CD_UBICACION = :cdUbicacion and r.CD_RAMO = :cdRamo";

    private static final String Q_COUNT_SINIESTROS_GEN_REGISTER = "SELECT COUNT(*) " + Q_SEARCH_SINIESTROS_GEN_FROM;
    private static final String Q_SEARCH_SINIESTROS_GEN_REGISTER = "SELECT s.CD_COMPANIA, s.CD_RECLAMO, CONCAT(s.NUM_SINIESTRO, CONCAT('.', i.ITEM)) as NUM_SINIESTRO, CONCAT(CONCAT(cl.NM_CLIENTE, ' '), cl.AP_CLIENTE) as contratante, o.DSC_OBJETO as asegurado, os.DSC_OBJETO as paciente, s.FC_CREACION, i.TP_SINIESTRO as tp_reclamo, i.FC_ALCANCE as fc_incurrencia, i.FC_PRIMERA_FACTURA , i.VALOR_RECLAMO_PORTAL, i.ESTADO_PORTAL, i.OBSERVACIONES_ESTADOS as OBS_SINIESTRO, s.POLIZA, ic.NM_INCAPACIDAD, r.NM_RAMO, rc.CD_EJECUTIVO_SINIESTRO as CD_EJECUTIVO, i.ITEM, i.cd_inc_siniestro, i.caducado " + Q_SEARCH_SINIESTROS_GEN_FROM;


    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }

    public List<CobDedSiniestro> getCobDedSiniestro(Integer cdCompania, Integer cdReclamo, boolean vam) {
        String query = Q_COBERTURA + (vam ? "AND d.CD_INC_SINIESTRO = ?" : "AND d.CD_RECLAMO = ?") + " ORDER BY d.NM_COBERTURA";
        return this.jdbcTemplate.query(query, new Object[]{cdCompania, cdReclamo}, new BeanPropertyRowMapper<>(CobDedSiniestro.class));
    }

    public List<Inspeccion> getGestion(Integer cdCompania, Integer cdReclamo) {
        return this.jdbcTemplate.query(Q_GESTION, new Object[]{cdCompania, cdReclamo}, new BeanPropertyRowMapper<>(Inspeccion.class));
    }

    /**
     * devuelve lista de documentos no aplica para VAM
     * documentos de generales
     *
     * @param cdCompania compania
     * @param cdReclamo  recalmo
     * @return lista de documentos
     */
    public List<DocSiniestro> getDocs(Integer cdCompania, Integer cdReclamo) {
        String query = Q_DOCS + "AND d.CD_RECLAMO = ? ORDER BY NM_DOCUMENTO";
        return this.jdbcTemplate.query(query, new Object[]{cdCompania, cdReclamo}, new BeanPropertyRowMapper<>(DocSiniestro.class));
    }

    /**
     * @param cdCompania compania
     * @param cdReclamo  cdReclamo o cdIncSiniestro
     * @param vam        si es vam
     * @param tipo       1 fact vam, 2: vam documentos, 3: fact generales
     * @return lista de GastosVam
     */
    public List<GastosVam> getFacturas(Integer cdCompania, Integer cdReclamo, boolean vam, int tipo) {
        String query;
        if (tipo == 1) {
            query = Q_FACTURAS_VAM;
        } else
            query = Q_FACTURAS + (vam ? "AND g.CD_INC_SINIESTRO = ?" : "AND g.CD_RECLAMO = ?") + " ORDER BY g.FC_GASTO, g.DETALLE";
        return this.jdbcTemplate.query(query, new Object[]{tipo, cdCompania, cdReclamo}, new BeanPropertyRowMapper<>(GastosVam.class));
    }

    public List<PagoSiniestro> getLiquidacion(Integer cdCompania, Integer cdReclamo, boolean vam) {
        String query = Q_LIQUIDACION + (vam ? "AND P.CD_INC_SINIESTRO = ?" : "AND P.CD_RECLAMO = ?") + " ORDER BY P.FC_PAGO_SOL,B.DSC_RUBRO";
        return this.jdbcTemplate.query(query, new Object[]{cdCompania, cdReclamo}, new BeanPropertyRowMapper<>(PagoSiniestro.class));
    }

    public List<ResumenGastosLiquidacion> getGastosLiquidacion(Integer cdCompania, Integer cdReclamo) {
        return this.jdbcTemplate.query(Q_GASTOS_LIQUIDACION, new Object[]{cdCompania, cdReclamo}, new BeanPropertyRowMapper<>(ResumenGastosLiquidacion.class));
    }

    public List<CredHospital> getCredHosp(Integer cdCompania, Integer cdIncSiniestro) {
        return this.jdbcTemplate.query(Q_CRED_HOSP, new Object[]{cdCompania, cdIncSiniestro}, new BeanPropertyRowMapper<>(CredHospital.class));
    }

    public Page<IncapSiniestro> searchSiniestrosVam(Map<String, Object> params, String order, Pageable pageable) {


        Integer count = this.namedParameterJdbcTemplate.queryForObject(Q_SEARCH_INCAP_SIN_VAM_COUNT, params, Integer.class);

        long offset = pageable.getOffset();// rownmum oracle is 1-based
        params.put("MAX_ROW_TO_FETCH", offset + pageable.getPageSize());
        params.put("MIN_ROW_TO_FETCH", offset + 1);

        List<IncapSiniestro> list = this.namedParameterJdbcTemplate.query(getQueryPaginate(Q_SEARCH_INCAP_SIN_VAM_DATA + order), params, new BeanPropertyRowMapper<>(IncapSiniestro.class));

        return new PageImpl<>(list, pageable, count == null ? 0 : count);
    }

    private String getQueryPaginate(String qSearchIncapSinVam) {
        String PAG_0 = "SELECT * FROM (SELECT j.*, rownum rnum FROM (";
        String PAG_1 = ") j WHERE rownum <= :MAX_ROW_TO_FETCH ) WHERE rnum >= :MIN_ROW_TO_FETCH";
        return PAG_0 + qSearchIncapSinVam + PAG_1;
    }

    /* public String findDeducible(Integer cdCompania, Integer cdAsegurado) {
         var r = this.namedParameterJdbcTemplate.getJdbcTemplate().queryForRowSet("select F_BUSCA_DED_SINIES_VAM(?,?) as x from dual", cdCompania, cdAsegurado);
         r.next();
         return r.getString(1);
     }*/
    public HashMap<String, String> findDeducible(Integer cdCompania, Integer cdAsegurado) {

        var res = new HashMap<String, String>();
        try {
            var r = this.namedParameterJdbcTemplate.getJdbcTemplate().queryForRowSet("select F_BUSCA_DED_SINIES_VAM(?,?) as x from dual", cdCompania, cdAsegurado);
            r.next();
            var ded = r.getString(1).split("\\|");
            var total = Double.parseDouble(ded[1].replace(",", "."));
            var saldo = Double.parseDouble(ded[0].replace(",", "."));
            if (total == 0 && saldo == 0) {
                total = -2;
            }
            var consumido = total - saldo;
            res.put("total", total + "");
            res.put("saldo", saldo + "");
            res.put("consumido", consumido + "");
            res.put("desc", ded[2].toLowerCase().replace("deducible", ""));
        } catch (Exception ex) {
            //log.error("error en calcular deducible", ex);
            res.put("total", "-1");
            res.put("saldo", "0");
            res.put("consumido", "1");
            res.put("desc", "año póliza");
        }
        return res;
    }

    public List<Map<String, Object>> polizasActivasAsistenciaMed(String cedula, boolean caducadas) {
        String query = "select a.CD_COTIZACION, a.CD_COMPANIA, a.NM_ASEGURADORA, a.POLIZA, a.NM_CLIENTE || ' ' ||a.AP_CLIENTE as CLIENTE, g.RUC_CED, o.CEDULA_O, o.DSC_OBJETO, v.CORREO, v.CELULAR, p.DSC_PLAN " +
                "FROM BROKER.BRK_T_V_POLIZAS a, " +
                "     BRK_T_ESTADOS_COTIZACION b, " +
                "     BRK_T_UBICACION u," +
                "     BRK_T_OBJ_COTIZACION o, " +
                "     BRK_T_CLI_GRUPO C, " +
                "     brk_t_clientes g, " +
                "     brk_t_asegurados_vam v, " +
                "     brk_t_planes p " +
                "WHERE a.cd_compania = b.cd_compania\n" +
                "  AND a.cd_ramo_cotizacion = b.cd_ramo_cotizacion " +
                (caducadas ? "  AND (trunc(a.FC_HASTA) >= CURRENT_DATE - 30) " :
                        "  AND (trunc(a.FC_HASTA) >= CURRENT_DATE) ") +
                "  AND (a.NM_RAMO like '%MEDICA%' OR a.NM_RAMO like '%VIDA%') " +
                "  AND a.FACT_ASEG IS NOT NULL " +
                "  AND b.activo = 1 " +
                "  AND u.cd_ramo_cotizacion = b.cd_ramo_cotizacion\n" +
                "  AND u.CD_COMPANIA = b.CD_COMPANIA " +
                "  AND o.CD_COMPANIA = u.CD_COMPANIA " +
                "  AND o.CD_UBICACION = u.CD_UBICACION " +
                "  AND c.CD_CLI_GRUPO = A.CD_CLI_GRUPO " +
                "  AND g.CD_CLIENTE = A.CD_CLIENTE " +
                "  AND v.CEDULA = o.CEDULA_O " +
                "  AND p.CD_PLAN = u.CD_PLAN " +
                "  AND o.CEDULA_O = :cedula " +
                "ORDER BY a.FC_DESDE DESC";

        Map<String, Object> params = new HashMap<>();
        params.put("cedula", cedula);

        var polizas = this.namedParameterJdbcTemplate.queryForList(query, params);
        for (Map<String, Object> p : polizas) {
            String query2 = "SELECT CD_COMPANIA, CEDULA, CD_COTIZACION, CD_ASEGURADO, NOMBRES, TIPO, FC_NACIMIENTO FROM BRK_V_TIT_DEP_AM a " +
                    "WHERE a.cedula = :cedula and a.cd_compania = :comp and a.cd_cotizacion = :coti";

            params.put("comp", p.get("CD_COMPANIA"));
            params.put("coti", p.get("CD_COTIZACION"));

            var deps = this.namedParameterJdbcTemplate.queryForList(query2, params);

            deps.forEach(d -> {
                var cdCompania = ((BigDecimal) d.get("CD_COMPANIA")).intValue();
                var cdAsegurado = ((BigDecimal) d.get("CD_ASEGURADO")).intValue();
                d.put("deducible", findDeducible(cdCompania, cdAsegurado));
            });
            p.put("items", deps);
        }

        return polizas;

    }

    public List<Map<String, Object>> aseguradosPoliza(Integer cdCotizacion, Integer cdCompania, String cedula) {

        String query2 = "SELECT CD_COMPANIA, CEDULA, CD_COTIZACION, CD_ASEGURADO, NOMBRES, TIPO, FC_NACIMIENTO FROM BRK_V_TIT_DEP_AM a " +
                "WHERE a.cedula = :cedula and a.cd_compania = :comp and a.cd_cotizacion = :coti";

        Map<String, Object> params = new HashMap<>();
        params.put("comp", cdCompania);
        params.put("coti", cdCotizacion);
        params.put("cedula", cedula);

        return this.namedParameterJdbcTemplate.queryForList(query2, params);
    }

    public List<Map<String, Object>> getAsegurado(String cedula) {

        String query2 = "SELECT a.CORREO, a.CELULAR FROM brk_t_asegurados_vam a " +
                "WHERE a.cedula = :cedula";

        Map<String, Object> params = new HashMap<>();
        params.put("cedula", cedula);

        return this.namedParameterJdbcTemplate.queryForList(query2, params);
    }

    public IncapSiniestro nmCliente(Integer cdCliente) {
        String query = "select NM_CLIENTE || ' '|| NVL(AP_CLIENTE,'') AS titular from BRK_T_CLIENTES WHERE CD_CLIENTE= :cdCliente";

        Map<String, Object> params = new HashMap<>();
        params.put("cdCliente", cdCliente);

        List<IncapSiniestro> list = this.namedParameterJdbcTemplate.query(query, params, new BeanPropertyRowMapper<>(IncapSiniestro.class));

        return list.get(0);
    }

    public List<Map<String, Object>> getData(Integer cdRamoCotizacion, Integer cdUbicacion, Integer cdRamo) {
        Map<String, Object> params = new HashMap<>();
        params.put("cdRamoCotizacion", cdRamoCotizacion);
        params.put("cdUbicacion", cdUbicacion);
        params.put("cdRamo", cdRamo);
        return this.namedParameterJdbcTemplate.queryForList(Q_SEARCH_RAMO_COTIZACION, params);
    }

    public List<Map<String, Object>> getAseguradoraPoliza(Integer cdCliente, boolean caducadas) {
        String query = "select  a.CD_COTIZACION, a.CD_COMPANIA, a.CD_ASEGURADORA ,a.NM_ASEGURADORA, a.ASEGURADORA, a.POLIZA, a.NM_CLIENTE || ' ' ||a.AP_CLIENTE as CLIENTE, a.NM_CLIENTE, a.AP_CLIENTE, a.CD_CLIENTE, a.CD_COMPANIA, g.RUC_CED, p.DSC_PLAN, u.CD_UBICACION, u.DSC_UBICACION, r.NM_RAMO, rc.CD_RAMO ,rc.CD_RAMO_COTIZACION  " +
                "FROM BROKER.BRK_T_V_POLIZAS a, " +
                "     BRK_T_ESTADOS_COTIZACION b, " +
                "     BRK_T_UBICACION u, " +
                "     BRK_T_RAMOS_COTIZACION rc, " +
                "     BRK_T_CLI_GRUPO C, " +
                "     brk_t_clientes g, " +
                "     brk_t_planes p, " +
                "     BRK_T_RAMOS r " +
                "WHERE a.cd_compania = b.cd_compania " +
                "  AND rc.cd_ramo = r.cd_ramo " +
                "  AND a.cd_ramo_cotizacion = b.cd_ramo_cotizacion " +
                "  AND a.cd_ramo_cotizacion = rc.cd_ramo_cotizacion" +
                "  AND a.cd_compania = rc.cd_compania" +
                (caducadas ? "  AND (trunc(a.FC_HASTA) >= CURRENT_DATE - :dias) " :
                        "  AND (trunc(a.FC_HASTA) >= CURRENT_DATE) ") +
                "  AND (a.NM_RAMO like '%MEDICA%' OR a.NM_RAMO like '%VIDA%') " +
                "  AND a.FACT_ASEG IS NOT NULL " +
                "  AND b.activo = 1 " +
                "  AND u.cd_ramo_cotizacion = b.cd_ramo_cotizacion " +
                "  AND u.CD_COMPANIA = b.CD_COMPANIA" +
                "  AND c.CD_CLI_GRUPO = A.CD_CLI_GRUPO " +
                "  AND g.CD_CLIENTE = A.CD_CLIENTE " +
                "  AND p.CD_PLAN = u.CD_PLAN " +
                "  AND a.CD_CLIENTE = :cdCliente " +
                "  ORDER BY a.FC_DESDE DESC ";

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("cdCliente", cdCliente);

        return this.namedParameterJdbcTemplate.queryForList(query, parameters);
    }


    public Page<ResultIncapSiniestroPortal> getSiniestrosGenRegistered(Map<String, Object> parameters, String sorted, String order, Pageable pageable) {
        long offset = pageable.getOffset();
        Integer countRegister = this.namedParameterJdbcTemplate.queryForObject(Q_COUNT_SINIESTROS_GEN_REGISTER, parameters, Integer.class);
        countRegister = countRegister == null ? 0 : countRegister;
        parameters.put("MAX_ROW_TO_FETCH", offset + pageable.getPageSize());
        parameters.put("MIN_ROW_TO_FETCH", offset + 1);
        List<ResultIncapSiniestroPortal> listSiniestros = this.namedParameterJdbcTemplate.query(getQueryPaginate(Q_SEARCH_SINIESTROS_GEN_REGISTER + " order by " + sorted + " " + order), parameters, new BeanPropertyRowMapper<>(ResultIncapSiniestroPortal.class));
        return new PageImpl<>(listSiniestros, pageable, countRegister);
    }

}
