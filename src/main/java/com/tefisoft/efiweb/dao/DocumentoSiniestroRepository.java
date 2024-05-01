package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.entidad.DocumentoSiniestro;
import com.tefisoft.efiweb.entidad.SubdocumentoSiniestro;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

@Repository
public class DocumentoSiniestroRepository {

    private NamedParameterJdbcTemplate jdbcTemplate;

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }

    private static final String Q_DOCUMENTOS_SS = "select t.NM_DOCUMENTO, c.NM_COBERTURA, d.*,\n" +
            " NVL((select AYUDA from BRK_T_AYUDA_DOC_SIN_SS where CD_DOC_SINIESTRO = d.CD_DOC_SINIESTRO and CD_SDOC_SINIESTRO is null and rownum = 1), NULL) as AYUDA\n" +
            " from BRK_T_DOC_SINIESTRO_SS d\n" +
            " left join BRK_T_TP_DOC_SINIESTRO t\n" +
            "   on d.CD_TP_DOC_SINIESTRO = t.CD_TP_DOC_SINIESTRO\n" +
            " left join BRK_T_COBERTURAS c\n" +
            "   on d.CD_COBERTURA = c.CD_COBERTURA\n" +
            "   and c.TIPO = 4\n" +
            "where d.CD_ASEGURADORA like :cdAseguradora\n" +
            "  and d.CD_RAMO like :cdRamo\n" +
            "  and d.TP_SINIESTROS like :tpReclamo";

    private static final String Q_SUBDOCUMENTOS_SS = "select t.NM_DOCUMENTO, s.*,\n" +
            " NVL((select AYUDA from BRK_T_AYUDA_DOC_SIN_SS where CD_DOC_SINIESTRO = s.CD_DOC_SINIESTRO and CD_SDOC_SINIESTRO = s.CD_SDOC_SINIESTRO and rownum = 1), NULL) as AYUDA\n " +
            "from BRK_T_SUB_DOC_SINIESTRO_SS s,\n" +
            "     BRK_T_TP_DOC_SINIESTRO t,\n" +
            "     BRK_T_DOC_SINIESTRO_SS d\n" +
            "where s.CD_DOC_SINIESTRO in (:cdsDocs)\n" +
            "  and d.CD_DOC_SINIESTRO = s.CD_DOC_SINIESTRO\n" +
            "  and d.SUBDOCUMENTO = 1\n" +
            "  and s.CD_TP_DOC_SINIESTRO = t.CD_TP_DOC_SINIESTRO";

    public List<DocumentoSiniestro> getDocumentosSiniestros(Integer cdAseguradora, Integer cdRamo, String tpReclamo) {
        var params = Map.of("cdAseguradora", cdAseguradora, "cdRamo", cdRamo, "tpReclamo", tpReclamo);
        return jdbcTemplate.query(Q_DOCUMENTOS_SS, params, new BeanPropertyRowMapper<>(DocumentoSiniestro.class));
    }

    public List<SubdocumentoSiniestro> getSubDocumentosSiniestros(List<Integer> cdsDocs) {
        if (cdsDocs.isEmpty()) return List.of();
        var params = Map.of("cdsDocs", cdsDocs);
        return jdbcTemplate.query(Q_SUBDOCUMENTOS_SS, params, new BeanPropertyRowMapper<>(SubdocumentoSiniestro.class));
    }
}
