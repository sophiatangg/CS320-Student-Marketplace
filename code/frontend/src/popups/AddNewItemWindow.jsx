import Window from "@popups/Window";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider.jsx";
import styles from "@styles/AddNewItemWindow.module.scss";
import cns from "@utils/classNames";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { storeItemInDatabase } from "../../../middleware/Item/addItem.js";

const AddNewItemWindow = (props) => {
	const dispatch = useContextDispatch();
	const localStorageItems = useContextSelector("globalStore").items;

	const [newItemState, setNewItemState] = useState({
		name: "",
		price: 0,
		description: "",
		category: "",
		condition: "",
		cover: "",
		images: [],
	});

	const [imageInput, setImageInput] = useState("");

	const handleAddNewItemOpen = (bool) => {
		dispatch({
			type: "SET_ADD_NEW_ITEM_DISPLAYED",
			payload: bool,
		});
	};

	const handleWindowClose = (e) => {
		handleAddNewItemOpen(false);
	};

	const handleSubmit = async (e) => {
		//I'm leaving the POST in your functions, cuz if it ain't broke
		e.preventDefault();
		const date = new Date();

		if (!Array.isArray(newItemState.images)) return;

		const footageList = newItemState.images.length === 0 ? [newItemState.cover] : [newItemState.cover, ...newItemState.images];

		//i added this stuff
		const res = {
			id: 157,
			name: newItemState.name,
			surname: newItemState.name.replace(" ", ""),
			price: newItemState.price,
			desc: newItemState.description,
			category: newItemState.category,
			condition: newItemState.condition,
			seller: "MockUser1",
			date: date.toISOString(),
			cover: newItemState.cover,
			footage: footageList,
		};
		const newItem = {
			id: res.id,
			seller_id: 234,
			category: res.category,
			condition: res.condition,
			name: res.surname,
		};

		try {
			storeItemInDatabase(newItem);
			toast.success("Item successfully added to the database!");
			dispatch({
				type: "ADD_ITEM",
				payload: res,
			});
		} catch (error) {
			console.error("Error submitting item:", error);
			toast.error("An error occurred while submitting the item.");
		}
		handleReset(e);
	};

	const handleReset = (e) => {
		setNewItemState({
			name: "",
			price: 0,
			description: "",
			category: "",
			condition: "",
			cover: "",
			images: [],
		});
	};

	const handleImageAdd = (e) => {
		if (imageInput.trim()) {
			setNewItemState((prev) => ({
				...prev,
				images: [...prev.images, imageInput.trim()],
			}));

			setImageInput("");
		}
	};

	const handleImageRemove = (index) => {
		setNewItemState((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => {
				return i !== index;
			}),
		}));
	};

	const renderInputElem = ({ id, label, placeholder, isBigInput, inputType, field, required }) => {
		return (
			<div className={styles["inputInner"]} id={id}>
				<div className={styles["label"]}>{label}</div>
				<div className={styles["inputBox"]}>
					{isBigInput ? (
						<textarea
							onChange={(e) => {
								setNewItemState((prev) => ({ ...prev, [field]: e.target.value }));
							}}
							value={newItemState[field]}
							placeholder={placeholder}
							required={required}
						/>
					) : field === "images" ? (
						<>
							<input
								type={inputType}
								onChange={(e) => setImageInput(e.target.value)}
								value={imageInput}
								placeholder={placeholder}
								required={required}
							/>
							<button className={styles["button"]} id={"upload"} onClick={handleImageAdd}>
								Submit Image
							</button>
						</>
					) : (
						<input
							type={inputType}
							onChange={(e) => {
								setNewItemState((prev) => {
									return {
										...prev,
										[field]: e.target.value,
									};
								});
							}}
							value={newItemState[field]}
							placeholder={placeholder}
							required={required}
						/>
					)}
				</div>
			</div>
		);
	};

	const renderTextInputs = () => {
		return (
			<div className={styles["inputs"]}>
				<div className={cns(styles["double"])}>
					{renderInputElem({
						id: "name",
						label: "Name",
						placeholder: "Name",
						inputType: "text",
						field: "name",
						required: true,
					})}
					{renderInputElem({
						id: "price",
						label: "Price",
						placeholder: "0",
						inputType: "number",
						field: "price",
						required: true,
					})}
				</div>
				<div className={cns(styles["single"])}>
					{renderInputElem({
						id: "description",
						label: "Description",
						placeholder: "Description here...",
						isBigInput: true,
						field: "description",
						required: true,
					})}
				</div>
				<div className={cns(styles["double"])}>
					{renderInputElem({
						id: "category",
						label: "Category",
						placeholder: "Enter Category",
						inputType: "text",
						field: "category",
						required: true,
					})}
					{renderInputElem({
						id: "condition",
						label: "Condition",
						placeholder: "New? Used?",
						inputType: "text",
						field: "condition",
						required: true,
					})}
				</div>
				<div className={cns(styles["single"])}>
					{renderInputElem({
						id: "cover",
						label: "Cover",
						placeholder: "Enter Image URL",
						inputType: "text",
						field: "cover",
						required: true,
					})}
				</div>
				<div className={cns(styles["single"], styles["singleRow"])}>
					{renderInputElem({
						id: "images",
						label: "Image(s) (Optional)",
						placeholder: "Enter Image URL",
						inputType: "text",
						field: "images",
						required: false,
					})}
					<div className={styles["addedImages"]}>
						{Array.isArray(newItemState.images) &&
							newItemState.images.length > 0 &&
							newItemState.images.map((imgStr, imgIndex) => {
								return (
									<div key={imgIndex} className={styles["imageItem"]}>
										<span>{imgStr}</span>
										<button
											onClick={() => handleImageRemove(imgIndex)}
											className={cns(styles["removeIMGButton"], styles["button"])}
										>
											<IoClose style={{ width: 18, height: 18, color: "red" }} />
										</button>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		);
	};

	return (
		<Window dispatchType={"SET_ADD_NEW_ITEM_DISPLAYED"}>
			<div className={styles["addNewItemWindowContainer"]}>
				<div className={styles["header"]}>
					<h1>Add Item</h1>
					<div className={styles["closeButton"]} tabIndex={0}>
						<IoClose
							tabIndex={0}
							style={{
								width: "100%",
								height: "100%",
							}}
							onClick={handleWindowClose}
						/>
					</div>
				</div>
				<div className={styles["inner"]}>{renderTextInputs()}</div>
				<div className={styles["bottom"]}>
					<button id="post" className={styles["button"]} onClick={handleSubmit}>
						<span className={styles["label"]}>Post</span>
					</button>
					<button id="reset" className={styles["button"]} onClick={handleReset}>
						<span className={styles["label"]}>Reset</span>
					</button>
					<button id="cancel" className={styles["button"]} onClick={handleWindowClose}>
						<span className={styles["label"]}>Cancel</span>
					</button>
				</div>
			</div>
		</Window>
	);
};

export default AddNewItemWindow;
