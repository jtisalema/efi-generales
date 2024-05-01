package com.tefisoft.efiweb.dto.http;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ListRequest<T extends Serializable> implements Serializable {
    private static final long serialVersionUID = -4899302958391026907L;
    private List<T> values;
}
