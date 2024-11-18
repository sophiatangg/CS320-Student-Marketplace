import { getUser } from "@database/users";
import styles from "@styles/CardMini.module.scss";
import cns from "@utils/classNames";
import { formatDateAgo } from "@utils/formatDate";
import { useEffect, useState } from "react";

const CardMini = (props) => {
	const { item, isDefaultSelected, handleItemOfferSelected, selectedOfferedItems } = props;

	const [itemOwner, setItemOwner] = useState("");
	const [itemCreateDate, setItemCreatedDate] = useState("");
	const [cardStateHover, setCardStateHover] = useState(false);

	const handleCardHover = (e) => {
		setCardStateHover(!cardStateHover);
	};

	const handleCardClick = (e) => {
		if (handleItemOfferSelected) handleItemOfferSelected(e, item);
	};

	useEffect(() => {
		if (!item && !item.hasOwnProperty("seller_id")) return;

		getUser(item.seller_id)
			.then((res) => {
				setItemOwner(res);
			})
			.catch((error) => {
				throw Error(`Error fetching item owner for ${item.name}.`, error);
			});
	}, []);

	useEffect(() => {
		if (!item && !item.hasOwnProperty("created_at")) return;

		const resDateStr = formatDateAgo({ date: item.created_at });
		setItemCreatedDate(resDateStr);
	}, []);

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
					<div className={styles["itemName"]}>
						<span className={styles["itemValue"]}>{item.name}</span>
					</div>
					<div className={styles["itemSeller"]}>
						<span className={styles["itemLabel"]}>Posted by:</span>
						<span className={styles["itemValue"]}>{itemOwner.name}</span>
					</div>
					<div className={styles["itemCreated"]}>
						<span className={styles["itemLabel"]}>Date Posted:</span>
						<span className={styles["itemValue"]}>{itemCreateDate}</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default CardMini;
