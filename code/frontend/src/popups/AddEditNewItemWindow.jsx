import {
	addItemByUser,
	editItemByUser,
	extractFilePathFromImageURLColumn,
	generateUniqueSurname,
	getItemByItemId,
	getItemImagesByItemId,
	removeUploadedItemImage,
	uploadAndHostItemImage,
} from "@database/items.js";
import Window from "@popups/Window";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider.jsx";
import styles from "@styles/AddNewItemWindow.module.scss";
import cns from "@utils/classNames";
import { toastProps } from "@utils/toastProps";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const validateNewItemState = (state) => {
	if (state.name.trim().length === 0) {
		toast.error("You need to enter a name.", toastProps);
		return false;
	}

	if (!Array.isArray(state.images) || state.images.length === 0) {
		toast.error("You need to have at least one image.", toastProps);
		return false;
	}

	if (state.price <= 0) {
		toast.error("You need to enter a valid price.", toastProps);
		return false;
	}

	if (state.category.trim().length === 0) {
		toast.error("You need to enter a category.", toastProps);
		return false;
	}

	if (state.condition.trim().length === 0) {
		toast.error("You need to enter a condition.", toastProps);
		return false;
	}

	return true;
};

const AddEditNewItemWindow = (props) => {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const { allItems, selectedItemIdToEdit } = useContextSelector("itemsStore");

	const isEditWindow = selectedItemIdToEdit > -1;

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
		if (isEditWindow) {
			dispatch({
				type: "SET_SELECTED_ITEM_ID_TO_EDIT",
				payload: -1,
			});
		} else {
			dispatch({
				type: "SET_ADD_EDIT_NEW_ITEM_DISPLAYED",
				payload: bool,
			});
		}
	};

	const handleWindowClose = (e) => {
		handleAddNewItemOpen(false);
	};

	const handleSubmit = async (e) => {
		// I'm leaving the POST in your functions, cuz if it ain't broke
		e.preventDefault();

		// Perform input validation
		if (!validateNewItemState(newItemState)) {
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
			let res;

			// Adding a new item
			if (!isEditWindow) {
				res = await addItemByUser({
					itemData: newItemData,
				});

				if (res) {
					toast.success(`Item successfully added!`, toastProps);

					dispatch({
						type: "SET_ALL_ITEMS",
						payload: [...allItems, res],
					});
				} else {
					throw new Error("Error adding the item.");
				}

				// Clear after posting an item
				handleReset();
				navigate(0);
			}

			// Editing an existing item
			else {
				const newSurname = await generateUniqueSurname(newItemData.name);
				if (!newSurname.hasOwnProperty("name")) {
					throw Error("Error generating new surname");
				}

				res = await editItemByUser({
					itemData: newItemData,
					itemId: selectedItemIdToEdit,
				});

				if (res.error) {
					throw new Error("Error updating the item.");
				}

				toast.success(`Item successfully updated!`, toastProps);

				const updatedDataItem = res.data[0];

				// Update "allItems" list.
				// If we don't update it here, we can only see the changes if we refresh the page
				const updatedAllItems = allItems.filter((item) => {
					if (item.id === updatedDataItem.id) {
						return updatedDataItem; // Replace the matching item with updated data
					}

					return item;
				});

				dispatch({
					type: "SET_ALL_ITEMS",
					payload: updatedAllItems,
				});

				// Close the window
				dispatch({
					type: "SET_SELECTED_ITEM_ID_TO_EDIT",
					payload: -1,
				});

				// Reload the page after updating an item
				// We need to reload to also fetch new data
				const surnameMatch = pathname.match(/^\/([^/]+)/);

				// for now, redirect ALL users to the store page...
				// FIX IT

				navigate(`/browse`);
			}
		} catch (error) {
			console.error(`Error ${isEditWindow ? "updating" : "adding"} item:`, error);
			toast.error(`An error occurred while ${isEditWindow ? "updating" : "adding"} the item.`, toastProps);
		}
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
			} else {
				toast.error("Failed to upload image.");
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

	useEffect(() => {
		if (!isEditWindow) return;

		// this should only work for editing purposes only
		const fetchItemData = async () => {
			try {
				// Fetch item details and images concurrently
				const [itemDetails, itemImages] = await Promise.all([
					getItemByItemId(selectedItemIdToEdit),
					getItemImagesByItemId(selectedItemIdToEdit),
				]);

				// Prepare new state for images
				const newImagesArrItemState = itemImages?.map((obj) => ({
					fullPath: obj.image_url,
					path: extractFilePathFromImageURLColumn(obj.image_url),
				}));

				// Update state in one go
				setNewItemState((prev) => {
					return {
						...prev,
						category: itemDetails.category ?? "",
						condition: itemDetails.condition ?? "",
						description: itemDetails.desc ?? "",
						images: newImagesArrItemState,
						in_trade: itemDetails.in_trade ?? false,
						name: itemDetails.name ?? "",
						price: itemDetails.price ?? 0,
					};
				});
			} catch (error) {
				console.error("Error fetching item details or images. Check code:", error);
			}
		};

		fetchItemData();
	}, []);

	const renderSelectableChoices = ({ field, options }) => {
		return (
			<div className={styles["choiceContainer"]}>
				{options.map((option, index) => (
					<div
						key={index}
						className={cns(styles["choiceItem"], {
							[styles["choiceItemSelected"]]: newItemState[field] === option,
						})}
						onClick={() => {
							setNewItemState((prev) => ({
								...prev,
								[field]: option,
							}));
						}}
					>
						<span>{option}</span>
					</div>
				))}
			</div>
		);
	};

	const renderInputElem = ({ id, label, placeholder, isBigInput, inputType, field, required }) => {
		const selectableFields = {
			category: ["Academic", "Apparel", "Appliance", "Misc", "Tech"],
			condition: ["New", "Like New", "Used"],
		};

		const isSelectable = Object.keys(selectableFields).includes(field);

		return (
			<div className={styles["inputInner"]} id={id}>
				<div className={styles["label"]}>
					<span>
						{label} {isSelectable && "(Select one)"}
					</span>
				</div>
				<div className={styles["inputBox"]}>
					{isBigInput && (
						<textarea
							onChange={(e) => {
								setNewItemState((prev) => ({ ...prev, [field]: e.target.value }));
							}}
							value={newItemState[field]}
							placeholder={placeholder}
							required={required}
						/>
					)}
					{!isBigInput &&
						isSelectable &&
						renderSelectableChoices({
							field,
							options: selectableFields[field],
						})}
					{!isBigInput && !isSelectable && (
						<input
							type={inputType}
							onChange={(e) => {
								setNewItemState((prev) => ({ ...prev, [field]: e.target.value }));
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
						<>
							<div className={styles["previewImages"]}>
								<div className={styles["previewImagesInner"]}>
									{newItemState.images.map((imgURL, idx) => {
										return (
											<div key={idx} className={styles["imageItem"]}>
												<div className={styles["imageThumbnailContainer"]}>
													<img
														src={imgURL.fullPath}
														onClick={async () => {
															await handleImageRemove(idx);
														}}
													/>
												</div>
												<button
													className={styles["removeIMGButton"]}
													onClick={async () => {
														await handleImageRemove(idx);
													}}
												>
													<span>
														<IoClose
															tabIndex={0}
															style={{
																width: "90%",
																height: "90%",
															}}
														/>
													</span>
												</button>
											</div>
										);
									})}
								</div>
								<div className={styles["previewImagesNotice"]}>
									<span>Click the images to delete them.</span>
								</div>
							</div>
						</>
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
				<div className={cns(styles["single"])}>
					{renderInputElem({
						id: "category",
						label: "Category",
						placeholder: "Enter Category",
						inputType: "text",
						field: "category",
						required: true,
					})}
				</div>
				<div className={cns(styles["single"])}>
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
		<Window dispatchType={"SET_ADD_EDIT_NEW_ITEM_DISPLAYED"}>
			<div className={styles["addNewItemWindowContainer"]}>
				<div className={styles["header"]}>
					<h1 className={styles["headerTitle"]}>{isEditWindow ? `Edit Item — ${newItemState.name}` : "Add Item"}</h1>
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
						<span className={styles["label"]}>{isEditWindow ? "Update" : "Post"}</span>
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

export default AddEditNewItemWindow;
