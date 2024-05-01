package com.tefisoft.efiweb.srv;

import com.tefisoft.efiweb.exc.FileProcessException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.data.util.ReflectionUtils;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Optional;

import static com.tefisoft.efiweb.srv.FileProcessService.DEJAR_PASAR;

@ExtendWith(MockitoExtension.class)
class TestFileProcessService {

    private static final String SUBSCRIPTION_KEYS = "subscriptionKeys";
    @InjectMocks
    FileProcessService fileProcessService;


    @BeforeEach
    void before() throws NoSuchFieldException {
        setDeclaredField("computerVisionUrl",
                "https://uqai-documents-test.cognitiveservices.azure.com/computervision/imageanalysis:analyze" +
                        "?api-version=2023-02-01-preview&features=read&model-version=latest&language=es");
        setDeclaredField(SUBSCRIPTION_KEYS, Arrays.asList("12345", "3ad3243fc6a94274ba46330ce2d04795"));

        var timeOut = 1000;
        RestTemplate restTemplate = new RestTemplateBuilder().build();
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeOut);
        factory.setReadTimeout(timeOut);
        restTemplate.setRequestFactory(factory);

        setDeclaredField("restTemplate", restTemplate);
    }

    @ParameterizedTest
    @CsvSource(value = {
            "documento_legible.pdf, application/pdf",
            "imagen_legible.png, image/png",
            "documento_con_imagen.pdf, application/pdf",
            "text_valid_false_negative.jpeg, image/jpg",
    })
    void itShouldProcessAValidDocument(String fileName, String fileType) throws IOException {
        //given
        var file = getFile(fileName, fileType);
        // when
        var isADocumentValid = fileProcessService.isADocumentReadable(file);
        // then
        Assertions.assertTrue(isADocumentValid);
    }

    @ParameterizedTest
    @CsvSource(value = {
            "documento_no_legible.pdf, application/pdf",
            "imagen_no_legible.jpg, image/jpeg"
    })
    void itShouldProcessAInvalidDocument(String fileName, String fileType) throws IOException {
        //given
        var file = getFile(fileName, fileType);
        // when
        Throwable throwable = Assertions.assertThrows(FileProcessException.class,
                () -> fileProcessService.isADocumentReadable(file)
        );
        // then
        Assertions.assertEquals("El documento: '" + file.getOriginalFilename() + "' no es legible, ingrese un documento válido.",
                throwable.getMessage());
    }

    @Test
    @DisplayName("Si existe un timeout o un error de conexión hacia el server se deja pasar como válido")
    void itShouldProcessAsValidBecauseThereIsNoConexion() throws IOException, NoSuchFieldException {
        //given
        setDeclaredField("computerVisionUrl", "https://www.666.com");
        var file = getFile("imagen_legible.png", "image/png");
        // when
        var ex = Assertions.assertThrows(FileProcessException.class, () -> fileProcessService.getBodyDocumentWordsFromAPI(file));
        // then
        Assertions.assertEquals(DEJAR_PASAR, ex.getMessage());
    }

    @Test
    void itShouldFindACorrectFacturaAccessWith48Numbers() {
        // given
        String[] words = new String[]{"666", "the number of the beast", "1213052812341892341233241351232413254914292343128"};
        // when
        var isValid = fileProcessService.isFacturaValid(words, null);
        // then
        Assertions.assertTrue(isValid);
    }

    @Test
    void itShouldFailToGetFacturaAccessWith49Numbers() {
        // given
        String[] words = new String[]{"666", "the number of the beast", "moriré con las botas puestas"};
        // when
        var originalFileName = "facturita.pdf";
        var isValid = fileProcessService.isFacturaValid(words, null);
        // then
        Assertions.assertFalse(isValid);
    }

    @Test
    void itShouldConvertALocalDateToZonedDateTime() {
        // given
        String fechita = "01/01/2023";
        // when
        var fechaConvertida = fileProcessService.convertirFechaEmisionAFechaFactura(fechita);
        // then
        Assertions.assertNotNull(fechaConvertida);

    }

    MultipartFile getFile(String originalFileName, String contentType) throws IOException {
        var filePath = Optional.ofNullable(this.getClass().getClassLoader().getResource("documents/" + originalFileName));
        Path path = Paths.get(filePath.orElseThrow().getPath());
        byte[] content = Files.readAllBytes(path);
        return new MockMultipartFile(originalFileName, originalFileName, contentType, content);
    }

    void setDeclaredField(String field, Object value) throws NoSuchFieldException {
        ReflectionUtils.setField(fileProcessService.getClass().getDeclaredField(field),
                fileProcessService, value);
    }

}