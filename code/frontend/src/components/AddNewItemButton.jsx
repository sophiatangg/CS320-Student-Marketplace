import { useContextDispatch } from "@stores/StoreProvider";
import styles from "@styles/AddNewItemButton.module.scss";

const AddNewItemButton = (props) => {
	const dispatch = useContextDispatch();

	const handleAddNewItemOpen = (bool) => {
		dispatch({
			type: "SET_ADD_NEW_ITEM_DISPLAYED",
			payload: bool,
		});
	};

	return (
		<>
			<div className={styles["addNewItem"]}>
				<button
					className={styles["textButton"]}
					onClick={(e) => {
						handleAddNewItemOpen(true);
					}}
				>
					Add Item
				</button>
			</div>
		</>
	);
};

export default AddNewItemButton;
