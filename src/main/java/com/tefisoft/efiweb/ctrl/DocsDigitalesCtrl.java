package com.tefisoft.efiweb.ctrl;

import com.tefisoft.efiweb.dao.ClienteDAO;
import com.tefisoft.efiweb.entidad.BrkTClientes;
import com.tefisoft.efiweb.srv.DocDigitalSrv;
import com.tefisoft.efiweb.srv.DocsDigitalesSrv;
import com.tefisoft.efiweb.srv.PolizaService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

import static com.tefisoft.efiweb.util.HelperUtil.empty;

@RestController
@RequiredArgsConstructor
public class DocsDigitalesCtrl {
    private final DocsDigitalesSrv docsDigitalesSrv;
    private final ClienteDAO clienteDAO;
    private final DocDigitalSrv docDigitalSrv;
    private final PolizaService polizaService;

    @GetMapping(value = "/api/docs", params = {"tipo", "cdContratante", "id"})
    public Map<String, Object> getOne(@RequestParam String tipo, @RequestParam String cdContratante, @RequestParam String id,
                                      @RequestParam Integer cdRamo, @RequestParam Integer cdCompania, @RequestParam Integer cdRamoCotizacion,
                                      @RequestParam(required = false, defaultValue = "false") Boolean vam) {
        BrkTClientes clt = clienteDAO.findByCdCliente(Integer.valueOf(cdContratante));
        String nm = "";
        if (clt != null) {
            nm = empty(clt.getApCliente()) + " " + empty(clt.getNmCliente());
            nm = "-" + nm.trim().replace(" ", "-").replace("/", "-");
        }
        if (nm.endsWith(".")) {
            nm = StringUtils.chop(nm);
        }

        String path = File.separator + cdContratante + nm;
        String subCarpeta = docDigitalSrv.validarSubCarpeta(cdRamo, cdCompania, cdRamoCotizacion);
        String filterName = null;
        if (Boolean.TRUE.equals(vam)) {
            filterName = polizaService.buildFileNameVam(id, cdRamo, cdRamoCotizacion, cdCompania);
        }

        return docsDigitalesSrv.loadFiles(path, tipo, id, subCarpeta, filterName);
    }

    @SuppressWarnings("java:S1874")
    @GetMapping("/api/doc/{id}/{ext}")
    public void getFile(@PathVariable String id, @PathVariable String ext, HttpServletResponse response) {
        try {
            var file = docsDigitalesSrv.loadFile(id);
            switch (ext) {
                case "pdf":
                    response.setContentType(MediaType.APPLICATION_PDF_VALUE);
                    break;
                case "png":
                    response.setContentType(MediaType.IMAGE_PNG_VALUE);
                    break;
                case "jpeg":
                case "jpg":
                    response.setContentType(MediaType.IMAGE_JPEG_VALUE);
                    break;
                default:
                    response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
                    response.setHeader("Content-disposition", "inline; filename=" + file.getFilename());
                    break;
            }
            OutputStream outStream = response.getOutputStream();

            byte[] bytes = Files.readAllBytes(Paths.get(file.getURI()));
            final ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
            IOUtils.copy(bais, outStream);
            outStream.flush();
            IOUtils.closeQuietly(bais);
            IOUtils.closeQuietly(outStream);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
