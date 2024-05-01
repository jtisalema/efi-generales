package com.tefisoft.efiweb.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public final class PdfUtils {

    private PdfUtils() {
    }

    public static byte[] pdfToByte(String pdfResourcePath) {
        try {
            Resource resource = new ClassPathResource(pdfResourcePath);
            InputStream inputStream = resource.getInputStream();

            try (PDDocument document = PDDocument.load(inputStream); ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
                document.save(byteArrayOutputStream);
                return byteArrayOutputStream.toByteArray();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
