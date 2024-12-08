import { supabase } from "@database/supabaseClient";
import { getUser } from "@database/users";

const CHAT_TABLE_NAME = "Chat";
const CHAT_MESSAGES_TABLE_NAME = "ChatMessages";

export const initiateChatSession = async ({ initiatorId, receiverId }) => {
	if (!initiatorId || !receiverId) {
		throw new Error("Both initiatorId and receiverId are required to initiate a chat session.");
	}

	try {
		// Check if a chat session already exists
		const { data: existingChats, error: fetchError } = await supabase
			.from(CHAT_TABLE_NAME)
			.select("*")
			.or(`initiator_id.eq.${initiatorId},receiver_id.eq.${initiatorId}`)
			.or(`initiator_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
			.single();

		if (fetchError) {
			// Error code PGRST116 means no match found
			console.error("Error fetching existing chats:", fetchError);
			throw new Error("Failed to fetch existing chats.");
		}

		// Return existing chat session if found
		if (existingChats) {
			return existingChats;
		}

		// Create a new chat session if none exists
		const { data: newChat, error: insertError } = await supabase
			.from(CHAT_TABLE_NAME)
			.insert({
				initiator_id: initiatorId,
				receiver_id: receiverId,
			})
			.select()
			.single();

		if (insertError) {
			console.error("Error creating new chat session:", insertError);
			throw new Error("Failed to create new chat session.");
		}

		return newChat; // Return the newly created chat session
	} catch (error) {
		console.error("Error in initiateChatSession:", error);
		throw error;
	}
};

export const countChatsByUserId = async (userId) => {
	if (!userId) return 0;

	try {
		// Fetch chats where the user is either the initiator or the receiver
		const { count, error } = await supabase
			.from(CHAT_TABLE_NAME)
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

	try {
		// Fetch chats where the user is either the initiator or the receiver
		const { data: chats, error } = await supabase.from(CHAT_TABLE_NAME).select("*").or(`initiator_id.eq.${userId},receiver_id.eq.${userId}`);

		if (error) {
			console.error("Error fetching chats:", error);
			return [];
		}

		// Fetch user data for each chat asynchronously
		const chatData = await Promise.all(
			chats.map(async (chat) => {
				const otherUserId = chat.initiator_id === userId ? chat.receiver_id : chat.initiator_id;

				try {
					const userData = await getUser(otherUserId);

					return {
						id: chat.id,
						user: userData,
						lastMessage: chat.last_message || "",
						lastMessageTimestamp: chat.last_message_timestamp,
					};
				} catch (err) {
					console.error(`Error fetching user data for userId: ${otherUserId}`, err);
					return {
						id: chat.id,
						user: null, // Fallback to null if fetching user fails
						lastMessage: chat.last_message || "",
						lastMessageTimestamp: chat.last_message_timestamp,
					};
				}
			}),
		);

		return chatData;
	} catch (error) {
		console.error("Error in fetchChatsByUserId:", error);
		return [];
	}
};

export const fetchMessagesById = async ({ chatId }) => {
	if (!chatId) return null;

	const { data: fetchedMessages, error } = await supabase
		.from(CHAT_MESSAGES_TABLE_NAME)
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
		.channel(`chat-messages:${chatId}`) // Use a unique channel for the chat
		.on(
			"postgres_changes",
			{
				event: "INSERT", // Listen to inserts
				schema: "public", // Ensure correct schema
				table: "ChatMessages", // Listen specifically for this table
				filter: `chat_id=eq.${chatId}`, // Filter messages by chat ID
			},
			(payload) => {
				if (callback) callback(payload.new); // Use the new row data
			},
		)
		.subscribe();

	return subscription;
};

export const unsubscribeFromMessages = (subscription) => {
	if (subscription) {
		supabase.removeChannel(subscription);
	}
};

export const sendMessage = async ({ chatId, senderId, message }) => {
	if (!chatId) return null;
	if (!senderId) return null;
	if (!message || !message === "") return null;

	const { data, error } = await supabase
		.from(CHAT_MESSAGES_TABLE_NAME)
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
		.from(CHAT_TABLE_NAME)
		.update({
			last_message: message,
			last_message_timestamp: new Date().toISOString(),
		})
		.eq("id", chatId);

	if (error) {
		throw new Error(`Error updating chat: ${error.message}`);
	}
};
