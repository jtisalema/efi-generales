package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.dto.GestorUsuario;
import com.tefisoft.efiweb.entidad.Clausula;
import com.tefisoft.efiweb.entidad.Cobertura;
import com.tefisoft.efiweb.entidad.Deducible;
import com.tefisoft.efiweb.entidad.DetalleFinanciamiento;
import com.tefisoft.efiweb.entidad.ExclusionCobertura;
import com.tefisoft.efiweb.entidad.ExclusionesNegocio;
import com.tefisoft.efiweb.entidad.Financiamiento;
import com.tefisoft.efiweb.entidad.FormaPago;
import com.tefisoft.efiweb.entidad.FormaPrima;
import com.tefisoft.efiweb.entidad.GarantiasNegocio;
import com.tefisoft.efiweb.entidad.Subobjetos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * @author dacopanCM on 08/08/17.
 */
@Repository
public class PolizaJdbcDAO implements Serializable {

    private JdbcTemplate jdbcTemplate;
    private static final String Q_COBERTURA = "SELECT c.CD_COB_NEGOCIO,c.ORD_IMPRESION,b.NM_COBERTURA,c.VAL_LIMITE,c.TASA,c.FACTOR,c.VAL_PRIMA,c.ADICIONAL_RAMO ,r.DSC_RUBRO,c.OBS_COB_NEGOCIO FROM brk_t_coberturas_negocio c INNER JOIN BRK_T_COBERTURAS b ON c.CD_COBERTURA = b.CD_COBERTURA LEFT JOIN BRK_T_RUBROS r ON c.CD_RUBRO = r.CD_RUBRO AND c.CD_COMPANIA = r.CD_COMPANIA WHERE nvl(c.estado, '0') <> 'X' AND c.CD_COMPANIA = ? ";
    private static final String Q_COBERTURA_GNC = Q_COBERTURA + "AND c.cd_ramo_cotizacion = ?";
    private static final String Q_COBERTURA_UBC = Q_COBERTURA + "AND c.cd_ubicacion = ?";

    private static final String Q_CLAUSULAS = "SELECT cn.CD_CLAUSULA_NEGOCIO, cn.CD_OBJ_COTIZACION, cn.CD_SUBOBJETO, cn.CD_CLAUSULA, cn.CD_RAMO_COTIZACION, cn.CD_UBICACION, cn.CD_COMPANIA, cn.AFECTA_VA, cn.AFECTA_PRIMA, cn.TASA, cn.FACTOR, cn.VAL_PRIMA, cn.ADICIONAL_RAMO, cn.ACTIVO, cn.VAL_LIMITE, cn.OBS_CLAUSULAS_NEGOCIO, cn.ORD_IMPRESION, cl.NM_CLAUSULA, cn.UNIDADES FROM BRK_T_CLAUSULAS_NEGOCIO cn, BRK_T_CLAUSULAS cl WHERE (cl.CD_CLAUSULA = cn.CD_CLAUSULA) AND cn.CD_COMPANIA=? ";
    private static final String Q_CLAUSULAS_GNC = Q_CLAUSULAS + "AND cn.CD_RAMO_COTIZACION = ? ORDER BY cn.CD_CLAUSULA_NEGOCIO ASC";
    private static final String Q_CLAUSULAS_UBC = Q_CLAUSULAS + "AND cn.cd_ubicacion = ? ORDER BY cn.CD_CLAUSULA_NEGOCIO ASC";

