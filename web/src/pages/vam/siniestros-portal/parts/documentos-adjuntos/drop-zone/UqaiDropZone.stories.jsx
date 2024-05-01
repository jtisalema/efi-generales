import {UqaiDropZone} from "./UqaiDropZone";
import {Field, Formik} from "formik";
import {LoadingContextProvider} from "../context/LoadingContextProvider";

export default {
    title: "UQAI/UqaiDropZone",
    component: UqaiDropZone,
}

const initialValues = {file: {}};

const Template = (args) =>
    <LoadingContextProvider>
        <Formik initialValues={initialValues} onSubmit={null}>
            <Field name={"dropzoneStory"} component={UqaiDropZone} {...args}/>
        </Formik>
    </LoadingContextProvider>

export const Default = Template.bind({});
Default.args = {
    name: "file",
    label: "Subir archivo",
}