import styles from "@styles/DeleteItemButton.module.scss";
import cns from "@utils/classNames";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteItemInDatabase } from "../../../middleware/Item/deleteItem.js";

const DeleteItemButton = (props) => {
	const { isBig, itemId } = props;

	const [isHovered, setHovered] = useState(false);

	const handleComponentHover = (e) => {
		setHovered(!isHovered);
	};

	const handleChangeHoverColor = () => {
		return isHovered ? "#92f" : "#999";
	};

	const handleIconDimension = () => {
		return isBig ? 20 : 18;
	};

	const handleDeleteItem = () => {
		if (itemId) {
			deleteItemInDatabase(itemId);
			console.log(`Deleting item with ID: ${itemId}`);
		} else {
			console.error("No item ID provided");
		}
	};

	return (
		<>
			<div
				className={cns(styles["deleteItemButton"], {
					[styles["isBig"]]: isBig,
				})}
				onClick={(e) => {
					handleDeleteItem(e);
				}}
				onMouseEnter={(e) => {
					handleComponentHover(e);
				}}
				onMouseLeave={(e) => {
					handleComponentHover(e);
				}}
			>
				<span
					style={{
						width: handleIconDimension(),
						height: handleIconDimension(),
					}}
				>
					<FaRegTrashCan style={{ width: handleIconDimension(), height: handleIconDimension(), fill: handleChangeHoverColor() }} />
				</span>
				<h4 style={{ color: handleChangeHoverColor() }}>Delete</h4>
			</div>
		</>
	);
};

export default DeleteItemButton;