    private static final String Q_DEDUCIBLES = "SELECT d.CD_DEDUCIBLE, d.CD_COB_NEGOCIO, d.CD_COMPANIA, d.PCT_V_ASEG, d.PCT_RECLAMO, d.VAL_MINIMO, d.OBS_DEDUCIBLE, d.CD_OBJ_COTIZACION, d.CD_RAMO_COTIZACION, d.CD_UBICACION, d.VAL_FIJO, d.ACTIVO FROM BRK_T_DEDUCIBLES d WHERE d.CD_COMPANIA =? ";
    private static final String Q_DEDUCIBLES_COB = Q_DEDUCIBLES + "AND d.CD_COB_NEGOCIO=?";
    private static final String Q_DEDUCIBLES_OTR = Q_DEDUCIBLES + "AND d.CD_RAMO_COTIZACION=?";
    private static final String Q_DEDUCIBLES_UBC = "SELECT d.CD_DEDUCIBLE, d.CD_COMPANIA, d.OBS_DEDUCIBLE, d.CD_COBERTURA, d.VAL_FIJO, c.NM_COBERTURA FROM brk_t_deducibles d INNER JOIN BRK_T_COBERTURAS c ON  d.CD_COBERTURA = c.CD_COBERTURA WHERE d.CD_COMPANIA = ? AND d.CD_UBICACION = ? ORDER BY c.NM_COBERTURA";
    private static final String Q_GARANTIAS_NEGOCIO = "SELECT gn.CD_GARANTIA_NEGOCIO, gn.CD_RAMO_COTIZACION, gn.CD_COMPANIA, gn.CD_GARANTIA, gn.OBS_GARANTIA_NEGOCIO, gn.ACTIVO, gn.FC_MAX_CONDICIONADA, gn.FC_EFEC_CUMPLIMIENTO, g.NM_GARANTIA FROM BRK_T_GARANTIAS_NEGOCIO gn INNER JOIN BRK_T_GARANTIAS g ON g.CD_GARANTIA = gn.CD_GARANTIA WHERE g.CD_COMPANIA = gn.CD_COMPANIA AND CD_RAMO_COTIZACION = ?";
    private static final String Q_FORMA_PAGO = "SELECT fp.CD_FORMA_PAGO, fp.CD_COTIZACION, fp.CD_COMPANIA, fp.NUM_ALTERNATIVA, fp.FRM_PAGO, fp.NUM_PAGOS, fp.TOT_PRIMA, fp.VAL_FINANCIAMIENTO, fp.TOTAL_PAGO, fp.PCT_CUOTA_INICIAL, fp.PERIODICIDAD, fp.ACEPTADA, fp.IVA, fp.SUPER_BANCOS, fp.RESPONSABLE, fp.ORD_EMISION, fp.CD_RUBRO, fp.VAL_RUBRO, fp.CD_PLAN_RAM_COT, fp.OBSERVACIONES, fp.SEGURO_C, fp.CI_IMPUESTO, fp.CUOTA_LETRA, fp.TP_PAGO_TARJETA, fp.COM_FACTURA, fp.SUBTOTAL, fp.DERE_EMISION, fp.VAL_OTRO_IVA, fp.SIN_IVA, fp.FRM_PAGO_AUX, fp.FRM_CAL_BRK, fp.FRM_CAL_AGE,r.DSC_RUBRO FROM BRK_T_FORMA_PAGO fp LEFT JOIN BRK_T_RUBROS r ON r.CD_RUBRO = fp.CD_RUBRO AND r.CD_COMPANIA=fp.CD_COMPANIA WHERE ACEPTADA = 'X' AND fp.cd_compania = ? AND fp.cd_cotizacion = ?";
    private static final String Q_FORMA_PAGO_VAM = "SELECT fp.CD_FORMA_PAGO, fp.FRM_PAGO, fp.FRM_PAGO_AUX, fp.TOT_PRIMA, fp.VAL_FINANCIAMIENTO, fp.DERE_EMISION, fp.SUPER_BANCOS, fp.SEGURO_C, fp.VAL_RUBRO,fp.IVA, fp.TOTAL_PAGO FROM BRK_T_FORMA_PAGO fp WHERE fp.aceptada = 'X' AND fp.CD_COMPANIA = ? AND fp.CD_COTIZACION = ?";
    private static final String Q_FINANCIAMIENTO = "SELECT fin.CD_FINANCIAMIENTO, fin.CD_FORMA_PAGO, fin.ORDINAL, fin.NUM_ASEGURADORA, fin.FRM_FINANCIAMIENTO, fin.VALOR, fin.SALDO_PAGO as SALDO, fin.CD_COMPANIA, fin.NUM_DOCUMENTO, fin.FC_VENCIMIENTO, fin.SALDO_PAGO, fin.OBSERVACIONES, fin.FACT_ASEG, fin.LETRAS,fin.FC_INGRESO_FACTURA,fin.FLG_PAGO,fin.FC_DESDE,fin.FC_HASTA,fin.FC_RECEPCION_FACTURA,fin.DETALLES FROM BRK_T_FINANCIAMIENTO fin WHERE fin.cd_compania = ? AND fin.cd_forma_pago = ? ORDER BY fin.ORDINAL";
    private static final String Q_DET_FINAN = "SELECT fd.FACT_ASEG, fd.CD_COMPANIA, fd.OBS_DOC_FINANCIAMIENTO, fd.VALOR, fd.FC_VENCIMIENTO, fd.PAGO_FACT FROM BRK_T_DETALLE_FINANCIAMIENTO fd WHERE fd.cd_compania = ? AND fd.CD_FINANCIAMIENTO =? ORDER BY fd.FC_VENCIMIENTO";

