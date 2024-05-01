package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.srv.DocumentoSiniestroService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/documentos-siniestros")
public class DocumentoSiniestroController {

    private final DocumentoSiniestroService documentoSiniestroService;

    @PostMapping
    public Map<String, Object> getDocumentosAdjuntos(@RequestBody ObjectNode item) {
        return documentoSiniestroService.getDocumentosAdjuntos(item);
    }
}
