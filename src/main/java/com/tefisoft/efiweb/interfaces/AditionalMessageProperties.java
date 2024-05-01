package com.tefisoft.efiweb.interfaces;

import java.util.Map;

@FunctionalInterface
public interface AditionalMessageProperties<T> {
   void putProperties(T item, Map<String, String> dataMessage);
}
