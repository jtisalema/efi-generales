package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.DocumentoSiniestroRepository;
import com.tefisoft.efiweb.entidad.DetalleDocumentoSiniestro;
import com.tefisoft.efiweb.entidad.DocumentoDigital;
import com.tefisoft.efiweb.entidad.DocumentoSiniestro;
import com.tefisoft.efiweb.entidad.SubdocumentoSiniestro;
import com.tefisoft.efiweb.interfaces.IWithOrden;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@CommonsLog
public class DocumentoSiniestroService {

    private final DocumentoSiniestroRepository documentoSiniestroRepository;
    private final DocumentoDigitalService documentoDigitalService;

    public List<DocumentoSiniestro> getDocumentosSiniestros(Integer cdAseguradora, Integer cdRamo, String tpReclamo) {
        return documentoSiniestroRepository.getDocumentosSiniestros(cdAseguradora, cdRamo, tpReclamo);
    }

    public List<SubdocumentoSiniestro> getSubDocumentosSiniestros(List<Integer> cdsDocs) {
        return documentoSiniestroRepository.getSubDocumentosSiniestros(cdsDocs);
    }

    public Map<String, Object> getDocumentosAdjuntos(ObjectNode item) {
        var cdAseguradora = item.path("cdAseguradora").asInt();
        var cdRamo = item.path("cdRamo").asInt();
        var tpReclamo = item.path("tpSiniestro").asText();
        var cdReclamo = item.path("cdReclamo").asInt();
        var cdIncSiniestro = item.path("cdIncSiniestro").asInt();
        // obtener docs siniestros
        var documentosSiniestros = this.getDocumentosSiniestros(cdAseguradora, cdRamo, tpReclamo);
        documentosSiniestros.forEach(documentoSiniestro -> {
            if (Boolean.TRUE.equals(documentoSiniestro.getSubdocumento()))
                documentoSiniestro.setNmDocumento(documentoSiniestro.getNmCobertura());
        });
        var cdsDocs = documentosSiniestros.stream().map(DocumentoSiniestro::getCdDocSiniestro).collect(Collectors.toList());
        // obtener subdocs siniestros
        var subDocumentosSiniestros = this.getSubDocumentosSiniestros(cdsDocs);
        // obtener documentos digitales
        var documentosDigitales = documentoDigitalService.findAllByCdReclamoAndCdRamoAndCdIncSiniestro(cdReclamo, cdRamo, cdIncSiniestro);
        // detalle documentos --> documentos digitales
        var cdsArchivos = documentosDigitales.stream().map(DocumentoDigital::getCdArchivo).collect(Collectors.toList());
        var detallesDocumentos = documentoDigitalService.findAllByCdReclamoAndCdArchivoIn(cdReclamo, cdsArchivos);
        this.detalleDocToDocDigital(documentosSiniestros, documentosDigitales, detallesDocumentos);
        // grupos docs
        List<DocumentoSiniestro> documentos = new ArrayList<>();
        List<DocumentoSiniestro> gastos = new ArrayList<>();
        List<DocumentoDigital> otrosDocumentos = documentosDigitales.stream()
                .filter(documentoDigital -> ObjectUtils.isEmpty(documentoDigital.getCdDocSiniestro()) && ObjectUtils.isEmpty(documentoDigital.getCdSdocSiniestro()))
                .collect(Collectors.toList());
        // documento digital --> doc siniestro
        documentosSiniestros.forEach(documentoSiniestro -> {
            var documentoDigital = documentosDigitales.stream()
                    .filter(docDigital -> documentoSiniestro.getCdDocSiniestro().equals(docDigital.getCdDocSiniestro()) &&
                            ObjectUtils.isEmpty(docDigital.getCdSdocSiniestro()))
                    .findFirst()
                    // docDigital initial properties --> doc siniestro
                    .orElse(DocumentoDigital.builder()
                            .cdDocSiniestro(documentoSiniestro.getCdDocSiniestro())
                            .cdCobertura(documentoSiniestro.getCdCobertura())
                            .build()
                    );
            documentoSiniestro.setDocumentoDigital(documentoDigital);

            // subdocs estructura --> doc siniestro
            var subdocsEstructura = subDocumentosSiniestros.stream()
                    .filter(subdocumento -> documentoSiniestro.getCdDocSiniestro().equals(subdocumento.getCdDocSiniestro()))
                    .collect(Collectors.toList());

            // docDigital initial properties --> estructuras
            subdocsEstructura.forEach(estructura -> {
                estructura.setCdDocSiniestro(documentoSiniestro.getCdDocSiniestro());
                var docDigitalEstructura = DocumentoDigital.builder()
                        .cdCobertura(documentoSiniestro.getCdCobertura())
                        .cdDocSiniestro(documentoSiniestro.getCdDocSiniestro())
                        .cdSdocSiniestro(estructura.getCdSdocSiniestro())
                        .tipo(estructura.getTipo())
                        .build();
                estructura.setDocumentoDigital(docDigitalEstructura);
            });
            documentoSiniestro.setSubdocumentosEstructura(subdocsEstructura);
            if (Boolean.TRUE.equals(documentoSiniestro.getSubdocumento())) {
                gastos.add(documentoSiniestro);
            } else {
                documentos.add(documentoSiniestro);
            }
        });
        this.setSubdocumentosItems(gastos, documentosDigitales);
        sortDocumentosByOrden(documentos);
        sortDocumentosByOrden(gastos);
        sortDocumentosByOrden(otrosDocumentos);
        return Map.of("documentos", documentos, "gastos", gastos, "otrosDocumentos", otrosDocumentos);
    }

