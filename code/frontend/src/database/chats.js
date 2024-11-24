import { supabase } from "@database/supabaseClient";

const chatTableName = "Chat";
const chatMessagesTableName = "ChatMessages";

export const countChatsByUserId = async (userId) => {
	if (!userId) return 0;

	try {
		// Fetch chats where the user is either the initiator or the receiver
		const { count, error } = await supabase
			.from(chatTableName)
			.select("*", { count: "exact", head: true })
			.or(`initiator_id.eq.${userId},receiver_id.eq.${userId}`);

		if (error) {
			console.error("Error counting chats:", error);
			return 0;
		}

		// Return the count of chats
		return count || 0;
	} catch (error) {
		console.error("Unexpected error in countChatsByUserId:", error);
		return 0;
	}
};

export const fetchChatsByUserId = async (userId) => {
	if (!userId) return [];

	// Fetch chats where the user is either the initiator or the receiver
	const { data: chats, error } = await supabase.from(chatTableName).select("*").or(`initiator_id.eq.${userId},receiver_id.eq.${userId}`);

	if (error) {
		console.error("Error fetching chats:", error);
		return [];
	}

	return chats.map((chat) => {
		const otherUserId = chat.initiator_id === userId ? chat.receiver_id : chat.initiator_id;

		return {
			id: chat.id,
			otherUserId, // The ID of the user the current user is chatting with
			lastMessage: chat.last_message || "",
			lastMessageTimestamp: chat.last_message_timestamp,
		};
	});
};

export const fetchMessagesById = async (chatId) => {
	if (!chatId) return null;

	const { data: fetchedMessages, error } = await supabase
		.from(chatMessagesTableName)
		.select("*")
		.eq("chat_id", chatId)
		.order("created_at", { ascending: true });

	if (error) {
		console.error("Error fetching messages:", error);
		throw Error("Error fetching chat messages with the given user id.");
	}

	return fetchedMessages;
};

export const subscribeToMessages = (chatId, callback) => {
	if (!chatId) {
		throw new Error("Chat ID is required to subscribe to messages.");
	}

	const subscription = supabase
		.from(`${chatMessagesTableName}:chat_id=eq.${chatId}`)
		.on("INSERT", (payload) => {
			if (callback) callback(payload.new);
		})
		.subscribe();

	return subscription;
};

export const unsubscribeFromMessages = (subscription) => {
	if (subscription) {
		subscription.unsubscribe();
	}
};

export const sendMessage = async ({ chatId, senderId, message }) => {
	if (!chatId) return null;
	if (!senderId) return null;
	if (!message || !message === "") return null;

	const { data, error } = await supabase
		.from(chatMessagesTableName)
		.insert({
			chat_id: chatId,
			sender_id: senderId,
			message,
		})
		.single();

	if (error) {
		throw new Error(`Error inserting message: ${error.message}`);
	}

	return data;
};

export const updateChat = async ({ chatId, message }) => {
	const { error } = await supabase
		.from("Chat")
		.update({
			last_message: message,
			last_message_timestamp: new Date().toISOString(),
		})
		.eq("id", chatId);

	if (error) {
		throw new Error(`Error updating chat: ${error.message}`);
	}
};