    private static final String Q_FORMA_PRIMA = "SELECT f.CD_FORMA_PRIMA, b.DSC_RUBRO, f.VAL_FORMA_PRIMA, f.PERIODO, f.VAL_TARJETA FROM BRK_T_FORMA_PRIMA f LEFT JOIN BRK_T_RUBROS b ON  f.CD_RUBRO = b.CD_RUBRO WHERE f.CD_COMPANIA = ? AND f.CD_UBICACION = ?";
    private static final String Q_EXCLUSION = "SELECT e.CD_EXC_NEGOCIO, e.ORD_IMPRESION, e.DSC_EXCLUSION, e.OBS_EXC_NEGOCIO, e.ACEPTADA FROM BRK_T_EXCLUSIONES_NEGOCIO e WHERE e.CD_COMPANIA = ? AND e.CD_UBICACION = ? ORDER BY e.ORD_IMPRESION";
    private static final String Q_SUBOBJ_OBJ = "SELECT s.CD_SUBOBJETO, s.DSC_SUBOBJETO, s.FC_NACIMIENTO, s.OBS_SUBOBJETO,s.BENEFICIO, s.ACTIVO, s.CEDULA_S, s.TOT_ASE_ACTUAL, s.TOT_PRI_ACTUAL, s.TASA, s.CD_COMPANIA, s.CD_DEP_BEN as CD_ASEGURADO FROM BRK_T_SUBOBJETOS s WHERE s.CD_COMPANIA = ? AND s.CD_OBJ_COTIZACION =? ORDER BY s.DSC_SUBOBJETO";
    private static final String Q_EXCLUSION_COBERTURA = "SELECT DISTINCT E.ORD_IMPRESION, E.DSC_EXCLUSION, E.OBS_EXC_NEGOCIO, E.ACTIVO, E.CD_EXC_NEGOCIO, E.CD_COMPANIA, E.CD_COB_NEGOCIO, E.CD_UBICACION, E.CD_RAMO_COTIZACION, E.CD_SUBOBJETO, E.CD_OBJ_COTIZACION FROM BRK_T_EXCLUSIONES_NEGOCIO E  WHERE E.CD_COB_NEGOCIO = ? AND (E.CD_COMPANIA = ?)";
    private static final String Q_EXCLUSION_RAMO = "SELECT DISTINCT E.ORD_IMPRESION, E.DSC_EXCLUSION, E.OBS_EXC_NEGOCIO, E.ACTIVO, E.CD_EXC_NEGOCIO, E.CD_COMPANIA, E.CD_COB_NEGOCIO, E.CD_UBICACION, E.CD_RAMO_COTIZACION, E.CD_SUBOBJETO, E.CD_OBJ_COTIZACION FROM BRK_T_EXCLUSIONES_NEGOCIO E  WHERE (E.CD_COMPANIA = ?) AND (E.CD_RAMO_COTIZACION = ?)";
    //Gestor Usuarios
    private static final String Q_SELECT_COUNT = "SELECT COUNT(*) ";
    private static final String Q_GESTOR_USUARIO_FROM = " FROM BRK_T_CLIENTES, " +
            "BRK_T_EJECUTIVOS, " +
            "BRK_T_TELEFONOS " +
            "WHERE ( BRK_T_CLIENTES.CD_CLIENTE = BRK_T_EJECUTIVOS.CD_CLIENTE ) and " +
            "( BRK_T_EJECUTIVOS.CD_COMPANIA = BRK_T_TELEFONOS.CD_COMPANIA ) and " +
            "( BRK_T_EJECUTIVOS.CD_EJECUTIVO = BRK_T_TELEFONOS.CD_CODIGO ) and " +
            "( ( NVL(BRK_T_EJECUTIVOS.ESTADO,'0') <> 'X' ) AND " +
            "( to_char(BRK_T_CLIENTES.CD_CLIENTE)  like ? ) AND " + //:as_cd_cliente
            "( BRK_T_EJECUTIVOS.NM_EJECUTIVO like ? ) AND " + //:as_nm_contacto
            "( BRK_T_EJECUTIVOS.AP_EJECUTIVO like ? ) AND " + //:as_ap_contacto
            "( BRK_T_CLIENTES.RUC_CED like ? ) AND " + //:as_cedula
            "( BRK_T_CLIENTES.NM_CLIENTE like ? ) AND " + //:as_nm_contratante
            "( BRK_T_CLIENTES.AP_CLIENTE like ? ) AND " +//:as_ap_contratante
            "( BRK_T_TELEFONOS.MAIL like ? ) ) "; //:as_correo

