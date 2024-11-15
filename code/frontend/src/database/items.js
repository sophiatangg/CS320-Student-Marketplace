import { supabase } from "@database/supabaseClient";
import { keysChecker } from "@utils/others";
import { v4 as uuidv4 } from "uuid";

const itemTableName = "Item";
const itemImagesTableName = "ItemImages";
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

export const selectAllItems = async () => {
	const res = await supabase.from(itemTableName).select("*");

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

export const selectAllItemsWithImages = async () => {
	// Fetch all items
	const { data: items, error: itemsError } = await supabase.from(itemTableName).select("*");

	if (itemsError) {
		console.error("Error fetching items:", itemsError);
		return { data: null, error: itemsError };
	}

	// Fetch all images and group by itemid
	const { data: images, error: imagesError } = await supabase.from(itemImagesTableName).select("*");

	if (imagesError) {
		console.error("Error fetching images:", imagesError);
		return { data: null, error: imagesError };
	}

	// Combine items with their respective images
	const itemsWithImages = items.map((item) => {
		const itemImages = images
			.filter((image) => {
				return image.itemid === item.id;
			})
			.map((image) => {
				return image.image_url;
			});

		return {
			...item,
			images: itemImages, // Attach images as an array
		};
	});

	return { data: itemsWithImages, error: null };
};

const generateUniqueSurname = async (itemName) => {
	const baseSurname = itemName.toLowerCase().replace(/\s+/g, "-");

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

	const { data: uploadData, error: uploadError } = await supabase.storage.from(itemImagesStorageName).upload(`images/${uniqueFileName}`, file, {
		cacheControl: "3600",
		upsert: false,
	});

	if (uploadError) {
		console.error("Image upload failed:", uploadError);
		return null;
	}

	// URL valid for 604800 seconds (1 week)
	const { data: signedUrl, error: signedError } = await supabase.storage
		.from(itemImagesStorageName)
		.createSignedUrl(`images/${uniqueFileName}`, 604800);

	if (signedError) {
		console.error("Error creating signed URL:", signedError);
		return null;
	}

	const returnObj = {
		path: uploadData.path,
		fullPath: signedUrl.signedUrl,
	};

	return returnObj;
};

export const removeUploadedItemImage = async (imageURL) => {
	const res = await supabase.storage.from("item-images").remove([imageURL]);

	if (res.error) {
		console.error("Failed to delete image from Supabase:", error);
	}

	return res;
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
