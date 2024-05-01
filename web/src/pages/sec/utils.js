import * as yup from "yup";
import {MSM_REQUIRED} from "../../util/General";

export const v_reset = yup.object().shape({
    user: yup.string().required(MSM_REQUIRED),
});