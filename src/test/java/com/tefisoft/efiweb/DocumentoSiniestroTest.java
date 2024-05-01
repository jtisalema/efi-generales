package com.tefisoft.efiweb;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.DocumentoSiniestroRepository;
import com.tefisoft.efiweb.srv.DocumentoDigitalService;
import com.tefisoft.efiweb.srv.DocumentoSiniestroService;
import com.tefisoft.efiweb.srv.SendWhatsappSrv;
import com.tefisoft.efiweb.srv.SiniestroPortalSrv;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DocumentoSiniestroTest {

    @Autowired
    DocumentoSiniestroRepository documentoSiniestroRepository;
    @Autowired
    DocumentoSiniestroService documentoSiniestroService;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    SendWhatsappSrv sendWhatsappSrv;
    @Autowired
    SiniestroPortalSrv siniestroPortalSrv;
    @Autowired
    DocumentoDigitalService documentoDigitalService;

    @Test
    void getDocuments() {
        var cdAseguradora = 65;
        var cdRamo = 60;
        var tpReclamo = "AMBULATORIO";
        var documentos = documentoSiniestroRepository.getDocumentosSiniestros(cdAseguradora, cdRamo, tpReclamo);
        Assertions.assertFalse(documentos.isEmpty());
    }

    @Test
    void getsubDocuments() {
        var cdsDocs = List.of(2, 6);
        var subdocumentos = documentoSiniestroRepository.getSubDocumentosSiniestros(cdsDocs);
        Assertions.assertTrue(subdocumentos.size() > 0);
    }


    @Test
    void getAdjuntos() {
        var item = objectMapper.createObjectNode();
        item.put("cdAseguradora", 57);
        item.put("cdRamo", 55);
        item.put("tpSiniestro", "PRE_AUTORIZACION");
        var adjuntos = documentoSiniestroService.getDocumentosAdjuntos(item);
        System.out.println(adjuntos.toString());
        Assertions.assertFalse(adjuntos.isEmpty());
    }

    @Test
    void updateAdjuntos() {
        RestTemplate restTemplate = new RestTemplateBuilder().build();
        var uuid = "e671753b-e48c-4bb2-bb46-e827e4d60bc3";
        var cdReclamo = 888;
        var body = objectMapper.createObjectNode();
        body.put("uuid", uuid);
        body.put("cdReclamo", cdReclamo);
        var uri = "http://localhost:8081/efi//api/documentos-siniestros/update";
        var response = restTemplate.postForEntity(uri, body, ObjectNode.class);
    }

    @Test
    void getDataWhatsapp() throws JsonProcessingException {
        sendWhatsappSrv.handleMessage(2, 7, 5, "CAMBIO_ESTADO");
        Assertions.assertTrue(true);
    }

    @Test
    void getMessageDataByCdReclamoAndCdCompania() {
        var data = siniestroPortalSrv.findDataByMensaje(2, 984069, 666);
    }

    @Test
    void listVacias() {
        documentoDigitalService.eliminarDocs();
        Assertions.assertTrue(true);
    }
}
