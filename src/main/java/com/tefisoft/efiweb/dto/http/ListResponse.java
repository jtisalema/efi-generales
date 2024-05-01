package com.tefisoft.efiweb.dto.http;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ListResponse<T extends Serializable> implements Serializable {
    private static final long serialVersionUID = -2967448659354282167L;
    private List<T> values;
}
