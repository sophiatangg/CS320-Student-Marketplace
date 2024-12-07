import { getUser } from "@database/users";
import { useAuth } from "@providers/AuthProvider";
import styles from "@styles/CardMini.module.scss";
import cns from "@utils/classNames";
import { formatDateAgo } from "@utils/formatDate";
import { useEffect, useState } from "react";

const CardMini = (props) => {
	const { item, isDefaultSelected, handleItemOfferSelected, selectedOfferedItems, source } = props;

	const { currentUser } = useAuth();

	const [itemOwner, setItemOwner] = useState("");
	const [itemCreateDate, setItemCreatedDate] = useState("");
	const [cardStateHover, setCardStateHover] = useState(false);

	const handleCardHover = (e) => {
		setCardStateHover(!cardStateHover);
	};

	const handleCardClick = (e) => {
		if (!handleItemOfferSelected || !item) return;
		if (item.in_trade) return;

		handleItemOfferSelected(e, item);
	};

	useEffect(() => {
		if (!item || !item?.seller_id || item.isDataUnavailable) return;

		getUser(item?.seller_id)
			.then((res) => {
				setItemOwner(res);
			})
			.catch((error) => {
				throw Error(`Error fetching item owner for ${item?.name}.`, error);
			});
	}, []);

	useEffect(() => {
		if (!item && !item?.hasOwnProperty("created_at")) return;

		const resDateStr = formatDateAgo({ date: item?.created_at });
		setItemCreatedDate(resDateStr);
	}, []);

	const renderUnknownItem = () => {
		return (
			<div className={styles["cardUnknown"]}>
				<p>
					{item?.types.kind === "offer" ? (
						<span>
							Offered item is <b>not found</b> or <b>removed</b> by trader.
						</span>
					) : (
						<span>This item has been deleted.</span>
					)}{" "}
					{item?.types.kind === "offer" ? (
						<span>We recommend that you evaluate your decision before confirmation.</span>
					) : (
						<span>We recommend that you take action.</span>
					)}
				</p>
			</div>
		);
	};

	return (
		<>
			<div
				className={cns(styles["cardMini"], {
					[styles["cardSelected"]]: isDefaultSelected,
					[styles["cardHovered"]]: cardStateHover,
					[styles["cardNotSelectable"]]: source && source === "tradeWindow",
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
				{item.isDataUnavailable
					? renderUnknownItem()
					: item?.images.length > 0 && (
							<>
								<div className={styles["thumbnail"]}>
									<img src={item?.images[0]} className={styles["thumbnailIMG"]} alt="Item Cover Image" />
								</div>
								<div className={styles["content"]}>
									<div className={styles["itemName"]}>
										<span className={styles["itemValue"]}>{item?.name}</span>
									</div>
									<div className={styles["itemSeller"]}>
										<span className={styles["itemLabel"]}>Posted by:</span>
										<span className={styles["itemValue"]}>
											{itemOwner?.seller_id === currentUser.id ? "You" : itemOwner?.name}
										</span>
									</div>
									<div className={styles["itemCreated"]}>
										<span className={styles["itemLabel"]}>Date Posted:</span>
										<span className={styles["itemValue"]}>{itemCreateDate}</span>
									</div>
								</div>
							</>
						)}
			</div>
		</>
	);
};

export default CardMini;
