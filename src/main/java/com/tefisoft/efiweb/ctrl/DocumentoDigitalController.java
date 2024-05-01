package com.tefisoft.efiweb.ctrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dto.http.ListRequest;
import com.tefisoft.efiweb.entidad.DocumentoDigital;
import com.tefisoft.efiweb.srv.DocumentoDigitalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/documentos-digitales")
@CommonsLog
public class DocumentoDigitalController {

    private final DocumentoDigitalService documentoDigitalService;

    @PostMapping("/documento")
    public DocumentoDigital saveDocumentAndFile(@RequestPart("item") ObjectNode item,
                                                @RequestPart(name = "file", required = false) MultipartFile file,
                                                @RequestParam(name = "isUser", defaultValue = "false", required = false) boolean isUser) {
        return documentoDigitalService.saveDocumentAndFile(item, file, isUser);
    }

    @PostMapping("/subdocumentos")
    public List<DocumentoDigital> saveDocuments(@RequestPart("item") ObjectNode item,
                                                @RequestPart(name = "files", required = false) List<MultipartFile> files,
                                                @RequestParam(name = "isUser", defaultValue = "false", required = false) boolean isUser) {
        return documentoDigitalService.saveDocuments(item, files, isUser);
    }

    @PostMapping("/delete-file")
    public void deleteFile(@RequestBody ObjectNode item) {
        documentoDigitalService.deleteFile(item);
    }

    @PostMapping("/delete-multiplefiles")
    public void deleteMultipleFiles(@RequestBody Map<String, List<DocumentoDigital>> item) {
        documentoDigitalService.deleteMultipleFiles(item);
    }

    @PostMapping("/update/estado-observaciones")
    public ObjectNode updateEstadoObservaciones(@RequestBody ObjectNode item) {
        return documentoDigitalService.updateEstadoAndObservacionesByCdArchivo(item);
    }

    @PostMapping("/update/estado")
    public void updateEstadoObservaciones(@RequestParam String estado, @RequestBody ListRequest<Integer> cdsArchivos) {
        documentoDigitalService.updateEstadoByCdsArchivos(estado, cdsArchivos.getValues());
    }

    @GetMapping(value = "/ver-factura")
    public ObjectNode getInfoFactura(@RequestParam String nm) {
        return documentoDigitalService.getJson(nm);
    }

    @PostMapping("/actualizar-valor-factura")
    public void actualizarValorFactura(@RequestBody ObjectNode item,
                                       @PathParam("pathFile") String pathFile) {
        documentoDigitalService.actualizarValorFactura(item, pathFile);
    }
}
