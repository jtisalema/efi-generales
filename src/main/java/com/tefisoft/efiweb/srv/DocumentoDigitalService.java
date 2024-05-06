package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.dao.DocumentoDigitalRepository;
import com.tefisoft.efiweb.entidad.DetalleDocumentoSiniestro;
import com.tefisoft.efiweb.entidad.DocumentoDigital;
import com.tefisoft.efiweb.enums.DocumentoDigitalEnum;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.exc.StorageException;
import com.tefisoft.efiweb.util.Ctns;
import com.tefisoft.efiweb.util.Utilities;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.tefisoft.efiweb.util.Ctns.CARGADO;
import static com.tefisoft.efiweb.util.Ctns.FACTURA;
import static com.tefisoft.efiweb.util.Ctns.POR_ELIMINAR;
import static com.tefisoft.efiweb.util.Ctns.RECETA;

@Service
@RequiredArgsConstructor
@CommonsLog
public class DocumentoDigitalService {

    private final DocumentoDigitalRepository documentoDigitalRepository;
    private final DetalleDocumentoSiniestroService detalleDocumentoSiniestroService;
    private final ObjectMapper objectMapper;
    private final ExternalStorageSrvImpl externalStorageSrv;
    private final FileProcessService fileProcessService;
    private static final String POLIZA = "poliza";
    private static final String DOCUMENTO_DIGITAL = "documentoDigital";
    private static final String ESTADO = "estado";
    private static final String CD_ARCHIVO = "cdArchivo";
    private static final String COMPROBANTE = "comprobante";
    private static final String NOMBRETIPOARCHIVO = "nmDocumento";
    private static final String JSON_EXTENSION = ".json";

    public DocumentoDigital convertValue(ObjectNode item) {
        try {
            var metadatoString = item.path("metadato").toString();
            item.put("metadato", metadatoString);
            var docDigital = objectMapper.convertValue(item, DocumentoDigital.class);
            if (ObjectUtils.isEmpty(docDigital.getEstado()))
                docDigital.setEstado(CARGADO);
            return docDigital;
        } catch (Exception ex) {
            log.error("Error convirtiendo documento digital :: " + item + " :: " + ex.getMessage());
        }
        return new DocumentoDigital();
    }

    public DocumentoDigital saveDocumentAndFile(ObjectNode item, MultipartFile file, boolean isUser) {

        if (file != null)
            fileProcessService.isADocumentReadable(file, item);

        var documentoDigital = this.convertValue((ObjectNode) item.path(DOCUMENTO_DIGITAL));
        var isMedicinaContinua = item.path("reqFecha").asBoolean();

        // separo esto porque no se guardan en base
        var detalleDocumento = documentoDigital.getDetalleDocumento();
        var cdCobertura = documentoDigital.getCdCobertura();
        try {
            var nombreDocumento = item.path(NOMBRETIPOARCHIVO).asText().trim().replaceAll("\\s+", "");
            this.handleDocumentoDigital(item, documentoDigital, file, nombreDocumento);
            this.handleEstado(documentoDigital, isUser);
            documentoDigitalRepository.save(documentoDigital);
            var tipo = ObjectUtils.isEmpty(documentoDigital.getTipo()) ? "" : documentoDigital.getTipo().toUpperCase();
            var isRecetaMedicinaContinua = RECETA.equals(tipo) && isMedicinaContinua;
            if (!ObjectUtils.isEmpty(detalleDocumento) && (FACTURA.equals(tipo) || isRecetaMedicinaContinua)) {
                detalleDocumento.setCdReclamo(documentoDigital.getCdReclamo());
                detalleDocumento.setCdArchivo(documentoDigital.getCdArchivo());
                detalleDocumento.setCdDocSiniestro(documentoDigital.getCdDocSiniestro());
                detalleDocumento.setCdSdocSiniestro(documentoDigital.getCdSdocSiniestro());
                detalleDocumento.setCdCompania(documentoDigital.getCdCompania());
                detalleDocumento.setCdCobertura(cdCobertura);
                detalleDocumento.setCdIncSiniestro(documentoDigital.getCdIncSiniestro());
                detalleDocumentoSiniestroService.save(detalleDocumento);
            }
            documentoDigital.setCdCobertura(cdCobertura);
            documentoDigital.setDetalleDocumento(detalleDocumento);
            return this.generarUrl(documentoDigital);
        } catch (Exception ex) {
            this.deleteById(documentoDigital.getCdArchivo());
            externalStorageSrv.delete(documentoDigital.getPathFile());
            log.error("Error en saveFile :: " + ex.getMessage());
            throw new StorageException("Error guardando archivo");
        }
    }

