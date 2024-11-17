import styles from "@styles/CardMini.module.scss";
import cns from "@utils/classNames";
import { useState } from "react";

const CardMini = (props) => {
	const { item, isDefaultSelected, handleItemOfferSelected, selectedOfferedItems } = props;

	const [cardStateHover, setCardStateHover] = useState(false);

	const handleCardHover = (e) => {
		setCardStateHover(!cardStateHover);
	};

	const handleCardClick = (e) => {
		if (handleItemOfferSelected) handleItemOfferSelected(e, item);
	};

	return (
		<>
			<div
				className={cns(styles["cardMini"], {
					[styles["cardSelected"]]: isDefaultSelected,
					[styles["cardHovered"]]: cardStateHover,
				})}
				onMouseEnter={(e) => {
					handleCardHover(e);
				}}
				onMouseLeave={(e) => {
					handleCardHover(e);
				}}
				onClick={(e) => {
					handleCardClick(e);
				}}
			>
				{item.images && (
					<div className={styles["thumbnail"]}>
						<img src={item.images[0]} className={styles["thumbnailIMG"]} alt="Item Cover Image" />
					</div>
				)}
				<div className={styles["content"]}>
					<span className={styles["primary"]}>{item.name}</span>
				</div>
			</div>
		</>
	);
};

export default CardMini;