    private static final String Q_GESTOR_USUARIO_PAGED = "SELECT * FROM (SELECT ROWNUM RNUM, BRK_T_CLIENTES.CD_CLIENTE, " +
            "BRK_T_CLIENTES.RUC_CED, " +
            "BRK_T_CLIENTES.NM_CLIENTE, " +
            "BRK_T_CLIENTES.AP_CLIENTE, " +
            "BRK_T_EJECUTIVOS.CD_EJECUTIVO, " +
            "BRK_T_EJECUTIVOS.NM_EJECUTIVO, " +
            "BRK_T_EJECUTIVOS.AP_EJECUTIVO, " +
            "BRK_T_EJECUTIVOS.RUC_CED RUC_CED_E, " +
            "BRK_T_EJECUTIVOS.CARGO, " +
            "BRK_T_EJECUTIVOS.FC_NACIMIENTO, " +
            "BRK_T_EJECUTIVOS.USUARIOWEB, " +
            "BRK_T_EJECUTIVOS.TITULO, " +
            "BRK_T_TELEFONOS.MAIL, " +
            "BRK_T_TELEFONOS.USUARIO_WEB USUARIO_WEB_T, " +
            "BRK_T_TELEFONOS.VALIDO, " +
            "BRK_T_EJECUTIVOS.SELECCIONA, " +
            "BRK_T_EJECUTIVOS.DESACTIVA " +
            Q_GESTOR_USUARIO_FROM +
            "AND ROWNUM <= ?) " + //:as_pageSize
            "WHERE RNUM >= ?"; //:as_page