    public void saveComprobanteToMinio(ObjectNode item, DocumentoDigital documentoDigital) {
        try {
            var pathFile = documentoDigital.getPathFile();
            if (pathFile == null || !item.hasNonNull(COMPROBANTE))
                return;
            var lastIndex = pathFile.lastIndexOf("/");
            if (lastIndex <= 1)
                return;
            this.saveJsonToMinio(item.path(COMPROBANTE), pathFile);
        } catch (Exception ex) {
            log.error("Error guardando el comprobante: " + ex.getMessage());
        }
    }

    public void saveJsonToMinio(JsonNode json, String pathFile) throws JsonProcessingException {
        byte[] fileBytes = objectMapper.writeValueAsBytes(json);
        Resource resource = new ByteArrayResource(fileBytes);
        externalStorageSrv.store(pathFile + JSON_EXTENSION, resource, "application/json");
    }

    public void handleEstado(DocumentoDigital documentoDigital, boolean isUser) {
        var estado = documentoDigital.getEstado();
        if (Ctns.DEVUELTO.equalsIgnoreCase(estado) && isUser)
            documentoDigital.setEstado(Ctns.CARGADO);
    }

    public List<DocumentoDigital> saveDocuments(ObjectNode item, List<MultipartFile> files, boolean isUser) {
        var siniestro = (ObjectNode) item.path("siniestro");
        var items = (ArrayNode) item.path("items");
        var documentosDigitales = new ArrayList<DocumentoDigital>();

        items.forEach(itemJson -> {
            if (itemJson.isEmpty())
                itemJson = objectMapper.createObjectNode();
            var itemNode = (ObjectNode) itemJson;
            var isDeleteNeeded = itemNode.path(DOCUMENTO_DIGITAL).path(ESTADO).asText().equalsIgnoreCase(POR_ELIMINAR);
            DocumentoDigital documentoDigital;
            if (isDeleteNeeded) {
                documentoDigital = this.deleteFile((ObjectNode) itemNode.path(DOCUMENTO_DIGITAL));
            } else {
                itemNode.setAll(siniestro);
                var file = findMultipartFileByNameAndSize(itemNode, files);
                documentoDigital = saveDocumentAndFile(itemNode, file, isUser);
            }
            documentosDigitales.add(documentoDigital);
        });
        return documentosDigitales;
    }

    public MultipartFile findMultipartFileByNameAndSize(ObjectNode item, List<MultipartFile> files) {
        if (ObjectUtils.isEmpty(files))
            return null;
        var nombre = item.path(DOCUMENTO_DIGITAL).path("nombre").asText();
        var size = item.path(DOCUMENTO_DIGITAL).path("tamanio").asLong();
        return files.stream()
                .filter(file -> nombre.equals(file.getOriginalFilename()) && size == file.getSize())
                .findFirst()
                .orElse(null);
    }

    public void deleteById(Integer id) {
        try {
            documentoDigitalRepository.deleteById(id);
        } catch (Exception ex) {
            log.error(ex.getMessage());
        }
    }

    /**
     * Determina el FileType de archivo de un archivo MultipartFile basado en su
     * mimetype,
     * a futuro se podria considerar tambien la extension del archivo para archivos
     * un un mimetype especiales
     *
     * @param archivo Archivo a determinar su FileType
     * @return FileType del archivo
     */
    private DocumentoDigitalEnum fileTypeFromFile(MultipartFile archivo) {
        var contentType = archivo.getContentType();
        if (contentType == null)
            return DocumentoDigitalEnum.UNKNOWN;
        var mime = contentType.toLowerCase();
        var type = DocumentoDigitalEnum.FILE;
        if (mime.contains("image")) {
            type = DocumentoDigitalEnum.IMAGE;
        } else if (mime.contains("video")) {
            type = DocumentoDigitalEnum.VIDEO;
        } else if (mime.contains("audio")) {
            type = DocumentoDigitalEnum.AUDIO;
        }
        return type;
    }

