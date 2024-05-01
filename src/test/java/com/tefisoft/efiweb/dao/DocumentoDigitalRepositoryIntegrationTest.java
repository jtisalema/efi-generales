package com.tefisoft.efiweb.dao;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DocumentoDigitalRepositoryIntegrationTest {

    @Autowired
    private DocumentoDigitalRepository documentoDigitalRepository;

    @Test
    void deleteAllByCdArchivoIn() {
        //given
        List<Integer> cdsArchivos = List.of(1963, 1964, 1965);
        //when - then
        Assertions.assertDoesNotThrow(() -> documentoDigitalRepository.deleteAllByCdArchivoIn(cdsArchivos));
    }
}