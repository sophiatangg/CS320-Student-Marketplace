import { supabase } from "@database/supabaseClient";
import { keysChecker } from "@utils/others";
import { v4 as uuidv4 } from "uuid";

const itemTableName = "Item";
const itemImagesTableName = "ItemImages";
const wishlistTableName = "Wishlist";

const itemImagesStorageName = "item-images";

export const selectItemsFromUser = async () => {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const userId = user.id;

	const res = await supabase.from(itemTableName).select("id").or(`id.eq.${userId}`);

	if (!res) {
		console.error("Error fetching items from database");
		return {
			data: null,
			error: res.error,
			status: res.status,
		};
	} else {
		return {
			data: res.data,
			error: res.error,
			status: res.status,
		};
	}
};

export const selectAllItems = async ({ limit = 12, offset = 0 } = {}) => {
	const res = await supabase
		.from(itemTableName)
		.select("*")
		.range(offset, offset + limit - 1);

	if (!res) {
		console.error("Error fetching items from database");
		return {
			data: null,
			error: res.error,
			status: res.status,
		};
	} else {
		return {
			data: res.data,
			error: res.error,
			status: res.status,
		};
	}
};

export const searchItemsWithImagesFromQuery = async ({ searchQuery = "", limit = 12, offset = 0 }) => {
	try {
		let query = supabase.from(itemTableName).select("*");

		// Add search filter
		if (searchQuery) {
			query = query.ilike("name", `%${searchQuery}%`); // Case-insensitive search
		}

		// Apply pagination
		query = query.range(offset, offset + limit - 1);

		const { data: items, error: itemsError } = await query;

		if (itemsError) {
			console.error("Error fetching items:", itemsError);
			return { data: null, error: itemsError };
		}

		// Fetch all images for the paginated items
		const itemIds = items.map((item) => item.id);
		const { data: images, error: imagesError } = await supabase.from(itemImagesTableName).select("itemid, image_url").in("itemid", itemIds);

		if (imagesError) {
			console.error("Error fetching images:", imagesError);
			return { data: null, error: imagesError };
		}

		// Combine items with their respective images
		const itemsWithImages = items.map((item) => {
			const itemImages = images.filter((image) => image.itemid === item.id).map((image) => image.image_url);

			return {
				...item,
				images: itemImages, // Attach images as an array
			};
		});

		return { data: itemsWithImages, error: null };
	} catch (err) {
		console.error("Unexpected error in searchItemsWithQuery:", err);
		return { data: null, error: err };
	}
};

export const selectAllItemsWithImages = async ({ limit = 12, offset = 0 } = {}) => {
	// Fetch paginated items
	const { data: items, error: itemsError } = await supabase
		.from(itemTableName)
		.select("*")
		.range(offset, offset + limit - 1);

	if (itemsError) {
		console.error("Error fetching items:", itemsError);
		return { data: null, error: itemsError };
	}

	// Fetch all images (can be optimized further if images are also paginated)
	const { data: images, error: imagesError } = await supabase.from(itemImagesTableName).select("*");

	if (imagesError) {
		console.error("Error fetching images:", imagesError);
		return { data: null, error: imagesError };
	}

	// Combine items with their respective images
	const itemsWithImages = items.map((item) => {
		const itemImages = images.filter((image) => image.itemid === item.id).map((image) => image.image_url);

		return {
			...item,
			images: itemImages,
		};
	});

	return { data: itemsWithImages, error: null };
};