    /**
     * Normaliza el texto del nombre de un archivo quitando simbolos y caracteres
     * especiales
     * y recota la dimension de caracteres del nombre
     *
     * @param filename texto a normalizar
     * @return texto normalizado
     */
    private String normalizeFilename(String filename) {
        if (filename == null)
            return null;

        var extension = FilenameUtils.getExtension(filename);
        var baseName = FilenameUtils.getBaseName(filename);

        var normalized = baseName
                .trim() // eliminar espacios al inicio y final
                .replaceAll("[^A-Za-z0-9_\\-]", ""); // eliminar caracteres especiales
        if (normalized.length() > 50) {
            normalized = normalized.substring(0, 50); // recorta el nombre del archivo a maximo 50 caracteres
        }
        return normalized + "." + extension;
    }

    public void saveFileToMinio(DocumentoDigital documentoDigital, MultipartFile file, String nombreArchivo) {
        if (ObjectUtils.isEmpty(file))
            return;

        var type = this.fileTypeFromFile(file);
        var originalFileName = file.getOriginalFilename();
        String id = type.toString().charAt(0) + RandomStringUtils.randomAlphanumeric(5).toLowerCase();
        String normalizedFilename = this.normalizeFilename(originalFileName);
        var fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        String mime = file.getContentType();
        var cdArchivo = documentoDigital.getCdArchivo();

        String uri = "";
        if (nombreArchivo.isEmpty() || nombreArchivo.isBlank())
            uri = String.format("%s/%s/%s/%s.%s",
                    documentoDigital.getCdCliente(),
                    "SINIESTRO",
                    documentoDigital.getCdCompania(),
                    (cdArchivo == null ? id : cdArchivo) + id,
                    fileExtension);
        else {
            uri = String.format("%s/%s/%s/%s%s.%s",
                    documentoDigital.getCdCliente(),
                    "SINIESTRO",
                    documentoDigital.getCdCompania(),
                    nombreArchivo.replaceAll("\\.", "_"),
                    RandomStringUtils.randomNumeric(5).toLowerCase(),
                    fileExtension);
        }
        externalStorageSrv.store(uri, file);
        var prevFile = documentoDigital.getPathFile();
        documentoDigital.setNombre(normalizedFilename);
        documentoDigital.setMime(mime);
        documentoDigital.setPathFile(uri);
        documentoDigital.setTamanio(file.getSize());
        this.deleteAttachmentFiles(prevFile);
    }

    public void deleteAttachmentFiles(String pathFile) {
        if (ObjectUtils.isEmpty(pathFile))
            return;
        var jsonFile = pathFile + JSON_EXTENSION;
        externalStorageSrv.delete(pathFile);
        externalStorageSrv.delete(jsonFile);
    }

    public void handleDocumentoDigital(ObjectNode item, DocumentoDigital documentoDigital, MultipartFile file,
            String nombreArchivo) {
        try {
            Integer cdCliente = item.path("cdCliente").asInt();
            var cdCompania = item.path("cdCompania").asInt(1);
            var cdRamo = Utilities.getOrDefaultNull(item, "cdRamo", Integer.class);
            var poliza = Utilities.getOrDefaultNull(item, POLIZA, String.class);
            var cdReclamo = Utilities.getOrDefaultNull(item, "cdReclamo", Integer.class);
            var cdIncSiniestro = Utilities.getOrDefaultNull(item, "cdIncSiniestro", Integer.class);
            var uuidDocument = item.path("uuid").asText();
            this.handleMetadata(documentoDigital, item);
            documentoDigital.setCdIncSiniestro(cdIncSiniestro);
            documentoDigital.setUuid(uuidDocument);
            documentoDigital.setCdReclamo(cdReclamo);
            documentoDigital.setCdCliente(cdCliente);
            documentoDigital.setCdCompania(cdCompania);
            documentoDigital.setCdRamo(cdRamo);
            documentoDigital.setPoliza(poliza);
            documentoDigital.setActivo(true);
            this.saveFileToMinio(documentoDigital, file, nombreArchivo);
            this.saveComprobanteToMinio(item, documentoDigital);
        } catch (StorageException exception) {
            log.error("No se pudo guardar el archivo: " + exception.getMessage());
            throw new StorageException("No se pudo guardar el archivo");
        }
    }

