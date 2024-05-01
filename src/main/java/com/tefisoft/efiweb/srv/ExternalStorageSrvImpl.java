package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tefisoft.efiweb.exc.StorageException;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.StatObjectArgs;
import io.minio.http.Method;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@Service
@CommonsLog
public class ExternalStorageSrvImpl implements ExternalStorageSrv {

    private final String bucket;

    private final MinioClient minioClient;
    private static final int PUBLIC_MAX_AGE = 14400; // 4h*60*minutos*60segundos
    private static final int PRIVATE_MAX_AGE = 10800; // 180min*60segundos
    private final ObjectMapper mapper = new ObjectMapper();

    public ExternalStorageSrvImpl(@Value("${app.minio.url}") String server, @Value("${app.minio.accessKey}") String accessKey, @Value("${app.minio.secretKey}") String secretKey, @Value("${app.minio.bucket}") String bucket) {
        this.minioClient = MinioClient.builder()
                .endpoint(server)
                .credentials(accessKey, secretKey)
                .build();
        this.bucket = bucket;
    }

    @PostConstruct
    public void bucketExiste() {
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!found) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucket)
                                .build());
            }
        } catch (Exception ex) {
            log.error("error in bucketExiste", ex);
            //throw new StorageException(ex.getMessage());
        }
    }

    @Override
    public void store(String uri, MultipartFile file) {
        // bucket ya debe estar creado
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(uri)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());
        } catch (Exception ex) {
            log.error("error on store MultipartFile", ex);
            throw new StorageException(ex.getMessage());
        }
    }

    @Override
    public void store(String uri, Resource file, String contentType) {
        // bucket ya debe estar creado
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(uri)
                            .stream(file.getInputStream(), file.contentLength(), -1)
                            .contentType(contentType)
                            .build());
        } catch (Exception ex) {
            log.error("error on store Resource file", ex);
            throw new StorageException(ex.getMessage());
        }
    }

    public void store(String uri, Resource file) {
        store(uri, file, "image/png");
    }

    @Override
    public void store(String uri, InputStream file, long size) {
        try {
            Path path = new File(uri).toPath();
            String mimeType = Files.probeContentType(path);
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(uri)
                            .stream(file, size, -1)
                            .contentType(mimeType)
                            .build());
        } catch (Exception ex) {
            log.error("error on store InputStream", ex);
            throw new StorageException(ex.getMessage());
        }
    }

    @Override
    public void copy(String objOrigin, String bucketOrigin, String objCopy, long size) {
        try {
            log.info("Descargando" + objOrigin);
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketOrigin)
                            .object(objOrigin)
                            .build());
            log.info("Volviendo a guardar el" + objCopy);
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objCopy)
                            .stream(stream, size, -1)
                            .build());
        } catch (Exception ex) {
            log.error("error on copy file", ex);
            throw new StorageException(ex.getMessage());
        }
    }

    @Override
    public String loadPublicUrl(String uri, int maxAge) {
        return loadPublicUrl(uri, PUBLIC_MAX_AGE, false, null);
    }

    @Override
    public String loadPublicUrl(String uri, int maxAge, boolean cdn, Map<String, String> headers) {
        try {
            var builder = GetPresignedObjectUrlArgs.builder().method(Method.GET).expiry(maxAge).bucket(bucket).object(uri);
            if (cdn) {
                if (headers == null) {
                    headers = new HashMap<>();
                }
                if (!headers.containsKey("max-age"))
                    headers.put("max-age", String.valueOf(maxAge));
                if (!headers.containsKey("cache-control"))
                    headers.put("cache-control", "public, max-age=" + maxAge);
            }
            if (headers != null) {
                builder.extraQueryParams(headers);
            }
            return minioClient.getPresignedObjectUrl(builder.build());
        } catch (Exception ex) {
            log.error("error on loadPublicUrl :: " + ex.getMessage());
            throw new StorageException(ex.getMessage());
        }
    }

    @Override
    public String loadCdnUrl(String uri, int maxAge) {
        return loadPublicUrl(uri, PUBLIC_MAX_AGE, true, null);
    }

    public String loadPublicUrl(String uri) {
        return loadPublicUrl(uri, PUBLIC_MAX_AGE, true, null);
    }


    @Override
    public String loadPrivateUrl(String uri, Map<String, String> headers) {
        headers.put("Cache-Control", "no-cache");
        return loadPublicUrl(uri, PRIVATE_MAX_AGE, false, headers);
    }

    @Override
    public void delete(String obj) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder().bucket(bucket).object(obj).build());
        } catch (Exception ex) {
            log.error("error on remove file", ex);
        }
    }

    @Override
    public boolean fileExists(String uri) {
        try {
            var obj = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucket)
                            .object(uri)
                            .build());
            if (obj.object() != null && obj.size() > 0) {
                return true;
            }
        } catch (Exception ignore) {
            // ignore
        }
        return false;
    }

    @Override
    public ObjectNode getJson(String name) {
        try {
            log.info("Descargando:: " + name);
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(name)
                            .build());
            ObjectReader reader = mapper.reader();
            ObjectNode obj = (ObjectNode) reader.readTree(stream);
            stream.close();
            return obj;
        } catch (Exception ex) {
            log.error("Error al descargar archivo ", ex);
            throw new StorageException(ex.getMessage());
        }
    }
}