export const selectAllItemsWithImagesFromUser = async ({ userId, limit = 12, offset = 0 }) => {
	if (!userId) {
		console.error("User ID is required for fetching user items.");
		return { data: null, error: "User ID is missing." };
	}

	try {
		const { data: items, error: itemsError } = await supabase
			.from(itemTableName)
			.select("*")
			.eq("seller_id", userId)
			.range(offset, offset + limit - 1);

		if (itemsError) {
			console.error("Error fetching items:", itemsError);
			return { data: null, error: itemsError };
		}

		const itemIds = items.map((item) => item.id);
		const { data: images, error: imagesError } = await supabase.from(itemImagesTableName).select("itemid, image_url").in("itemid", itemIds);

		if (imagesError) {
			console.error("Error fetching images:", imagesError);
			return { data: null, error: imagesError };
		}

		const itemsWithImages = items.map((item) => {
			const itemImages = images.filter((image) => image.itemid === item.id).map((image) => image.image_url);

			return {
				...item,
				images: itemImages,
			};
		});

		return { data: itemsWithImages, error: null };
	} catch (error) {
		console.error("Unexpected error in selectAllItemsWithImagesFromUser:", error);
		return { data: null, error };
	}
};

export const selectAllItemsWithImagesFromCategory = async ({ category, limit = 12, offset = 0 }) => {
	if (!category) {
		console.error("Category is required for fetching items.");
		return { data: null, error: "Category is missing." };
	}

	try {
		const { data: items, error: itemsError } = await supabase
			.from(itemTableName)
			.select("*")
			.ilike("category", category)
			.range(offset, offset + limit - 1);

		if (itemsError) {
			console.error("Error fetching items:", itemsError);
			return { data: null, error: itemsError };
		}

		const itemIds = items.map((item) => item.id);
		const { data: images, error: imagesError } = await supabase.from(itemImagesTableName).select("itemid, image_url").in("itemid", itemIds);

		if (imagesError) {
			console.error("Error fetching images:", imagesError);
			return { data: null, error: imagesError };
		}

		const itemsWithImages = items.map((item) => {
			const itemImages = images.filter((image) => image.itemid === item.id).map((image) => image.image_url);

			return {
				...item,
				images: itemImages,
			};
		});

		return { data: itemsWithImages, error: null };
	} catch (error) {
		console.error("Unexpected error in selectAllItemsWithImagesFromCategory:", error);
		return { data: null, error };
	}
};

/**
 * Fetch all data from wishlist table.
 */
export const selectAllWishlistedItemsFromUser = async ({ userId, limit = 12, offset = 0 }) => {
	let _userId;
	if (!userId) {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user.hasOwnProperty("id")) {
			throw Error("Error fetching wishlisted items from user.");
		}
		_userId = user.id;
	} else {
		_userId = userId;
	}

	const res = await supabase
		.from(wishlistTableName)
		.select("*")
		.eq("user_id", _userId)
		.range(offset, offset + limit - 1);

	if (!res) {
		console.error("Error fetching wishlist items from database:", res.error);
	}

	return {
		data: res.hasOwnProperty("data") ? res.data : null,
		error: res.error,
		status: res.status,
	};
};

/**
 * Fetches all the data from Items table, which includes data from ItemImages table.
 */
export const selectAllWishlistedItemsWithImagesFromUser = async ({ userId, limit = 12, offset = 0 }) => {
	let _userId;
	if (!userId) {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user.hasOwnProperty("id")) {
			throw Error("Error fetching wishlisted items from user.");
		}
		_userId = user.id;
	} else {
		_userId = userId;
	}

	try {
		const { data: wishlist, error: wishlistError } = await supabase
			.from(wishlistTableName)
			.select("item_id")
			.eq("user_id", _userId)
			.range(offset, offset + limit - 1);

		if (wishlistError) {
			console.error("Error fetching wishlist items:", wishlistError);
			return { data: null, error: wishlistError };
		}

		const itemIds = wishlist.map((wish) => wish.item_id);
		const { data: items, error: itemsError } = await supabase.from(itemTableName).select("*").in("id", itemIds);

		if (itemsError) {
			console.error("Error fetching items for wishlist:", itemsError);
			return { data: null, error: itemsError };
		}

		const { data: images, error: imagesError } = await supabase.from(itemImagesTableName).select("itemid, image_url").in("itemid", itemIds);

		if (imagesError) {
			console.error("Error fetching images:", imagesError);
			return { data: null, error: imagesError };
		}

		const itemsWithImages = items.map((item) => {
			const itemImages = images.filter((image) => image.itemid === item.id).map((image) => image.image_url);

			return {
				...item,
				images: itemImages,
			};
		});

		return { data: itemsWithImages, error: null };
	} catch (error) {
		console.error("Unexpected error in selectAllWishlistedItemsWithImagesFromUser:", error);
		return { data: null, error };
	}
};