    public <T extends IWithOrden> void sortDocumentosByOrden(List<T> documentos) {
        documentos.sort(Comparator.comparing(T::getOrden, Comparator.nullsFirst(Comparator.naturalOrder())));
    }

    public void detalleDocToDocDigital(List<DocumentoSiniestro> documentosSiniestros, List<DocumentoDigital> documentosDigitales, List<DetalleDocumentoSiniestro> detallesDocumentos) {
        documentosDigitales.forEach(documentoDigital -> {
            var cdCoberturaFromAdjunto = documentosSiniestros.stream()
                    .filter(documentoSiniestro -> documentoSiniestro.getCdDocSiniestro().equals(documentoDigital.getCdDocSiniestro()))
                    .findFirst()
                    .map(DocumentoSiniestro::getCdCobertura)
                    .orElse(null);
            documentoDigital.setCdCobertura(cdCoberturaFromAdjunto);
            documentoDigitalService.generarUrl(documentoDigital);
            var detallesHowMatch = detallesDocumentos.stream()
                    .filter(detalleDocumento -> documentoDigital.getCdArchivo().equals(detalleDocumento.getCdArchivo()))
                    .findFirst().orElse(null);
            documentoDigital.setDetalleDocumento(detallesHowMatch);
        });
    }


    public void detalleInfoFactura(DocumentoDigital doc) {
        documentoDigitalService.generarUrl(doc);
    }

    public void setSubdocumentosItems(List<DocumentoSiniestro> gastos, List<DocumentoDigital> documentosDigitales) {
        Map<Integer, Map<Integer, List<DocumentoDigital>>> documentosDigitalesAgrupados = documentosDigitales.stream()
                .filter(documento -> documento.getCdDocSiniestro() != null && documento.getNumGrupo() != null)
                .sorted(Comparator.comparing(DocumentoDigital::getNumGrupo)
                        .thenComparing(DocumentoDigital::getOrden, Comparator.nullsFirst(Comparator.naturalOrder()))
                ).collect(Collectors.groupingBy(DocumentoDigital::getCdDocSiniestro,
                        Collectors.groupingBy(DocumentoDigital::getNumGrupo))
                );
        if (ObjectUtils.isEmpty(documentosDigitalesAgrupados)) return;
        for (DocumentoSiniestro gasto : gastos) {
            var grupoByCdDocSiniestro = documentosDigitalesAgrupados.get(gasto.getCdDocSiniestro());
            gasto.setSubdocumentosItems(grupoByCdDocSiniestro);
        }
    }
}
