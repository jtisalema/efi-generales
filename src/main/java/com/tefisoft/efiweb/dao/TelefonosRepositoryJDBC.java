package com.tefisoft.efiweb.dao;

import com.tefisoft.efiweb.util.JdbcUtilities;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.ObjectUtils;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.util.Map;

@Repository
public class TelefonosRepositoryJDBC {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private String qCorreoEjecutivoSiniestro;
    private String qNameEjecutivoSiniestro;

    public TelefonosRepositoryJDBC(DataSource dataSource) {
        this.jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }

    @PostConstruct
    public void inicio() {
        this.qCorreoEjecutivoSiniestro = JdbcUtilities.loadQuery("qCorreoEjecutivoSiniestro");
        this.qNameEjecutivoSiniestro = JdbcUtilities.loadQuery("qNameEjecutivoSiniestro");
    }

    public String getMailEjecutivoSiniestro(Integer cdCompania, Integer cdRamoCotizacion) {
        if (cdCompania == null) throw new IllegalArgumentException("cdCompania must not be null");
        if (cdRamoCotizacion == null) throw new IllegalArgumentException("cdRamoCotizacion must not be null");

        var params = Map.of("cdCompania", cdCompania, "cdRamoCotizacion", cdRamoCotizacion);

        var emails = jdbcTemplate.queryForList(qCorreoEjecutivoSiniestro, params, String.class);
        return emails.stream()
                .filter(email -> !ObjectUtils.isEmpty(email) && email.toLowerCase().trim().length() > 0)
                .distinct().findFirst().orElse(null);
    }

    public String getNameEjecutivoSiniestro(Integer cdCompania, Integer cdRamoCotizacion) {
        if (cdCompania == null) throw new IllegalArgumentException("cdCompania must not be null");
        if (cdRamoCotizacion == null) throw new IllegalArgumentException("cdRamoCotizacion must not be null");

        var params = Map.of("cdCompania", cdCompania, "cdRamoCotizacion", cdRamoCotizacion);

        var emails = jdbcTemplate.queryForList(qNameEjecutivoSiniestro, params, String.class);
        return emails.stream()
                .filter(email -> !ObjectUtils.isEmpty(email) && email.toLowerCase().trim().length() > 0)
                .distinct().findFirst().orElse("");
    }

}
