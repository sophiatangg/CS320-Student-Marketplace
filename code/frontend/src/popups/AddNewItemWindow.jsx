import { addItemByUser, removeUploadedItemImage, uploadAndHostItemImage } from "@database/items.js";
import Window from "@popups/Window";
import { useContextDispatch } from "@providers/StoreProvider.jsx";
import styles from "@styles/AddNewItemWindow.module.scss";
import cns from "@utils/classNames";
import { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const AddNewItemWindow = (props) => {
	const dispatch = useContextDispatch();

	const [newItemState, setNewItemState] = useState({
		category: "",
		condition: "",
		description: "",
		images: [],
		in_trade: false,
		name: "",
		price: 0,
	});

	const [isUploading, setIsUploading] = useState(false);
	const [isDragZoneHovered, setIsDragZoneHovered] = useState(false);

	const dropInputRef = useRef(null);

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
		// I'm leaving the POST in your functions, cuz if it ain't broke
		e.preventDefault();
		if (!Array.isArray(newItemState.images)) return;

		if (newItemState.images.length <= 0) {
			toast.error(`You need at least 1 image to post ${newItemState.name}.`);
			return;
		}

		const newItemData = {
			category: newItemState.category,
			condition: newItemState.condition,
			desc: newItemState.description,
			images: newItemState.images,
			in_trade: false,
			name: newItemState.name,
			price: newItemState.price,
		};

		try {
			const res = await addItemByUser({ itemData: newItemData });
			if (res) {
				toast.success("Item successfully added to the database!");
			} else {
				throw Error("Error adding to the database");
			}
		} catch (error) {
			console.error("Error submitting item:", error);
			toast.error("An error occurred while submitting the item.");
		}

		// handleReset(e);
	};

	const handleReset = (e) => {
		setNewItemState({
			category: "",
			condition: "",
			description: "",
			images: [],
			in_trade: false,
			name: "",
			price: 0,
		});
	};

	const handleImageAdd = async (files) => {
		if (!files) return;

		setIsUploading(true);

		const uploadedImages = [];

		for (const file of Array.from(files)) {
			const imageURLPath = await uploadAndHostItemImage({ file: file });

			if (imageURLPath) {
				uploadedImages.push(imageURLPath);
			}
		}

		if (uploadedImages.length > 0) {
			setNewItemState((prev) => {
				return {
					...prev,
					images: [...prev.images, ...uploadedImages],
				};
			});
		} else {
			console.error("No images were uploaded.");
		}

		setIsUploading(false);
	};

	const handleImageRemove = async (index) => {
		const imageToRemove = newItemState.images[index];

		if (!imageToRemove || !imageToRemove.path) {
			console.error("Invalid image object or missing path");
			return;
		}

		try {
			const res = await removeUploadedItemImage(imageToRemove.path);
			if (res.error) return;

			// Update the state to remove the image URL
			setNewItemState((prev) => {
				const updatedImages = [...prev.images];
				updatedImages.splice(index, 1);

				return {
					...prev,
					images: updatedImages,
				};
			});
		} catch (error) {
			console.error("Error removing image:", error);
		}
	};

	const handleDrop = async (e) => {
		e.preventDefault();
		setIsDragZoneHovered(!isDragZoneHovered);
		await handleImageAdd(e.dataTransfer.files);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragZoneHovered(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragZoneHovered(false);
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

	const renderImageDropZone = () => {
		return (
			<div className={cns(styles["single"], styles["singleRow"], styles["imagesElem"])}>
				<div className={styles["label"]}>Upload Images</div>
				<div className={cns(styles["single"], styles["singleRow"], styles["imagesInner"])}>
					<div
						className={cns(styles["dropZone"], {
							[styles["dropZoneHover"]]: isDragZoneHovered,
						})}
						onClick={(e) => {
							dropInputRef.current?.click();
						}}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
					>
						<p>Drag and drop images here, or click to select files</p>
						<input
							ref={dropInputRef}
							type="file"
							multiple
							onChange={(e) => {
								e.stopPropagation();

								handleImageAdd(e.target.files);
							}}
							style={{
								display: "none",
							}}
						/>
					</div>
					{newItemState.images.length > 0 && (
						<div className={styles["previewImages"]}>
							{newItemState.images.map((imgURL, idx) => (
								<div key={idx} className={styles["imageItem"]}>
									<div className={styles["imageThumbnailContainer"]}>
										<img src={imgURL.fullPath} />
									</div>
									<button
										onClick={async () => {
											await handleImageRemove(idx);
										}}
										className={styles["removeIMGButton"]}
									>
										<span>Remove</span>
									</button>
								</div>
							))}
						</div>
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
				<div className={styles["inner"]}>
					{renderTextInputs()}
					{renderImageDropZone()}
				</div>
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
