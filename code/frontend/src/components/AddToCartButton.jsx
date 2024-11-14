import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/AddToCartButton.module.scss";
import cns from "@utils/classNames";
import { useRef, useState } from "react";
import { TiPlus } from "react-icons/ti";

const AddToCartButton = (props) => {
	const { item, isBig } = props;

	const componentRef = useRef();

	const [isHovered, setHovered] = useState(false);

	const { allItems } = useContextSelector("itemsStore");
	const { cart } = useContextSelector("cartStore");
	const dispatch = useContextDispatch();

	const isItemAdded = cart.includes(item);

	const handleAddToCart = (e) => {
		dispatch({
			type: "ADD_TO_CART",
			payload: item,
		});
	};

	const handleHoverItem = (e) => {
		const handledHoveredItem = allItems.map((item, i) => {
			if (e.target.id === i) {
				item.isHovered = !item.isHovered;
				return item;
			} else {
				return item;
			}
		});

		dispatch({
			type: "SET_ALL_ITEMS",
			payload: handledHoveredItem,
		});
	};

	const handleComponentHover = (e) => {
		setHovered(!isHovered);
	};

	const handleChangeHoverColor = () => {
		if (isItemAdded) return "#92f";
		return isHovered ? "#92f" : "#999";
	};

	const handleChangeText = () => {
		return isItemAdded ? "In cart" : "Add to cart";
	};

	const handleChangeIconSize = () => {
		return isBig ? 24 : 18;
	};

	return (
		<div
			ref={componentRef}
			className={cns(styles["addToCart"], {
				[styles["isCard"]]: !isBig,
			})}
			onMouseEnter={(e) => {
				if (handleHoverItem) handleHoverItem(e);
				handleComponentHover(e);
			}}
			onMouseLeave={(e) => {
				if (handleHoverItem) handleHoverItem(e);
				handleComponentHover(e);
			}}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();

				if (isItemAdded) return;

				handleAddToCart(e);
			}}
		>
			{isBig ? (
				<h2 style={{ color: handleChangeHoverColor() }}>{handleChangeText()}</h2>
			) : (
				<h4 style={{ color: handleChangeHoverColor() }}>{handleChangeText()}</h4>
			)}
			{!isItemAdded && (
				<TiPlus
					className={cns(styles["add"], {
						[styles["isBig"]]: isBig,
					})}
					style={{ width: handleChangeIconSize(), height: handleChangeIconSize(), fill: handleChangeHoverColor() }}
				/>
			)}
		</div>
	);
};

export default AddToCartButton;
