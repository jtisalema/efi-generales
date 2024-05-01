package com.tefisoft.efiweb.util;

import com.tefisoft.efiweb.exc.CustomException;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

public final class JdbcUtilities {
    private JdbcUtilities() {
    }

    public static String loadQuery(String name) {
        return getResourceFileAsString("sql/" + name + ".sql");
    }

    public static String getResourceFileAsString(String fileName) {
        InputStream is = getResourceFileAsInputStream(fileName);
        if (is != null) {
            var reader = new BufferedReader(new InputStreamReader(is));
            return reader.lines().collect(Collectors.joining(System.lineSeparator()));
        } else {
            throw new CustomException("resource not found");
        }
    }

    public static InputStream getResourceFileAsInputStream(String fileName) {
        ClassLoader classLoader = HelperUtil.class.getClassLoader();
        return classLoader.getResourceAsStream(fileName);
    }
}

