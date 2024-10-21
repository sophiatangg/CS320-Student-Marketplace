import filterNames from "@/utils/filterNames";
import styles from "@styles/Filters.module.scss";
import { useState } from "react";
import { FaBroomBall, FaGun, FaMasksTheater, FaPuzzlePiece } from "react-icons/fa6";
import { GiPunch, GiRaceCar } from "react-icons/gi";
import { IoAmericanFootball } from "react-icons/io5";
import { PiStrategyFill } from "react-icons/pi";
import { SiWish } from "react-icons/si";

const Filters = (props) => {
	const { handleHover, handleFilterSelect, currentFilter } = props;

	const [hoverStates, setHoverStates] = useState(Array(filterNames.length).fill(false));

	const handleItemHover = (index, isHover) => {
		setHoverStates((prev) => {
			return prev.map((hover, i) => {
				return i === index ? isHover : hover;
			});
		});
	};

	const renderFilterSVG = (filterName, isHover) => {
		const style = { width: 30, height: 30, fill: isHover ? "#000000" : "#fff" };

		switch (filterName) {
			case "Action":
				return <GiPunch className={styles["filterSVG"]} style={style} />;
			case "Strategy":
				return <PiStrategyFill className={styles["filterSVG"]} style={style} />;
			case "RPG":
				return <FaMasksTheater className={styles["filterSVG"]} style={style} />;
			case "Shooter":
				return <FaGun className={styles["filterSVG"]} style={style} />;
			case "Adventure":
				return <FaBroomBall className={styles["filterSVG"]} style={style} />;
			case "Puzzle":
				return <FaPuzzlePiece className={styles["filterSVG"]} style={style} />;
			case "Racing":
				return <GiRaceCar className={styles["filterSVG"]} style={style} />;
			case "Sports":
				return <IoAmericanFootball className={styles["filterSVG"]} style={style} />;
			default:
				break;
		}
	};

	return (
		<div className={styles["filters"]}>
			<h2>Filters</h2>

			<div className={styles["globalFilters"]}>
				<div
					className={styles["filterDiv"]}
					id="0"
					onMouseEnter={() => {
						handleItemHover(0, true);
						handleHover();
					}}
					onMouseLeave={() => {
						handleItemHover(0, false);
						handleHover();
					}}
					onClick={handleFilterSelect}
				>
					<button
						className={styles["filterBtn"]}
						style={{ backgroundColor: hoverStates[0] ? "#fff" : "#2d2d2d" }}
						aria-label="Open wishlist"
					>
						<SiWish style={{ width: 30, height: 30, fill: hoverStates[0] ? "#000000" : "#fff" }} className={styles["Wishlist"]} />
					</button>
					Wishlist
				</div>
			</div>

			<div className={styles["genreFilters"]}>
				<h2>Genres</h2>

				{filterNames.slice(1).map((filter, filterIndex) => {
					const currentIndex = filterIndex + 1;
					return (
						<div
							key={currentIndex}
							id={currentIndex}
							className={styles["filterDiv"]}
							onMouseEnter={() => handleItemHover(currentIndex, true)}
							onMouseLeave={() => handleItemHover(currentIndex, false)}
							onClick={handleFilterSelect}
						>
							<button
								className={styles["filterBtn"]}
								style={{ backgroundColor: hoverStates[currentIndex] ? "#fff" : "#2d2d2d" }}
								aria-label={`Show ${filter.toLowerCase()} genre`}
							>
								{renderFilterSVG(filter, hoverStates[currentIndex])}
							</button>
							{filter}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Filters;
