import Card from "@components/Card";
import styles from "@styles/Grid.module.scss";
import { useEffect } from "react";

const Grid = (props) => {
	const { shownGames, handleLike, handleHoverGame, handleAddToCart, grid, search, searching, handleSelectGame, cartDisplayed } = props;

	useEffect(() => {
		if (grid === false) {
			if (document.getElementsByClassName("gridContainer")) {
				let grid = document.getElementById("gridContainer");
				grid.className = styles["noGrid"];
			}
		} else if (grid) {
			if (document.getElementById("gridContainer").className === styles["noGrid"]) {
				let grid = document.getElementById("gridContainer");
				grid.className = styles["gridContainer"];
			}
		}
	}, [grid]);

	return (
		<>
			<div className={styles["gridContainer"]} id="gridContainer">
				{searching === false
					? cartDisplayed
						? shownGames.map((game, i) => {
								if (i <= 7) {
									return (
										<Card
											game={game}
											key={game.name}
											handleLike={handleLike}
											handleHoverGame={handleHoverGame}
											handleAddToCart={handleAddToCart}
											handleSelectGame={handleSelectGame}
										/>
									);
								}
							})
						: shownGames.map((game, i) => {
								return (
									<Card
										game={game}
										key={game.name}
										handleLike={handleLike}
										handleHoverGame={handleHoverGame}
										handleAddToCart={handleAddToCart}
										handleSelectGame={handleSelectGame}
									/>
								);
							})
					: shownGames.map((game, i) => {
							if (game.name.toLowerCase().includes(search.toLowerCase())) {
								return (
									<Card
										game={game}
										key={game.name}
										handleLike={handleLike}
										handleHoverGame={handleHoverGame}
										handleAddToCart={handleAddToCart}
										handleSelectGame={handleSelectGame}
									/>
								);
							}
						})}
			</div>
		</>
	);
};

export default Grid;
