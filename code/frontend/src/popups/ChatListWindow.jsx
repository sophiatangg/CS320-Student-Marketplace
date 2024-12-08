import ChatMessage from "@components/ChatMessage";
import { fetchChatsByUserId, initiateChatSession } from "@database/chats";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/ChatListWindow.module.scss";
import cns from "@utils/classNames";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

const animations = {
	initial: {
		opacity: 0.5,
		x: -200,
		pointerEvents: "none",
	},
	animate: {
		opacity: 1,
		x: 0,
		pointerEvents: "all",
		transition: { duration: 0.3 },
	},
	exit: {
		opacity: 0,
		x: -200,
		pointerEvents: "none",
		transition: { duration: 0.3 },
	},
};

const ChatListWindow = (props) => {
	const chatListContentRef = useRef(null);

	const [chatList, setChatList] = useState([]);
	const [isExiting, setIsExiting] = useState(false);
	const [hoveredItemId, setHoveredItemId] = useState(null);
	const [currentUserWith, setCurrentUserWith] = useState(null);

	const { currentUser } = useAuth();

	const { activeChat } = useContextSelector("displayStore");
	const dispatch = useContextDispatch();

	const handleExiting = () => {
		setIsExiting(!isExiting);
	};

	const handleAddActiveChat = async (chat) => {
		try {
			if (!chat) return;

			// If `chat` is null, attempt to find the existing chat or create one
			const initiatorId = currentUser.id;
			const receiverId = chat.user.id; // Replace this with a valid receiver ID logic

			if (!receiverId) {
				console.error("Receiver ID is not available to initiate a chat.");
				return;
			}

			const newChat = await initiateChatSession({
				initiatorId,
				receiverId,
			});

			if (newChat) {
				setCurrentUserWith(chat.user);

				dispatch({
					type: "SET_ACTIVE_CHAT",
					payload: newChat,
				});
			} else {
				throw new Error("Unable to initialize chat session.");
			}
		} catch (error) {
			console.error("Error adding active chat:", error);
		}
	};

	const handleRemoveActiveChat = () => {
		setCurrentUserWith(null);

		dispatch({
			type: "SET_ACTIVE_CHAT",
			payload: null,
		});
	};

	useEffect(() => {
		const loadChats = async () => {
			if (!currentUser || !currentUser.id) return;

			const chats = await fetchChatsByUserId(currentUser.id);
			setChatList(chats);
		};

		loadChats();
	}, [currentUser]);

	const isChatListEmpty = chatList.length === 0;

	const renderHeader = () => {
		const headerTitle = currentUserWith ? currentUserWith.name : "Chat Messages";

		return (
			<div
				className={cns(styles["header"], {
					[styles["mainHeader"]]: !activeChat,
					[styles["userHeader"]]: activeChat,
				})}
			>
				{activeChat && (
					<>
						<div className={cns(styles["backButton"], styles["button"])} onClick={handleRemoveActiveChat}>
							<IoMdArrowRoundBack
								style={{
									fill: "#fff",
								}}
							/>
						</div>
						<div className={styles["headerUserAvatar"]}>
							{currentUserWith && currentUserWith?.avatar_url && <img src={currentUserWith?.avatar_url} />}
						</div>
					</>
				)}
				<span className={styles["title"]}>{headerTitle}</span>
				<div className={styles["buttons"]}>
					<div className={cns(styles["button"])} onClick={handleExiting}>
						<FaChevronLeft />
					</div>
				</div>
			</div>
		);
	};

	const renderContent = () => {
		return (
			<div
				className={cns(styles["content"], {
					[styles["emptyContent"]]: isChatListEmpty,
				})}
			>
				{activeChat ? (
					<>
						<ChatMessage activeChat={activeChat} />
					</>
				) : isChatListEmpty ? (
					renderEmptyContainer()
				) : (
					renderChatContentList()
				)}
			</div>
		);
	};

	const renderChatContentList = () => {
		const renderButtons = () => {
			return (
				<div className={styles["chatContentButtons"]}>
					<div className={cns(styles["button"], styles["pinButton"])}>
						<BsPinAngleFill />
					</div>
				</div>
			);
		};

		return (
			<div
				className={styles["chatContentList"]}
				ref={chatListContentRef}
				onMouseLeave={() => {
					setHoveredItemId(null);
				}}
			>
				{chatList.map((chat) => {
					return (
						<div
							key={chat.id}
							className={styles["chatItem"]}
							onClick={async (e) => {
								await handleAddActiveChat(chat);
							}}
							onMouseEnter={async (e) => {
								e.preventDefault();

								setHoveredItemId(chat.id);
							}}
							onMouseLeave={(e) => {
								e.preventDefault();

								setHoveredItemId(chat.id);
							}}
						>
							<div className={styles["chatAvatarContainer"]}>
								{chat.user.avatar_url && <img src={chat.user.avatar_url} className={styles["chatAvatar"]} />}
							</div>
							<div className={styles["chatContent"]}>
								<span className={styles["chatName"]}>{chat.user?.name}</span>
								<div className={styles["chatMessagePreview"]}>
									<span>{chat.user?.lastMessage}</span>
								</div>
							</div>
							{/* {hoveredItemId === chat.id && renderButtons()} */}
						</div>
					);
				})}
			</div>
		);
	};

	const renderEmptyContainer = () => {
		return (
			<div className={styles["emptyContentInner"]}>
				<span>Start a conversation with someone!</span>
			</div>
		);
	};

	return (
		<div className={styles["chatListComponent"]}>
			<div className={styles["chatListBG"]} onClick={handleExiting} />
			<AnimatePresence key={"chatList"}>
				{!isExiting && (
					<motion.div
						variants={animations}
						initial="initial"
						animate="animate"
						exit="exit"
						onAnimationComplete={(definition) => {
							if (definition !== "exit") return;
							dispatch({
								type: "SET_CHAT_DISPLAYED",
								payload: false,
							});
						}}
					>
						<div className={cns(styles["chatList"], {})}>
							{renderHeader()}
							{renderContent()}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ChatListWindow;