export const countAllItems = async () => {
	try {
		const { count, error } = await supabase.from(itemTableName).select("*", { count: "exact", head: true });

		if (error) {
			console.error("Error counting all items:", error);
			return { count: 0, error };
		}

		return { count, error: null };
	} catch (err) {
		console.error("Unexpected error in countAllItems:", err);
		return { count: 0, error: err };
	}
};

export const countAllItemsFromUser = async ({ userId }) => {
	try {
		let _userId;
		if (!userId) {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user?.id) {
				throw new Error("Error fetching user session for item count.");
			}
			_userId = user.id;
		} else {
			_userId = userId;
		}

		const { count, error } = await supabase.from(itemTableName).select("*", { count: "exact", head: true }).eq("seller_id", _userId);

		if (error) {
			console.error("Error counting items from user:", error);
			return { count: 0, error };
		}

		return { count, error: null };
	} catch (err) {
		console.error("Unexpected error in countAllItemsFromUser:", err);
		return { count: 0, error: err };
	}
};

export const countAllItemsFromCategory = async ({ category }) => {
	if (!category) {
		throw new Error("Category is required to count items.");
	}

	const { count, error } = await supabase.from(itemTableName).select("*", { count: "exact" }).ilike("category", category.toLowerCase());

	if (error) {
		console.error("Error fetching item count by category:", error);
		return { count: 0, error };
	}

	return { count, error: null };
};

export const countAllWishlistItemsByUser = async ({ userId }) => {
	try {
		let _userId;
		if (!userId) {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user?.id) {
				throw new Error("Error fetching user session for wishlist count.");
			}
			_userId = user.id;
		} else {
			_userId = userId;
		}

		const { count, error } = await supabase.from(wishlistTableName).select("*", { count: "exact", head: true }).eq("user_id", _userId);

		if (error) {
			console.error("Error counting wishlist items:", error);
			return { count: 0, error };
		}

		return { count, error: null };
	} catch (err) {
		console.error("Unexpected error in countWishlistItemsByUser:", err);
		return { count: 0, error: err };
	}
};

export const countSearchItemsFromQuery = async ({ searchQuery }) => {
	if (!searchQuery || typeof searchQuery !== "string") {
		return { count: 0, error: "Invalid search query." };
	}

	const { count, error } = await supabase
		.from(itemTableName)
		.select("*", { count: "exact", head: true }) // Use "exact" count with no data fetched
		.ilike("name", `%${searchQuery}%`);

	return { count, error };
};

export const getItemByItemId = async (itemId) => {
	if (!itemId) return;

	const { data: itemData, error: itemError } = await supabase.from(itemTableName).select("*").eq("id", itemId).single();

	if (itemError) {
		throw Error(`Error fetching item by ${itemId}`);
	}

	if (itemData) {
		return itemData;
	}
};

export const getItemWithImagesBySurname = async (surname) => {
	if (!surname) {
		throw new Error("Surname is required to fetch item details.");
	}

	try {
		// Fetch the item details using the provided surname
		const { data: itemData, error: itemError } = await supabase.from(itemTableName).select("*").eq("surname", surname).single();

		if (itemError) {
			console.error("Error fetching item by surname:", itemError);
			throw new Error("Failed to fetch item details.");
		}

		if (!itemData) {
			return null; // Item not found
		}

		// Fetch the associated images for the item
		const { data: itemImages, error: imagesError } = await supabase.from(itemImagesTableName).select("image_url").eq("itemid", itemData.id);

		if (imagesError) {
			console.error("Error fetching images for item:", imagesError);
			throw new Error("Failed to fetch item images.");
		}

		// Combine the item data with its images
		return {
			...itemData,
			images: itemImages?.map((img) => img.image_url) || [], // Add the images as an array
		};
	} catch (error) {
		console.error("Unexpected error in getItemBySurname:", error);
		throw error;
	}
};

