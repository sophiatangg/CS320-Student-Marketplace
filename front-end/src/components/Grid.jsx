import CardFull from "@components/CardFull";
import styles from "@styles/Grid.module.scss";
import cns from "@utils/classNames";

const Grid = (props) => {
	const { gridDisplay, handleCurrentHoveredItem, handleHoverItem, handleLike, handleSelectItem, handleTradeOpen, search, searching, shownItems } =
		props;

	return (
		<>
			<div
				className={cns(styles["gridContainer"], {
					[styles["withGrid"]]: gridDisplay && shownItems.length,
					[styles["noGrid"]]: !gridDisplay && shownItems.length,
					[styles["emptyGrid"]]: !shownItems.length,
				})}
				id="gridContainer"
			>
				{!shownItems.length && (
					<div className={styles["placeholder"]}>
						<h1>No items</h1>
					</div>
				)}
				{searching === false
					? shownItems.map((item, i) => {
							return (
								<CardFull
									key={i}
									item={item}
									handleCurrentHoveredItem={handleCurrentHoveredItem}
									handleHoverItem={handleHoverItem}
									handleLike={handleLike}
									handleSelectItem={handleSelectItem}
									handleTradeOpen={handleTradeOpen}
									isFullWidth={gridDisplay}
								/>
							);
						})
					: shownItems.map((item, i) => {
							if (item.name.toLowerCase().includes(search.toLowerCase())) {
								return (
									<CardFull
										key={i}
										item={item}
										handleCurrentHoveredItem={handleCurrentHoveredItem}
										handleHoverItem={handleHoverItem}
										handleLike={handleLike}
										handleSelectItem={handleSelectItem}
										handleTradeOpen={handleTradeOpen}
									/>
								);
							}
						})}
			</div>
		</>
	);
};

export default Grid;
