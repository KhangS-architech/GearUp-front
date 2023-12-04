import React, { useState } from "react";
import styled from "styled-components";

export default function ProductImages({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const maxVisibleImages = 4;

  const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
    
  `;
  const ImageButtons = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
  `;

  const ImageButton = styled.div`
    height: 70px;
    width: 70px;
  `;

  const ArrowsContainer = styled.div`
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    z-index: 1; 
  `;

  const ArrowButton = styled.button`
    width: 40px; 
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    font-size: 20px;
    color: #333; 
    background-color: #fff; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const LeftArrow = styled(ArrowButton)`
    margin-bottom: 70px;
    left: 10px; 
    
  `;

  const RightArrow = styled(ArrowButton)`
    margin-left: 300px; 
    margin-bottom: 70px;
  `;

 

  const showPreviousImages = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const showNextImages = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const visibleImages = images.slice(
    currentImageIndex,
    currentImageIndex + maxVisibleImages
  );

  const handleMouseEnter = () => {
    setShowArrows(true);
  };

  const handleMouseLeave = () => {
    setShowArrows(false);
  };

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Image src={visibleImages[0]} />
        <ArrowsContainer>
          {showArrows && (
            <LeftArrow
              onClick={showPreviousImages}
              disabled={currentImageIndex === 0}
            >
              &#8592; 
            </LeftArrow>
          )}
          {showArrows && (
            <RightArrow
              onClick={showNextImages}
              disabled={currentImageIndex === images.length - 1}
            >
              &#8594; 
            </RightArrow>
          )}
        </ArrowsContainer>
      </div>
      <ImageButtons>
        {visibleImages.map((image, index) => (
          <ImageButton key={index}>
            <Image src={image} alt="" />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}
