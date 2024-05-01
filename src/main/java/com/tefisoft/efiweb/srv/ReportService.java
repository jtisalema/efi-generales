package com.tefisoft.efiweb.srv;


import com.tefisoft.efiweb.exc.CustomException;
import lombok.extern.java.Log;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleXlsxReportConfiguration;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.sql.Connection;
import java.util.Map;
import java.util.Objects;

import static com.tefisoft.efiweb.util.Ctns.PHOTO_PATH;

/**
 * @author dacopanCM on 12/09/17.
 */
@Service
@Log
public class ReportService {

    private final DataSource dataSource;

    public ReportService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * inicilaiza el JasperPrint para generar el reporte
     *
     * @param reportName nombre del reporte a generar relativo a {@literal /src/main/resources/report}
     * @param params     parametros del reporte
     * @param dataSource origen de datos del reporte
     * @return JasperPrint
     * @throws JRException si algun error
     */
    public JasperPrint init(String reportName, Map<String, Object> params, JRDataSource dataSource) throws JRException {
        //params.put("logo", config.isReportLogo());
        InputStream stream = this.getClass().getClassLoader().getResourceAsStream("report/" + reportName);
        return JasperFillManager.fillReport(stream, params, dataSource);
    }

    /**
     * inicilaiza el JasperPrint para generar el reporte
     *
     * @param reportName nombre del reporte a generar relativo a {@literal /src/main/resources/report}
     * @param params     parametros del reporte
     * @return JasperPrint
     * @throws JRException si algun error
     */
    public JasperPrint init(String reportName, Map<String, Object> params) throws JRException, IOException {
        JasperPrint print = null;

        var folder = new File(PHOTO_PATH);

        if (!folder.exists()) {
            folder.mkdirs();
        }
        var file = new File(PHOTO_PATH, "efi/logo-email.png");
        if (!file.exists()) {
            Files.copy(Objects.requireNonNull(this.getClass().getClassLoader().getResourceAsStream("logo-email.png")), file.toPath());
        }

        params.put("logo", PHOTO_PATH);
        Connection connection = DataSourceUtils.getConnection(dataSource);

        try {
            InputStream stream = this.getClass().getClassLoader().getResourceAsStream("report/" + reportName);
            print = JasperFillManager.fillReport(stream, params, connection);

        } catch (Exception ex) {
            log.info("Error al generar reporte: " + ex.getMessage());
        }
        return print;
    }

    private Object getStreamContentFromOutputStream(ByteArrayOutputStream os, String contentType, String nameFile) {
//        InputStream is = new ByteArrayInputStream(os.toByteArray());
//        return new DefaultStreamedContent(is, contentType, nameFile);
        //todo
        return null;
    }

    public Object downloadPdf(JasperPrint jasperPrint, String filename) throws JRException, IOException {
        if (jasperPrint == null) {
            throw new CustomException("Error al generar reporte");
        }
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, os);
        os.flush();
        os.close();
        return getStreamContentFromOutputStream(os, MediaType.APPLICATION_PDF_VALUE, filename + ".pdf");
    }

    public void openPdf(JasperPrint jasperPrint, String filename) throws JRException, IOException {
        servletPdf(jasperPrint, filename, false);
    }

    private void servletPdf(JasperPrint jasperPrint, String filename, boolean download) throws JRException, IOException {
        if (jasperPrint == null) {
            throw new CustomException("Error al generar reporte");
        }
        //todo
//        HttpServletResponse httpServletResponse = (HttpServletResponse) FacesContext.getCurrentInstance().getExternalContext().getResponse();
//        if (download) {
//            httpServletResponse.addHeader("Content-disposition", "attachment; filename=" + filename + ".pdf");
//        } else {
//            httpServletResponse.setContentType("application/pdf");
//            httpServletResponse.addHeader("Content-disposition", "inline; filename=" + filename + ".pdf");
//        }
//
//        ServletOutputStream servletOutputStream = httpServletResponse.getOutputStream();
//        JasperExportManager.exportReportToPdfStream(jasperPrint, servletOutputStream);
//
    }


    public Object openExcel(JasperPrint jasperPrint, String filename) throws JRException, IOException {
        if (jasperPrint == null) {
            throw new CustomException("Error al generar reporte");
        }
        ByteArrayOutputStream os = new ByteArrayOutputStream();


        JRXlsxExporter exporter = new JRXlsxExporter();
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(os));

        SimpleXlsxReportConfiguration configuration = new SimpleXlsxReportConfiguration();
        configuration.setOnePagePerSheet(true);
        configuration.setDetectCellType(true);
        configuration.setCollapseRowSpan(false);
        exporter.setConfiguration(configuration);
        exporter.exportReport();

        os.flush();
        os.close();
        //todo
        return getStreamContentFromOutputStream(os, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename + ".xlsx");
    }

    public void writeXlsxReport(JasperPrint jp, HttpServletResponse response, final String reportName) throws IOException, JRException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-disposition", "inline; filename=" + (reportName == null ? jp.getName() : reportName).replace('"', '_') + ".xlsx");

        JRXlsxExporter xlsxExporter = new JRXlsxExporter();
        ByteArrayOutputStream xlsReport = new ByteArrayOutputStream();

        xlsxExporter.setExporterInput(new SimpleExporterInput(jp));
        xlsxExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(xlsReport));
        xlsxExporter.exportReport();

        final byte[] rawBytes = xlsReport.toByteArray();
        response.setContentLength(rawBytes.length);

        final ByteArrayInputStream bais = new ByteArrayInputStream(rawBytes);
        final OutputStream outStream = response.getOutputStream();
        IOUtils.copy(bais, outStream);

        outStream.flush();

        IOUtils.closeQuietly(xlsReport);
        IOUtils.closeQuietly(bais);
        IOUtils.closeQuietly(outStream);
    }

    //MétodoSam
    public void writePdfReport(JasperPrint jp, HttpServletResponse response, final String reportName) throws IOException, JRException {
        response.setContentType("application/pdf");
        response.setHeader("Content-disposition", "inline; filename=" + (reportName == null ? jp.getName() : reportName).replace('"', '_') + ".pdf");

        OutputStream outStream = response.getOutputStream();
        final byte[] pdfBytes = JasperExportManager.exportReportToPdf(jp);

        response.setContentLength(pdfBytes.length);
        final ByteArrayInputStream bais = new ByteArrayInputStream(pdfBytes);
        IOUtils.copy(bais, outStream);

        outStream.flush();

        IOUtils.closeQuietly(bais);
        IOUtils.closeQuietly(outStream);
    }
}
