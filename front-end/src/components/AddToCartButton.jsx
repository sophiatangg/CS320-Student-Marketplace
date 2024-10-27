import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/AddToCartButton.module.scss";
import cns from "@utils/classNames";
import { useRef, useState } from "react";
import { TiPlus } from "react-icons/ti";

const AddToCartButton = (props) => {
	const { item, handleHoverItem, isBig } = props;

	const componentRef = useRef();

	const [isHovered, setHovered] = useState(false);

	const { cart } = useContextSelector("cartStore");
	const dispatch = useContextDispatch();

	const isItemAdded = cart.includes(item);

	const handleAddToCart = (e) => {
		dispatch({
			type: "ADD_TO_CART",
			payload: item,
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
