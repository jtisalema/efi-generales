import {ButtonModal} from "./ButtonModal";

export default {
    title: "UQAI/ButtonModal",
    component: ButtonModal,
}

const Template = (args) => <ButtonModal {...args}/>

export const Default = Template.bind({});
Default.args = {
    label: "Agregar documentos"
}