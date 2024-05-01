package com.tefisoft.efiweb.srv;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Map;

public interface ExternalStorageSrv {
    void store(String uri, MultipartFile file);
    void store(String uri, Resource file, String contentType);

    void store(String uri, InputStream inputStream, long size);

    void copy(String obj, String bucket, String objCopy, long size);

    String loadPublicUrl(String uri, int maxAge);

    String loadPublicUrl(String uri, int maxAge, boolean cdn, Map<String, String> headers);

    String loadPrivateUrl(String uri, Map<String, String> headers);

    String loadCdnUrl(String uri, int maxAge);

    void delete(String obj);

    boolean fileExists(String uri);

    ObjectNode getJson(String name);
}