export const getItemImagesByItemId = async (itemId) => {
	if (!itemId) return;

	// NOTE: "data" should return an array!
	// This is because an item CAN have MULTIPLE images.
	// Hence, no methods after ".eq()".
	const { data: itemImageData, error: itemImageError } = await supabase.from(itemImagesTableName).select("*").eq("itemid", itemId);

	if (itemImageError) {
		throw Error(`Error fetching item by ${itemId}`);
	}

	if (itemImageData) {
		return itemImageData;
	}
};

export const generateUniqueSurname = async (itemName) => {
	const baseSurname = itemName
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "") // Remove special characters
		.replace(/\s+/g, "-"); // Replace spaces with dashes

	let uniqueSurname = baseSurname;
	let suffix = 1;
	while (true) {
		const { data, error } = await supabase.from(itemTableName).select("id").eq("surname", uniqueSurname);

		if (error) {
			return {
				error: error,
			};
		}

		if (data.length === 0) break; // Unique value found
		uniqueSurname = `${baseSurname}-${suffix++}`;
	}

	return {
		name: uniqueSurname,
	};
};

export const uploadAndHostItemImage = async ({ file }) => {
	const uniqueFileName = `${uuidv4()}-${file.name}`;

	// Upload the file to the public bucket
	const { data: uploadData, error: uploadError } = await supabase.storage.from(itemImagesStorageName).upload(`images/${uniqueFileName}`, file, {
		cacheControl: "3600",
		upsert: false,
	});

	if (uploadError) {
		console.error("Image upload failed:", uploadError);
		return null;
	}

	// Construct the public URL for the uploaded file
	const publicData = supabase.storage.from(itemImagesStorageName).getPublicUrl(uploadData.path);

	if (!publicData.data || !publicData.data.publicUrl) {
		console.error("Error fetching image public URL after upload");
		return null;
	}

	const returnObj = {
		path: uploadData.path,
		fullPath: publicData.data.publicUrl,
	};

	return returnObj;
};

export const removeUploadedItemImage = async (imageURL) => {
	const res = await supabase.storage.from(itemImagesStorageName).remove([imageURL]);

	if (res.error) {
		console.error("Failed to delete image from Supabase:", error);
	}

	return res;
};

export const extractFilePathFromImageURLColumn = (imageURL) => {
	if (!imageURL) return;

	const regex = /\/object\/sign\/[^/]+\/(images\/.+)\?/;
	const match = imageURL.match(regex);

	return match ? match[1] : null;
};

const insertItemImageToItemSchema = async (files, newItemId) => {
	await Promise.all(
		files.map(async (file) => {
			await supabase.from(itemImagesTableName).insert({
				itemid: newItemId,
				image_url: file.fullPath,
			});
		}),
	);
};

const deleteItemImageFromItemSchema = async (images) => {
	const { data: imagesToDeleteData, error: fetchError } = await supabase
		.from(itemImagesTableName)
		.select("id, image_url")
		.in(
			"image_url",
			images.map((image) => {
				return image.image_url;
			}),
		);

	if (fetchError) {
		console.error("Error fetching image IDs for deletion:", fetchError);
		throw new Error("Failed to fetch image IDs for deletion.");
	}

	if (imagesToDeleteData?.length > 0) {
		await Promise.all(
			imagesToDeleteData.map(async (image) => {
				await supabase.from(itemImagesTableName).delete().eq("id", image.id);
			}),
		);
	}
};

