package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.entidad.DetalleDocumentoSiniestro;
import com.tefisoft.efiweb.exc.CustomException;
import com.tefisoft.efiweb.exc.FileProcessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import lombok.val;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.tools.imageio.ImageIOUtil;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.pdf.PDFParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import javax.annotation.PostConstruct;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@RequiredArgsConstructor
@CommonsLog
public class FileProcessService {


    @Value("${app.computer-vision.url}")
    private String computerVisionUrl;
    @Value("${app.computer-vision.subscription.keys}")
    private List<String> subscriptionKeys;
    @Value("${app.factura-electronica.url}")
    private String facturaUrl;

    private RestTemplate restTemplate;
    private final ObjectMapper mapper;

    private static final String OCP_APIM_SUBSCRIPTION_KEY = "Ocp-Apim-Subscription-Key";
    public static final String DEJAR_PASAR = "Dejar pasar por servicio no disponible";
    public static final String DOCUMENTO_NO_LEGIBLE = "No se puede detectar el documento ya que está ilegible, vuelva a cargar por favor";
    public static final String ERROR_GENERAL_API = "No se puede detectar el documento, vuelva a cargar o intente con uno diferente por favor";

    private static final String INFO_TRIBUTARIA = "infoTributaria";
    private static final String INFO_FACTURA = "infoFactura";
    private static final String DOCUMENTO_DIGITAL = "documentoDigital";