    public void handleMetadata(DocumentoDigital documentoDigital, JsonNode item) {
        ObjectNode metadatoNode = null;
        var idUsuario = item.path("idUsuario").asText(); // usuario que carga el archivo
        var isNewSiniestro = ObjectUtils.isEmpty(documentoDigital.getCdIncSiniestro());
        if (isNewSiniestro) {
            metadatoNode = objectMapper.createObjectNode();
            metadatoNode.put("fechaCreacion", ZonedDateTime.now().toLocalDateTime().toString());
        } else {
            try {
                var metadatoTextNode = objectMapper.readTree(documentoDigital.getMetadato());
                metadatoNode = (ObjectNode) objectMapper.readTree(metadatoTextNode.asText());
                metadatoNode.put("fechaActualizacion", ZonedDateTime.now().toLocalDateTime().toString());
            } catch (Exception ex) {
                log.error(ex.getMessage());
            }
        }
        if (metadatoNode != null) {
            metadatoNode.put("idUsuarioCreacion", idUsuario);
            metadatoNode.put("fechaActualizacion", ZonedDateTime.now().toLocalDateTime().toString());
            documentoDigital.setMetadato(metadatoNode.toString());
        }
    }

    // recibo la lista de archivos que voy a buscar y con esto genero la url para
    // acceder a los documentos.
    public DocumentoDigital generarUrl(DocumentoDigital documentoDigital) {
        Map<String, String> headers = new HashMap<>();
        try {
            headers.put("response-Content-type", documentoDigital.getMime());
            String url = externalStorageSrv.loadPrivateUrl(documentoDigital.getPathFile(), headers);
            documentoDigital.setUrl(url);
        } catch (Exception ex) {
            log.error("Error al crear url de descarga del archivo :: " + ex.getMessage());
        }
        return documentoDigital;
    }

    public DocumentoDigital deleteFile(ObjectNode item) {
        return deleteFile(this.convertValue(item));
    }

    public DocumentoDigital deleteFile(DocumentoDigital docDigital) {
        try {
            this.deleteAttachmentFiles(docDigital.getPathFile());
            detalleDocumentoSiniestroService.deleteAllByCdArchivo(docDigital.getCdArchivo());
            documentoDigitalRepository.deleteById(docDigital.getCdArchivo());
        } catch (Exception ex) {
            log.error("Error en deleteFile :: " + ex.getMessage());
        }
        return DocumentoDigital.builder().cdArchivo(null).activo(docDigital.getActivo())
                .cdCobertura(docDigital.getCdCobertura())
                .cdDocSiniestro(docDigital.getCdDocSiniestro()).cdSdocSiniestro(docDigital.getCdSdocSiniestro())
                .tipo(docDigital.getTipo()).numGrupo(docDigital.getNumGrupo()).orden(docDigital.getOrden())
                .build();
    }

    public void deleteMultipleFiles(Map<String, List<DocumentoDigital>> item) {
        try {
            var archivos = item.get("archivos");
            var cdsArchivos = archivos.stream()
                    .map(DocumentoDigital::getCdArchivo).collect(Collectors.toList());
            if (!ObjectUtils.isEmpty(cdsArchivos)) {
                this.deleteAllByCdArchivoIn(cdsArchivos);
                detalleDocumentoSiniestroService.deleteAllByCdArchivoIn(cdsArchivos);
                archivos.forEach(archivo -> externalStorageSrv.delete(archivo.getPathFile()));
            }
        } catch (Exception ex) {
            log.error("Error en deleteMultipleFiles :: " + ex.getMessage());
        }
    }

