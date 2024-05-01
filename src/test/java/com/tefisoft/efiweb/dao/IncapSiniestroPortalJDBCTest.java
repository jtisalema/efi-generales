package com.tefisoft.efiweb.dao;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IncapSiniestroPortalJDBCTest {

    @Autowired
    private IncapSiniestroPortalJDBC incapSiniestroPortalJDBC;

    @Test
    void findAllByFcPrimeraFacturaIsNotNullAndFcPrimeraFacturaIsGreaterThanEqualJDBC() {
        //given
        var limitDate = LocalDate.of(2023, 5, 11);
        //when
        var listaIncaps = incapSiniestroPortalJDBC.getIncapSiniestroFcPrimeraFacturaGreaterEquals(limitDate);
        //then
        Assertions.assertThat(listaIncaps).hasSize(1);
    }

}