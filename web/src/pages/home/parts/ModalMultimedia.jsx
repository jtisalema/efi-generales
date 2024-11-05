import { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { UqaiModalHeader } from "../../../components/UqaiModal";

const isVideo = (item) => item?.tipo === 'VIDEO';

export const ModalMultimedia = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(prev => !prev);

    if (!item.show) return null;

    if (!item.url?.includes('youtube'))
        return <>
            <div className="video-container ml-2 mr-2">
                <video width="100%" height="10%" controls autoPlay muted style={{ maxHeight: 250 }}>
                    <source src={item.url} type="video/mp4" />
                    Su navegador no soporta la etiqueta de video.
                </video>
            </div>
        </>
    else
        return <>
            <MediaThumbnail item={item} onClick={toggleModal} />
            <Modal className="media-modal" contentClassName="bg-transparent border-0" isOpen={isModalOpen}
                toggle={toggleModal} size={"xl"} centered>
                <UqaiModalHeader toggle={toggleModal} />
                <ModalBody className="p-0">
                    <div className={`rounded-3 overflow-hidden ${isVideo(item) ? ' ratio ratio-16x9' : ''}`}>
                        <MediaContent item={item} />
                    </div>
                </ModalBody>
            </Modal>
        </>
}

const MediaThumbnail = ({ item, onClick }) => {
    return (
        <div className={`media-thumbnail media-${isVideo(item) ? 'video' : 'image'}`} onClick={onClick} role="button"
            aria-label="multimedia">
            {isVideo(item) && <i className="icon-uqai uqai-video fs-3" />}
            <span
                className="media-label text-success fw-semibold fs-7">{`VER ${isVideo(item) ? 'VIDEO' : 'FOTO'}`}</span>
            <MediaContent item={item} />
        </div>
    );
}

const MediaContent = ({ item }) => {
    let iframeProps = { allow: '' };
    if (item?.url?.includes('youtube'))
        iframeProps.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;";

    return (
        <div className="media-content d-flex justify-content-center align-self-center">
            {isVideo(item) ?
                <iframe src={item.url} {...iframeProps} />
                :
                <img src={item.url} alt="multimedia" />
            }
        </div>
    );
}