    public static final String Q_COMUNICADOS = "select tr.CD_TAB_RUBRO, " +
            "       tr.CD_COMPANIA, " +
            "       r.DSC_RUBRO " +
            "FROM BRK_T_RUBROS r, " +
            "     BRK_T_TABLAS t, " +
            "     BRK_T_TABLAS_RUBRO tr " +
            "WHERE (tr.CD_TABLA = t.CD_TABLA) " +
            "  and (tr.CD_COMPANIA = t.CD_COMPANIA) " +
            "  and (tr.CD_RUBRO = r.CD_RUBRO) " +
            "  and (tr.CD_RUBRO = r.CD_RUBRO) " +
            "  and (tr.CD_COMPANIA = :cdCompania) " +
            "  and ((t.NM_TABLA like '%BRK_T_AVISOSINIESTRO%'))";

    public static final String QR_MAIL_CELULAR = "select CELULAR, CORREO from brk_t_asegurados_vam where CEDULA = (select o.CEDULA_O " +
            "from brk_t_obj_cotizacion o, " +
            "     BRK_T_SINIESTRO_SS s " +
            "where s.cd_compania = o.cd_compania (+) " +
            "  AND s.cd_asegurado_tit = o.cd_asegurado (+) " +
            "  and s.CD_RECLAMO = :cdReclamo and o.CD_COMPANIA = :cdCompania)";

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    // coberturas
    public List<Cobertura> getCoberturasByRamoCot(Integer cdCompania, Integer cdRamoCotizacion) {
        return this.jdbcTemplate.query(Q_COBERTURA_GNC, new Object[]{cdCompania, cdRamoCotizacion}, new BeanPropertyRowMapper<>(Cobertura.class));
    }

    public List<Cobertura> getCoberturasByUbicacion(Integer cdCompania, Integer cdUbicacion) {
        return this.jdbcTemplate.query(Q_COBERTURA_UBC, new Object[]{cdCompania, cdUbicacion}, new BeanPropertyRowMapper<>(Cobertura.class));
    }

    //clausulas
    public List<Clausula> getClausulasByRamoCot(Integer cdCompania, Integer cdRamoCotizacion) {
        return this.jdbcTemplate.query(Q_CLAUSULAS_GNC, new Object[]{cdCompania, cdRamoCotizacion}, new BeanPropertyRowMapper<>(Clausula.class));
    }

    public List<Clausula> getClausulasByUbicacion(Integer cdCompania, Integer cdUbicacion) {
        return this.jdbcTemplate.query(Q_CLAUSULAS_UBC, new Object[]{cdCompania, cdUbicacion}, new BeanPropertyRowMapper<>(Clausula.class));
    }

    //deducibles
    public List<Deducible> getOtrosDeduciblesByRamCot(Integer cdCompania, Integer cdRamoCotizacion) {
        return this.jdbcTemplate.query(Q_DEDUCIBLES_OTR, new Object[]{cdCompania, cdRamoCotizacion}, new BeanPropertyRowMapper<>(Deducible.class));
    }

    public List<Deducible> getDeduciblesByCobertura(Integer cdCompania, Integer cdCoberturaDeducible) {
        return this.jdbcTemplate.query(Q_DEDUCIBLES_COB, new Object[]{cdCompania, cdCoberturaDeducible}, new BeanPropertyRowMapper<>(Deducible.class));
    }

    public List<Deducible> getDeduciblesByUbicacion(Integer cdCompania, Integer cdUbicacion) {
        return this.jdbcTemplate.query(Q_DEDUCIBLES_UBC, new Object[]{cdCompania, cdUbicacion}, new BeanPropertyRowMapper<>(Deducible.class));
    }

    public List<GarantiasNegocio> getGarantiasByRamoCot(Integer cdRamoCotizacion) {
        return this.jdbcTemplate.query(Q_GARANTIAS_NEGOCIO, new Object[]{cdRamoCotizacion}, new BeanPropertyRowMapper<>(GarantiasNegocio.class));
    }

    public FormaPago getFormaPagoByCotizacion(Integer cdCompania, Integer cdCotizacion) {
        return this.jdbcTemplate.queryForObject(Q_FORMA_PAGO, new Object[]{cdCompania, cdCotizacion}, new BeanPropertyRowMapper<>(FormaPago.class));
    }