    @PostConstruct
    void init() {
        var timeOut = 10000;
        this.restTemplate = new RestTemplateBuilder().build();
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeOut);
        factory.setReadTimeout(timeOut);
        this.restTemplate.setRequestFactory(factory);
    }

    public boolean isADocumentReadable(MultipartFile multipartFile) {
        return isADocumentReadable(multipartFile, null);
    }

    public boolean isADocumentReadable(MultipartFile multipartFile, ObjectNode item) {
        if (multipartFile == null) throw new FileProcessException("El archivo debe estar presente.");
        AtomicBoolean isReadable = new AtomicBoolean(false);

        var type = multipartFile.getContentType();
        assert type != null;
        if (type.contains("pdf")) {
            var isValid = validateDocumentContent(this::getBodyDocumentWordsFromTika, multipartFile, item);
            if (!isValid) { // reintento con el API
                var fileConverted = convertPdfToImage(multipartFile);
                isValid = validateDocumentContent(this::getBodyDocumentWordsFromAPI, fileConverted, item);
            }
            isReadable.set(isValid);
        } else if (type.contains("image"))
            isReadable.set(validateDocumentContent(this::getBodyDocumentWordsFromAPI, multipartFile, item));
        else
            throw new FileProcessException("El tipo de archivo: " + type + " no está soportado.", null, false, false);
        if (!isReadable.get())
            throw new FileProcessException(DOCUMENTO_NO_LEGIBLE, null, false, false);
        return true;
    }

    public String[] getBodyDocumentWordsFromTika(MultipartFile file) throws IOException, TikaException, SAXException {
        try (val inputstream = getFirstPageFromPDF(file)) {
            final BodyContentHandler handler = new BodyContentHandler();
            new PDFParser().parse(inputstream, handler, new Metadata(), new ParseContext());
            var content = handler.toString().trim();
            return content.split("\\s");
        }
    }

    public InputStream getFirstPageFromPDF(MultipartFile file) throws IOException {
        try (val document = new PDDocument()) {
            PDPage firstPage = PDDocument.load(file.getInputStream()).getPage(0);
            document.addPage(firstPage);
            var baos = new ByteArrayOutputStream();
            document.save(baos);
            return new ByteArrayInputStream(baos.toByteArray());
        }
    }

    public MultipartFile convertPdfToImage(MultipartFile file) {
        var originalFileName = Optional.ofNullable(file.getOriginalFilename());
        var fileName = originalFileName.orElseThrow()
                .replace(".pdf", ".png");
        try {
            PDDocument document = PDDocument.load(file.getInputStream());
            PDFRenderer renderer = new PDFRenderer(document);
            BufferedImage image = renderer.renderImage(0); // first page
            var baos = new ByteArrayOutputStream();
            ImageIOUtil.writeImage(image, "png", baos);
            return new MockMultipartFile(fileName, fileName, "image/png", baos.toByteArray());
        } catch (Exception ex) {
            throw new FileProcessException(ex.getMessage());
        }
    }

    public String[] getBodyDocumentWordsFromAPI(MultipartFile file) throws IOException {
        var fileBytes = file.getInputStream().readAllBytes();
        var headers = getHttpHeaders();
        ResponseEntity<JsonNode> response;
        int i = 0;
        var retry = true;
        do {
            retry = i < subscriptionKeys.size() - 1;
            headers.set(OCP_APIM_SUBSCRIPTION_KEY, subscriptionKeys.get(i));
            var entity = new HttpEntity<>(fileBytes, headers);
            response = makeRequest(entity, retry);
            i++;
        } while (retry && HttpStatus.UNAUTHORIZED.equals(response.getStatusCode()));

        return getDocumentWords(response);
    }


    public ResponseEntity<JsonNode> makeRequest(HttpEntity<byte[]> entity, boolean retry) {
        List<HttpStatus> statusesExcluded = Arrays.asList(HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.SERVICE_UNAVAILABLE);
        try {
            return restTemplate.exchange(computerVisionUrl, HttpMethod.POST, entity, JsonNode.class);
        } catch (ResourceAccessException ex) {
            log.warn("In makeRequest: " + ex.getMessage());
            throw new FileProcessException(DEJAR_PASAR);
        } catch (HttpServerErrorException | HttpClientErrorException ex) {
            var status = ex.getStatusCode();
            log.warn("In makeRequest status code: " + status);
            if (HttpStatus.UNAUTHORIZED.equals(status) && retry)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            var message = ex.getMessage();
            log.warn("Estado de la petición a la API: " + status + ", message: " + message);
            if (statusesExcluded.contains(status)) throw new FileProcessException(DEJAR_PASAR);
            throw new FileProcessException(ERROR_GENERAL_API, null, false, false);
        }
    }

    public String[] getDocumentWords(ResponseEntity<JsonNode> response) {
        var status = response.getStatusCode();
        var body = response.getBody();
        List<String> wordsArray = new ArrayList<>();
        if (HttpStatus.OK.equals(status) && body != null) {
            body.path("readResult").path("pages").path(0).path("words")
                    .forEach(word -> wordsArray.add(word.path("content").asText()));
        }
        return wordsArray.toArray(new String[]{});
    }


    public boolean isDocumentValid(String[] wordsArray) {
        if (wordsArray == null) return false;
        int wordsValidCount = 0;
        val validCount = 3;
        boolean isValid = false;
        for (String word : wordsArray) {
            if (word != null && word.length() >= 7) wordsValidCount++;
            isValid = wordsValidCount >= validCount;
            if (isValid) break;
        }
        return isValid;
    }

    public boolean isFacturaValid(String[] wordsArray, ObjectNode item) {
        if (wordsArray == null) return false;
        String claveAcceso = "";
        String codigoFacturaRegex = "^[\\d]{49}$";
        for (String word : wordsArray) {
            if (word != null && word.matches(codigoFacturaRegex)) {
                claveAcceso = word;
                break;
            }
        }

        if (item != null) getComprobanteFactura(claveAcceso, item);
        return !claveAcceso.isEmpty();
    }

    public void getComprobanteFactura(String claveAcceso, ObjectNode item) {
        DetalleDocumentoSiniestro detalleDocumento = new DetalleDocumentoSiniestro();
        try {
            detalleDocumento = mapper.convertValue(item.path(DOCUMENTO_DIGITAL).path("detalleDocumento"), DetalleDocumentoSiniestro.class);
            detalleDocumento.setSriError(false);
            var body = mapper.createObjectNode();
            body.put("claveAcceso", claveAcceso);

            if (ObjectUtils.isEmpty(claveAcceso)) throw new CustomException("Clave vacía");

            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            HttpEntity<ObjectNode> entity = new HttpEntity<>(body, headers);
            var resp = restTemplate.exchange(facturaUrl, HttpMethod.POST, entity, ObjectNode.class);

            var comprobante = resp.getBody();
            assert comprobante != null;
            autoCompleteReceiptData(comprobante, detalleDocumento);
            item.set("comprobante", comprobante);
        } catch (Exception ex) {
            detalleDocumento.setNumDocumento("");
            detalleDocumento.setFcDocumento(null);
            detalleDocumento.setValor(0d);
            detalleDocumento.setSriError(true);
            log.warn("Something occurs in getComprobanteFactura: " + ex.getMessage() + ", claveAcceso: " + claveAcceso);
        }
        var documentoDigitalNode = (ObjectNode) item.path(DOCUMENTO_DIGITAL);
        isAutoCompletadoExitoso(detalleDocumento);
        documentoDigitalNode.putPOJO("detalleDocumento", detalleDocumento);
        item.set(DOCUMENTO_DIGITAL, documentoDigitalNode);
    }

    private String getTextValueFromComprobante(ObjectNode comprobanteNode, String seccionName, String propertyName) {
        return comprobanteNode.path(seccionName).path(propertyName).asText().trim();
    }

    public void autoCompleteReceiptData(ObjectNode comprobanteNode, DetalleDocumentoSiniestro detalleDocumento) {
        comprobanteNode.remove("Signature");
        String estab = getTextValueFromComprobante(comprobanteNode, INFO_TRIBUTARIA, "estab");
        String ptoEmi = getTextValueFromComprobante(comprobanteNode, INFO_TRIBUTARIA, "ptoEmi");
        String secuencial = getTextValueFromComprobante(comprobanteNode, INFO_TRIBUTARIA, "secuencial");
        String fechaEmision = getTextValueFromComprobante(comprobanteNode, INFO_FACTURA, "fechaEmision");
        double importeTotal = comprobanteNode.path(INFO_FACTURA).path("importeTotal").asDouble();

        var numeroFactura = String.format("%s-%s-%s", estab, ptoEmi, secuencial);
        var fechaFactura = convertirFechaEmisionAFechaFactura(fechaEmision);

        detalleDocumento.setNumDocumento(numeroFactura);
        detalleDocumento.setFcDocumento(fechaFactura);
        detalleDocumento.setValor(importeTotal);
    }

    private void isAutoCompletadoExitoso(DetalleDocumentoSiniestro detalleDocumento) {
        detalleDocumento.setAutocompletado(
                detalleDocumento.getNumDocumento() != null
                        && detalleDocumento.getNumDocumento().length() > 2 // excluyendo los guiones
                        && detalleDocumento.getFcDocumento() != null
        );
    }

    public ZonedDateTime convertirFechaEmisionAFechaFactura(String fechaEmision) {
        try {
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            var localDate = LocalDate.parse(fechaEmision, dateTimeFormatter);
            var localTime = LocalTime.of(0, 0, 0);
            return ZonedDateTime.of(localDate, localTime, ZoneId.systemDefault());
        } catch (Exception ex) {
            log.error("Error in convertirFechaEmisionAFechaFactura: " + ex.getMessage() + ", fechaEmision: " + fechaEmision);
            return null;
        }
    }


    public HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return headers;
    }

    public boolean validateDocumentContent(ProcessDocument function, MultipartFile file, ObjectNode item) {
        var isFactura = item != null && "FACTURA".equalsIgnoreCase(item.path("tipo").asText().trim());
        try {
            var wordsArray = function.execute(file);
            if (isFactura && isFacturaValid(wordsArray, item)) return true;
            return isDocumentValid(wordsArray);
        } catch (Exception ex) {
            if (DEJAR_PASAR.equals(ex.getMessage())) return true;
            if (isFactura) throw new FileProcessException(ex.getMessage(), null, false, false);
            log.error("Error validating the document: " + file.getOriginalFilename() + ", message: " + ex.getMessage());
            return false;
        }
    }

}

@FunctionalInterface
interface ProcessDocument {
    String[] execute(MultipartFile file) throws IOException, TikaException, SAXException;

}
