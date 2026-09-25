import React, { useState } from "react";
import Modal from "./Modal";

const PropertyImg = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const availableImages = images?.filter((image) => image?.url) || [];
  const galleryImages =
    availableImages.length > 0
      ? availableImages
      : [{ url: "/assets/template.jpeg" }];

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="property-img-container">
        {galleryImages.slice(0, 4).map((image, index) => (
          <div className="img-item" key={`${image.url}-${index}`}>
            <img
              src={image.url}
              className="images"
              style={
                index === 0
                  ? {
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    }
                  : undefined
              }
              alt={`property-${index + 1}`}
            />
          </div>
        ))}
        {galleryImages.length > 4 && (
          <div>
            <img
              className="images"
              src={galleryImages[4].url}
              alt="property-last"
              style={{ borderBottomRightRadius: "10px" }}
            />
            {availableImages.length > 0 && (
              <button className="similar-photos" onClick={handleShowAllPhotos}>
                <span className="material-symbols-outlined">photo_library</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="similar-photos-container"></div>
      {isModalOpen && (
        <Modal images={galleryImages} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default PropertyImg;