    public FormaPago getFormaPagoByCotizacionVAM(Integer cdCompania, Integer cdCotizacion) {
        return this.jdbcTemplate.queryForObject(Q_FORMA_PAGO_VAM, new Object[]{cdCompania, cdCotizacion}, new BeanPropertyRowMapper<>(FormaPago.class));
    }

    public List<Financiamiento> getFinanciamientosByFp(Integer cdCompania, Integer cdFormaPago) {
        return this.jdbcTemplate.query(Q_FINANCIAMIENTO, new Object[]{cdCompania, cdFormaPago}, new BeanPropertyRowMapper<>(Financiamiento.class));
    }

    public List<DetalleFinanciamiento> getDetalleFinanciamiento(Integer cdCompania, Integer cdFinanciamiento) {
        return this.jdbcTemplate.query(Q_DET_FINAN, new Object[]{cdCompania, cdFinanciamiento}, new BeanPropertyRowMapper<>(DetalleFinanciamiento.class));
    }

    public List<FormaPrima> getFormaPrimaByUbc(Integer cdCompania, Integer cdUbicacion) {
        return this.jdbcTemplate.query(Q_FORMA_PRIMA, new Object[]{cdCompania, cdUbicacion}, new BeanPropertyRowMapper<>(FormaPrima.class));
    }

    public List<ExclusionesNegocio> getExclusionByUbc(Integer cdCompania, Integer cdUbicacion) {
        return this.jdbcTemplate.query(Q_EXCLUSION, new Object[]{cdCompania, cdUbicacion}, new BeanPropertyRowMapper<>(ExclusionesNegocio.class));
    }

    public List<Subobjetos> getSubobjetosByObtCot(Integer cdCompania, Integer cdObjetoCotizacion) {
        return this.jdbcTemplate.query(Q_SUBOBJ_OBJ, new Object[]{cdCompania, cdObjetoCotizacion}, new BeanPropertyRowMapper<>(Subobjetos.class));
    }

    //Exlusiones
    public List<ExclusionCobertura> getExclusionCobertura(Integer cdCompania, Integer cdCodNegocio) {
        return this.jdbcTemplate.query(Q_EXCLUSION_COBERTURA, new Object[]{cdCompania, cdCodNegocio}, new BeanPropertyRowMapper<>(ExclusionCobertura.class));
    }

    public List<ExclusionCobertura> getExclusionRamo(Integer cdCompania, Integer cdRamoCotizacion) {
        return this.jdbcTemplate.query(Q_EXCLUSION_RAMO, new Object[]{cdCompania, cdRamoCotizacion}, new BeanPropertyRowMapper<>(ExclusionCobertura.class));
    }
    //Beneficiario

    //gestor usuarios web
    public Integer getGestorUsuariosCount(String cdCliente, String nmContacto, String apContacto, String cedula, String nmContratante, String apContratante, String correo) {
        return this.jdbcTemplate.queryForObject(Q_SELECT_COUNT + Q_GESTOR_USUARIO_FROM, new Object[]{cdCliente, nmContacto, apContacto, cedula, nmContratante, apContratante, correo}, Integer.class);
    }

    public List<GestorUsuario> getGestorUsuarios(String cdCliente, String nmContacto, String apContacto, String cedula, String nmContratante, String apContratante, String correo, Integer pageSize, Integer page) {
        return this.jdbcTemplate.query(Q_GESTOR_USUARIO_PAGED, new Object[]{cdCliente, nmContacto, apContacto, cedula, nmContratante, apContratante, correo, pageSize, page}, new BeanPropertyRowMapper<>(GestorUsuario.class));
    }

    public Map<String, Object> getCelularAndMail(Integer cdReclamo, Integer cdCompania) {
        return this.jdbcTemplate.queryForMap(QR_MAIL_CELULAR, cdReclamo, cdCompania);
    }
}
