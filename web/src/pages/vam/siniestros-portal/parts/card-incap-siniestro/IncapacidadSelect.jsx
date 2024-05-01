import { useFormikContext } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { routes } from "../../../../gen/UtilsGeneral";
import sha256 from "crypto-js/sha256";
import debounce from "lodash.debounce";
import { UqaiField } from "../../../../../components/UqaiField";
import AsyncSelect from "react-select/async";
import UqaiTooltip from "../../../../../components/UqaiTooltip";

export function IncapacidadSelect({ alert, setIncapacidad, incapacidad }) {
  const values = useFormikContext().values;
  const [incapacidades, setIncapacidades] = useState([]);
  const isAlcance = values.alcance === "S";
  const formik = useFormikContext();
  const [search, setSearch] = useState("");

  const getIncapacidades = (value, callback) => {
    if (value?.trim()?.length > 1) {
      let body = {
        name: value?.trim()?.toUpperCase(),
      };
      setSearch(value);
      axios
        .post(routes.api + "/siniestros-portal/incapacidades", body)
        .then((resp) => {
          let data = resp.data;
          data.forEach((p) => {
            p.label = p.nmIncapacidad;
            p.value = p.cdIncapacidad;
          });
          data.sort((p1, p2) => p1.label.localeCompare(p2.label));
          callback(data);
          setIncapacidades(data);
        })
        .catch((error) => {
          alert.current.show_error("Error al consultar " + error);
        });
    } else {
      callback([]);
      setIncapacidades([]);
      setSearch("");
    }
  };

  function fetchSiniestros(
    cdAseguradora,
    cdAsegurado,
    cdRamoCotizacion,
    cdCompania
  ) {
    axios
      .post(routes.apiVam + "/siniestros-portal/listar-liquidados-vigentes", {
        cdAseguradora,
        cdAsegurado,
        cdRamoCotizacion,
        cdCompania,
      })
      .then((resp) => {
        let data = resp.data;
        data.forEach((p) => {
          p.label = `${p.nmIncapacidad}`;
          p.value = sha256(
            `${p.cdCompania}-${p.cdReclamo}-${p.cdIncapacidad}`
          ).toString();
        });
        data.sort((p1, p2) => p1.label.localeCompare(p2.label));
        setIncapacidades(data);
      })
      .catch((error) => {
        alert.current.show_error("Error al consultar " + error);
      });
  }

  useEffect(() => {
    if (
      isAlcance &&
      (!values.cdAseguradora || !values.cdAsegurado || !values.cdRamoCotizacion)
    ) {
      //es alcance pero no hay aseguradora, o asegurado, o RC
      formik.setFieldValue("cdIncapacidadHash", "");
      formik.setFieldValue("cdIncapacidad", "");
      formik.setFieldValue("cdReclamo", null);
      formik.setFieldValue("cdObjSiniestro", null);
      formik.setFieldValue("item", 0);
      setIncapacidad(null);
      setIncapacidades(null);
    }

    if (
      values.cdAseguradora &&
      values.cdAsegurado &&
      values.cdRamoCotizacion &&
      isAlcance
    ) {
      fetchSiniestros(
        values.cdAseguradora,
        values.cdAsegurado,
        values.cdRamoCotizacion,
        values.cdCompania
      );
    }
  }, [
    values.cdAseguradora,
    values.cdAsegurado,
    values.cdRamoCotizacion,
    values.cdCompania,
    isAlcance,
  ]);

  const debouncedChangeHandler = useCallback(
    debounce(getIncapacidades, 600),
    []
  );

  if (isAlcance) {
    return (
      <div className="col-md-4">
        <IncapacidadLabel input={true} />
        <UqaiField
          type={"text"}
          name={"cdIncapacidadHash"}
          component={"select"}
          onChange={(e) => {
            let item = incapacidades.find((x) => x.value === e.target.value);
            formik.setFieldValue("cdIncapacidadHash", e.target.value);
            formik.setFieldValue("cdIncapacidad", item.cdIncapacidad);
            formik.setFieldValue("cdReclamo", item.cdReclamo);
            formik.setFieldValue("cdObjSiniestro", item.cdObjSiniestro);
            formik.setFieldValue("item", parseInt(item.item) + 1);
            setIncapacidad({
              value: e.target.value,
              label: item.nmIncapacidad,
            });
          }}
          className="form-select"
        >
          <option value={""} key={""} disabled selected>
            {"--Seleccione--"}
          </option>
          {(incapacidades || []).map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </UqaiField>
        <span>
          <b>{"Nota:"}</b>
          {
            " Si requiere ingresar un diagnóstico que no encuentra, por favor notificar a su Ejecutivo"
          }
        </span>
      </div>
    );
  }

  return (
    <div className="col-md-4">
      <IncapacidadLabel input={true} />
      <UqaiField
        type={"text"}
        name={"cdIncapacidad"}
        component={AsyncSelect}
        isClearable={true}
        loadOptions={debouncedChangeHandler}
        value={incapacidad}
        isDisabled={values.numSiniestro}
        placeholder="Escriba para buscar"
        onChange={(e) => {
          formik.setFieldValue("cdIncapacidad", e?.value);
          //x si acaso este jugando con alcance o new siniestro, pa q no se referencie mal
          formik.setFieldValue("cdReclamo", null);
          formik.setFieldValue("cdIncapacidadHash", "");
          setIncapacidad(e);
          setSearch(null);
        }}
        noOptionsMessage={() => {
          if (search && search.length > 2) {
            return "Sin resultados";
          } else {
            return "Escriba para buscar";
          }
        }}
        loadingMessage={() => "Cargando..."}
        classNamePrefix="react-select"
        className="react-select"
      />
      <span>
        <b>{"Nota:"}</b>
        {
          " Si requiere ingresar un diagnóstico que no encuentra, por favor notificar a su Ejecutivo"
        }
      </span>
    </div>
  );
}

export function IncapacidadLabel({ input }) {
  return (
    <label className="form-label fw-bold text-secondary fs-7">
      {"Incapacidad / Diagnóstico:"} {`${input ? "*" : ""}`}
      {input && (
        <UqaiTooltip message={"Incapacidad / Diagnóstico dado por un médico"} />
      )}
    </label>
  );
}