    public void deleteAllByCdArchivoIn(List<Integer> cdsArchivos) {
        if (ObjectUtils.isEmpty(cdsArchivos))
            return;
        documentoDigitalRepository.deleteAllByCdArchivoIn(cdsArchivos);
    }

    public List<DocumentoDigital> findAllByCdReclamoAndCdRamoAndCdIncSiniestro(Integer cdReclamo, Integer cdRamo,
            Integer cdIncSiniestro) {
        if (cdReclamo > 0 && cdIncSiniestro > 0) {
            return documentoDigitalRepository.findAllByCdReclamoAndCdRamoAndCdIncSiniestro(cdReclamo, cdRamo,
                    cdIncSiniestro);
        }
        return List.of();
    }

    public List<DetalleDocumentoSiniestro> findAllByCdReclamoAndCdArchivoIn(Integer cdReclamo,
            List<Integer> cdsArchivos) {
        if (cdReclamo > 0 && !cdsArchivos.isEmpty()) {
            return detalleDocumentoSiniestroService.findAllByCdReclamoAndCdArchivoIn(cdReclamo, cdsArchivos);
        }
        return List.of();
    }

    public ObjectNode updateEstadoAndObservacionesByCdArchivo(ObjectNode item) {
        var cdArchivoNode = item.path(CD_ARCHIVO);
        var isntSubdocumento = item.has("subdocumento") && !item.path("subdocumento").asBoolean();
        if (cdArchivoNode.isNull() && isntSubdocumento) { // es tipo documento y además nuevo
            var docDigital = objectMapper.convertValue(item, DocumentoDigital.class);
            this.handleMetadata(docDigital, item);
            documentoDigitalRepository.save(docDigital);
            return item.put(CD_ARCHIVO, docDigital.getCdArchivo());
        }
        if (!cdArchivoNode.isNull()) {
            var estado = item.path(ESTADO).asText();
            var observaciones = Utilities.truncate(item.path("observaciones").asText(), 500);
            var idUsuarioEjecutivo = item.path("idUsuarioEjecutivo").asInt();
            documentoDigitalRepository.nativeUpdateEstadoAndObservacionesAndIdEjecutivoByCdArchivo(
                    cdArchivoNode.asInt(), estado, observaciones, idUsuarioEjecutivo);
        }
        return item;
    }

    public void updateEstadoByCdsArchivos(String estado, List<Integer> cdsArchivos) {
        documentoDigitalRepository.nativeUpdateEstadoByCdArchivoIn(estado, cdsArchivos);
    }

    @Scheduled(cron = "0 45 23 * * *", zone = "America/Guayaquil")
    @Transactional
    public void eliminarDocs() {
        List<DocumentoDigital> docs = documentoDigitalRepository.findAllByCdReclamoIsNull();
        ZonedDateTime hoy = ZonedDateTime.now();
        // un dia anterior
        LocalDateTime hasta = hoy.toLocalDate().minusDays(1).atTime(23, 59, 59);

        var count = docs.stream().parallel().filter(documentoDigital -> {
            try {
                ObjectNode fechas = objectMapper.readValue(documentoDigital.getMetadato(), ObjectNode.class);
                String fc = fechas.get("fechaCreacion").asText();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS");
                LocalDateTime fcCreacion = LocalDateTime.parse(fc, formatter);
                return fcCreacion.isBefore(hasta);
            } catch (Exception e) {
                log.error("Error al procesar metadata doc to delete:" + e.getMessage());
                return false;
            }
        }).map(this::deleteFile).count();

        log.info("Today delete unused documents " + count);

    }

    public ObjectNode getJson(String name) {
        String path = name + JSON_EXTENSION;
        return externalStorageSrv.getJson(path);
    }

    public void actualizarValorFactura(ObjectNode item, String pathFile) {
        try {
            this.saveJsonToMinio(item, pathFile);
        } catch (Exception ex) {
            log.error("Error in actualizarValorFactura, pathFile: " + pathFile + ", message: " + ex.getMessage());
            throw new CustomException("Error actualizando el valor de la factura");
        }
    }

}
