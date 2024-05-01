package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.dto.RecetaMedicinaContinuaDTO;
import com.tefisoft.efiweb.enums.EstadoSiniestroEnum;
import com.tefisoft.efiweb.util.Ctns;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

@Repository
public class DetalleDocumentoSiniestroJDBC {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DetalleDocumentoSiniestroJDBC(DataSource dataSource) {
        this.jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }

    private static final String Q_DOCS_RECETA_MEDICINA_CONTINUA = "select TPD.NM_DOCUMENTO, DS.CD_ASEGURADORA, DBD.FC_CADUC_DOCUMENTO, DD.CD_RECLAMO, DD.CD_COMPANIA, DD.CD_INC_SINIESTRO\n" +
            "from BRK_T_DOCUMENTO_DIGITAL DD,\n" +
            "     BRK_T_DET_BENEF_DOC_SS DBD,\n" +
            "     BRK_T_DOC_SINIESTRO_SS DS,\n" +
            "     BRK_T_SUB_DOC_SINIESTRO_SS SDS,\n" +
            "     BRK_T_TP_DOC_SINIESTRO TPD,\n" +
            " BRK_T_INCAP_SINIESTRO_SS ISP \n" +
            "where DBD.CD_SDOC_SINIESTRO = SDS.CD_SDOC_SINIESTRO\n" +
            "  AND DBD.CD_DOC_SINIESTRO = DS.CD_DOC_SINIESTRO\n" +
            "  AND DD.CD_ARCHIVO = DBD.CD_ARCHIVO\n" +
            "  AND SDS.CD_TP_DOC_SINIESTRO = TPD.CD_TP_DOC_SINIESTRO\n" +
            " AND UPPER(DD.TIPO) LIKE 'RECETA'" +
            "  AND UPPER(DD.ESTADO) LIKE '" + Ctns.INGRESADO + "' " +
            "  AND DD.CD_RECLAMO IS NOT NULL\n" +
            "  AND DD.CD_COMPANIA IS NOT NULL\n" +
            "  AND DBD.FC_CADUC_DOCUMENTO IS NOT NULL\n " +
            "  AND ISP.CD_INC_SINIESTRO = DD.CD_INC_SINIESTRO\n " +
            "  AND UPPER(ISP.ESTADO_PORTAL) LIKE '" + EstadoSiniestroEnum.INGRESADO.name() + "' ";

    public List<RecetaMedicinaContinuaDTO> getRecetaMedicinaContinuaList() {
        return jdbcTemplate.query(Q_DOCS_RECETA_MEDICINA_CONTINUA, Map.of(), new BeanPropertyRowMapper<>(RecetaMedicinaContinuaDTO.class));
    }

}
