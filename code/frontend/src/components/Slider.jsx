import { useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/Slider.module.scss";
import cns from "@utils/classNames";
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const Slider = (props) => {
	const { carouselState, setCarouselState } = props;

	const { selectedItem } = useContextSelector("itemsStore");

	const slideRef = React.createRef();
	const slideChildrenRef = React.createRef();

	const handlePageButtonBack = () => {
		if (carouselState > 0) {
			setCarouselState(carouselState - 1);
		} else {
			setCarouselState(3);
		}
		slideRef.current.goBack();
	};

	const handlePageButtonNext = () => {
		if (carouselState < 3) {
			setCarouselState(carouselState + 1);
		} else {
			setCarouselState(0);
		}
		slideRef.current.goNext();
	};

	const handleJumpToIndex = (index) => {
		setCarouselState(index);
		slideRef.current.goTo(index);
	};

	const sliderProperties = {
		children: slideChildrenRef,
		duration: 6000,
		autoplay: false,
		transitionDuration: 800,
		arrows: false,
		infinite: true,
		easing: "ease",
		cssClass: styles["slideElem"],
		onChange: (index) => {
			setCarouselState(index);
		},
	};

	const renderThumbnailPreviews = () => {
		if (selectedItem.images.length < 1) return null;

		return (
			<div className={styles["selectorContainer"]}>
				{selectedItem.images.map((item, itemIndex) => {
					return (
						<div
							key={itemIndex}
							id={itemIndex + 1}
							onClick={(e) => {
								handleJumpToIndex(itemIndex);
							}}
							className={cns(styles["button"], {
								[styles["buttonSelected"]]: carouselState === itemIndex,
							})}
							aria-label="Jump to picture"
						>
							<div className={styles["image"]} style={{ backgroundImage: `url(${item})` }} />
						</div>
					);
				})}
			</div>
		);
	};

	if (!selectedItem || !selectedItem.images) {
		return <div className={styles["emptySlider"]}></div>;
	}

	return (
		<div className={styles["slideContainer"]}>
			<div className={styles["slider"]}>
				<Slide ref={slideRef} {...sliderProperties}>
					{selectedItem
						? selectedItem.images.map((each, index) => {
								return (
									<div key={index} className={styles["slide"]}>
										<img className={styles["currentImg"]} src={each} alt="sample" />
									</div>
								);
							})
						: selectedItem.images.map((each, index) => {
								return (
									<div key={index} className={styles["slide"]}>
										<img className={styles["currentImg"]} src={each} alt="sample" />
									</div>
								);
							})}
				</Slide>
				{selectedItem.images.length > 1 && (
					<>
						<div className={styles["pageButtons"]}>
							<button
								className={cns(styles["pageButton"], styles["backwards"])}
								id="22"
								aria-label="Previous Picture"
								onClick={handlePageButtonBack}
							>
								<FaChevronLeft style={{ width: 30, height: 30 }} />
							</button>
							<button
								className={cns(styles["pageButton"], styles["forward"])}
								id="23"
								aria-label="Next Picture"
								onClick={handlePageButtonNext}
							>
								<FaChevronRight style={{ width: 30, height: 30 }} />
							</button>
						</div>
					</>
				)}
			</div>
			{renderThumbnailPreviews()}
		</div>
	);
};

export default Slider;