export const addWishlistItemByUser = async ({ userId, itemId }) => {
	if (!userId) return;
	if (!itemId) return;

	const { data: addedWishlistedItem, error } = await supabase
		.from(wishlistTableName)
		.insert({
			item_id: itemId,
			user_id: userId,
		})
		.select("*")
		.single();

	if (error || !addedWishlistedItem) {
		throw Error("Error inserting wishlist row.");
	}

	return addedWishlistedItem;
};

export const removeWishlistItemByUser = async ({ userId, itemId }) => {
	if (!userId) return;
	if (!itemId) return;

	const { data: deletedWishlistItem, error } = await supabase.from(wishlistTableName).delete().eq("user_id", userId).eq("item_id", itemId).select();

	if (error || !deletedWishlistItem) {
		throw Error("Error deleting wishlist row.");
	}

	return deletedWishlistItem;
};

export const addItemByUser = async ({ itemData }) => {
	if (!itemData) return null;

	// all keys here must match from what we have in our
	// "newItemData" object inside "handleSubmit"
	const keysItemData = ["category", "condition", "desc", "images", "in_trade", "name", "price"];
	if (!keysChecker(keysItemData, itemData)) throw Error("A key is missing.");

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const userId = user.id;
	const uniqueSurname = await generateUniqueSurname(itemData.name);

	if (uniqueSurname.hasOwnProperty("name")) {
		const { images, ...itemDataWithoutImages } = itemData;

		const objToAppend = {
			seller_id: userId,
			surname: uniqueSurname.name,
			...itemDataWithoutImages,
		};

		// Insert item and get the generated ID
		const { data: insertedItem, error } = await supabase.from(itemTableName).insert(objToAppend).select("id").single();

		if (error || !insertedItem) {
			throw Error("Error inserting item row.");
		}

		// Call insertItemImageToSchema with the files and generated item ID
		await insertItemImageToItemSchema(images, insertedItem.id);

		return insertedItem;
	} else {
		throw Error("Error generating surname.");
	}
};

export const editItemByUser = async ({ itemData, itemId }) => {
	if (!itemData) return null;

	// all keys here must match from what we have in our
	// "newItemData" object inside "handleSubmit"
	const keysItemData = ["category", "condition", "desc", "images", "in_trade", "name", "price"];
	if (!keysChecker(keysItemData, itemData)) throw Error("A key is missing.");

	// NOTE: When editing, we only need to update the necessary columns.
	// For "Item" table, for example, we do not need to update "id", "created_at", "seller_id", "dae_added"

	const uniqueSurname = await generateUniqueSurname(itemData.name);

	if (!uniqueSurname.hasOwnProperty("name")) {
		throw new Error("Error generating unique surname.");
	}

	const { images: currentImages, ...itemDataWithoutImages } = itemData;

	const objToUpdate = {
		surname: uniqueSurname.name,
		...itemDataWithoutImages,
	};

	// Update the item row
	const updateRes = await supabase.from(itemTableName).update(objToUpdate).eq("id", itemId).select();
	const { data: updateData, error: updateError } = updateRes;

	if (updateError) {
		throw new Error("Error updating item row.");
	}

	// Fetch existing images to differentiate
	const existingImages = await getItemImagesByItemId(itemId);

	const existingPaths = existingImages.map((image) => image.image_url);
	const currentPaths = currentImages.map((image) => image.fullPath);

	// Images to add
	const imagesToAdd = currentImages.filter((image) => {
		return !existingPaths.includes(image.fullPath);
	});

	if (imagesToAdd.length > 0) {
		await insertItemImageToItemSchema(imagesToAdd, itemId);
	}

	// Images to delete
	const imagesToDelete = existingImages.filter((image) => {
		return !currentPaths.includes(image.image_url);
	});

	if (imagesToDelete.length > 0) {
		await deleteItemImageFromItemSchema(imagesToDelete);
	}

	return updateRes;
};
