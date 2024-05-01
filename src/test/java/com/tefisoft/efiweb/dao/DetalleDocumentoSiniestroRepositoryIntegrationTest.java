package com.tefisoft.efiweb.dao;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DetalleDocumentoSiniestroRepositoryIntegrationTest {

    @Autowired
    DetalleDocumentoSiniestroRepository detalleDocumentoSiniestroRepository;

    @Test
    void deleteAllByCdArchivo() {
        //given
        Integer cdArchivo = 1963;
        //when - then
        Assertions.assertDoesNotThrow(() -> detalleDocumentoSiniestroRepository.deleteAllByCdArchivo(1963));
    }

    @Test
    void deleteAllByCdArchivoIn() {
        //given
        List<Integer> cdsArchivos = Arrays.asList(1964, 1965);
        //when - then
        Assertions.assertDoesNotThrow(() -> detalleDocumentoSiniestroRepository.deleteAllByCdArchivoIn(cdsArchivos));
    }
}