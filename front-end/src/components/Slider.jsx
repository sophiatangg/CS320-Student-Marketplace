import styles from "@styles/Slider.module.scss";
import cns from "@utils/classNames";
import React, { useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const Slider = (props) => {
	const { selectedItem, setSelectedItem, allItems, incrementCarousel, decrementCarousel, carouselState, setCarouselState } = props;

	const slideRef = React.createRef();
	const slideChildrenRef = React.createRef();
	const location = useLocation();

	useEffect(() => {
		const selectedGameIndex = allItems.findIndex((_item) => "/store/" + _item.surname === location.pathname);
		setSelectedItem(allItems[selectedGameIndex]);
	}, []);

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

	const properties = {
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

	return (
		<div className={styles["slider"]}>
			<Slide ref={slideRef} {...properties}>
				{selectedItem
					? selectedItem.footage.map((each, index) => (
							<div key={index} className={styles["slide"]}>
								<img className={styles["currentImg"]} src={each} alt="sample" />
							</div>
						))
					: selectedItem.footage.map((each, index) => (
							<div key={index} className={styles["slide"]}>
								<img className={styles["currentImg"]} src={each} alt="sample" />
							</div>
						))}
			</Slide>
			{selectedItem.footage.length > 1 && (
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
					<div className={styles["selectorContainer"]}>
						{selectedItem.footage.map((item, itemIndex) => {
							return (
								<button
									key={itemIndex}
									id="0"
									onClick={(e) => {
										handleJumpToIndex(itemIndex);
									}}
									className={cns(styles["button"], {
										[styles["buttonSelected"]]: carouselState === itemIndex,
									})}
									aria-label="Jump to picture"
								/>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default Slider;
