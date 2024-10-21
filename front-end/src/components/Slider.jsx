import styles from "@styles/Slider.module.scss";
import templateGame from "@utils/templateGame";
import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const Slider = (props) => {
	const { selectedGame, setSelectedGame, allGames, incrementCarousel, decrementCarousel, carouselState, setCarouselState, handleHover } = props;

	const slideRef = React.createRef();
	const location = useLocation();

	const [footageIndex, setFootageIndex] = useState(0);
	const [isHover, setIsHover] = useState(false);

	useEffect(() => {
		const selectedGameIndex = allGames.findIndex((game) => "/react-ecommerce-store/games/" + game.surname === location.pathname);
		setSelectedGame(allGames[selectedGameIndex]);
	}, []);

	const properties = {
		duration: 6000,
		autoplay: false,
		transitionDuration: 800,
		arrows: false,
		infinite: true,
		easing: "ease",
	};

	const slideImages = [
		selectedGame ? selectedGame.footage[0] : null,
		selectedGame ? selectedGame.footage[1] : null,
		selectedGame ? selectedGame.footage[2] : null,
		selectedGame ? selectedGame.footage[3] : null,
	];

	const templateImages = [templateGame.footage[0], templateGame.footage[1], templateGame.footage[2], templateGame.footage[3]];

	const back = () => {
		if (carouselState > 0) {
			setCarouselState(carouselState - 1);
		} else {
			setCarouselState(3);
		}
		slideRef.current.goBack();
	};

	const next = () => {
		if (carouselState < 3) {
			setCarouselState(carouselState + 1);
		} else {
			setCarouselState(0);
		}
		slideRef.current.goNext();
	};

	const jumpToIndex = (e) => {
		console.log(e.target.id);
		let index = parseInt(e.target.id);
		console.log(index);
		setCarouselState(index);
		slideRef.current.goTo(index);
	};

	return (
		<div className={styles["slider"]}>
			<Slide ref={slideRef} {...properties}>
				{selectedGame
					? slideImages.map((each, index) => (
							<div key={index} className={styles["slide"]}>
								<img className={styles["currentImg"]} src={each} alt="sample" />
							</div>
						))
					: templateImages.map((each, index) => (
							<div key={index} className={styles["slide"]}>
								<img className={styles["currentImg"]} src={each} alt="sample" />
							</div>
						))}
			</Slide>

			<button
				className={styles["backwards"]}
				onClick={back}
				id="22"
				onMouseEnter={handleHover}
				onMouseLeave={handleHover}
				aria-label="Previous Picture"
			>
				<FaChevronLeft className={styles["left"]} style={{ width: 30, height: 30, fill: isHover ? "#fff" : "#ccc" }} />
			</button>

			<button
				className={styles["forward"]}
				onClick={next}
				id="23"
				onMouseEnter={handleHover}
				onMouseLeave={handleHover}
				aria-label="Next Picture"
			>
				<FaChevronRight className={styles["right"]} style={{ width: 30, height: 30, fill: isHover ? "#fff" : "#ccc" }} />
			</button>
			<div className={styles["selectorContainer"]}>
				<button
					id="0"
					onClick={jumpToIndex}
					className={carouselState === 0 ? styles["buttonSelected"] : styles["button"]}
					aria-label="Jump to picture"
				></button>
				<button
					id="1"
					onClick={jumpToIndex}
					className={carouselState === 1 ? styles["buttonSelected"] : styles["button"]}
					aria-label="Jump to picture"
				></button>
				<button
					id="2"
					onClick={jumpToIndex}
					className={carouselState === 2 ? styles["buttonSelected"] : styles["button"]}
					aria-label="Jump to picture"
				></button>
				<button
					id="3"
					onClick={jumpToIndex}
					className={carouselState === 3 ? styles["buttonSelected"] : styles["button"]}
					aria-label="Jump to picture"
				></button>
			</div>
		</div>
	);
};

export default Slider;
