package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.dto.IncapSiniestroPortalDTO;
import com.tefisoft.efiweb.enums.EstadoSiniestroEnum;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public class IncapSiniestroPortalJDBC {
    private final NamedParameterJdbcTemplate jdbcTemplate;

    public IncapSiniestroPortalJDBC(DataSource dataSource) {
        this.jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }


    private static final String FC_PRIMERA_FACTURA = "fcPrimeraFactura";
    private static final String CDS_INCAP_SINIESTROS = "cdsIncapSiniestros";
    private static final String Q_INCAP_FC_PRIMERA_FACTURA_GREATER_EQUAL = "select OSP.CD_RECLAMO, ISP.CD_COMPANIA, ISP.CD_INC_SINIESTRO,ISP.FC_PRIMERA_FACTURA,ISP.CADUCADO\n" +
            "from BRK_T_INCAP_SINIESTRO_SS ISP,\n" +
            "     BRK_T_OBJ_SINIESTRO_SS OSP\n" +
            "where ISP.CD_OBJ_SINIESTRO = OSP.CD_OBJ_SINIESTRO\n" +
            " AND ISP.FC_PRIMERA_FACTURA IS NOT NULL\n" +
            " AND ISP.CADUCADO = 0\n" +
            " AND UPPER(ISP.ESTADO_PORTAL) LIKE '" + EstadoSiniestroEnum.POR_REGULARIZAR.name() + "' " +
            " AND ISP.FC_PRIMERA_FACTURA >= TO_DATE(:" + FC_PRIMERA_FACTURA + ", 'YYYY-MM-DD')";

    private static final String U_CADUCADO_IN_CDS_INCAP_SINIESTRO = "UPDATE BRK_T_INCAP_SINIESTRO_SS\n" +
            "SET CADUCADO = 1\n" +
            "WHERE CD_INC_SINIESTRO IN (:" + CDS_INCAP_SINIESTROS + ")";


    public List<IncapSiniestroPortalDTO> getIncapSiniestroFcPrimeraFacturaGreaterEquals(LocalDate fcprimerafactura) {
        var params = Map.of(FC_PRIMERA_FACTURA, fcprimerafactura.toString());
        return jdbcTemplate.query(Q_INCAP_FC_PRIMERA_FACTURA_GREATER_EQUAL, params, new BeanPropertyRowMapper<>(IncapSiniestroPortalDTO.class));
    }

    public void updateCaducadoByCdsIncapSiniestros(List<Integer> cdsIncapSiniestros) {
        if (cdsIncapSiniestros.isEmpty()) return;
        var params = Map.of(CDS_INCAP_SINIESTROS, cdsIncapSiniestros);
        jdbcTemplate.update(U_CADUCADO_IN_CDS_INCAP_SINIESTRO, params);
    }

    @Transactional
    public boolean updateLiquidado(int cdSiniestro) {
        if (cdSiniestro <= 0) return false;
        var params = Map.of("cdSiniestro", cdSiniestro);
        var query = "UPDATE BRK_T_INCAP_SINIESTRO_SS set LIQUIDADO2 =1 where CD_INC_SINIESTRO=:cdSiniestro";
        jdbcTemplate.update(query, params);
        return !jdbcTemplate.queryForList("select 1 from BRK_T_INCAP_SINIESTRO_SS where CD_INC_SINIESTRO=:cdSiniestro", params).isEmpty();
    }
}
