import ChatMessage from "@components/ChatMessage";
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
	const { chatDisplayed } = useContextSelector("displayStore");
	const dispatch = useContextDispatch();

	const { currentUser } = useAuth();

	const chatListContentRef = useRef(null);

	const [chatList, setChatList] = useState([]);
	const [activeChat, setActiveChat] = useState(null);
	const [isExiting, setIsExiting] = useState(false);
	const [hoveredItemId, setHoveredItemId] = useState(null);

	const handleExiting = () => {
		setIsExiting(!isExiting);
	};

	const handleAddActiveChat = (chat) => {
		setActiveChat(chat);
	};

	const handleRemoveActiveChat = () => {
		setActiveChat(null);
	};

	useEffect(() => {
		const fetchChats = async () => {
			const chats = [
				{
					id: 1,
					name: "User 1",
					avatar_url: "",
					lastMessage: "Hi!!",
				},
				{
					id: 2,
					name: "User 2",
					avatar_url: "",
					lastMessage: "Hello~",
				},
			];

			setChatList(chats);
		};

		fetchChats();
	}, []);

	const isChatListEmpty = chatList.length === 0;

	const renderHeader = () => {
		const headerTitle = activeChat ? activeChat.name : "Chat Messages";

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
						<div className={styles["headerUserAvatar"]}>{activeChat.avatar_url && <img src={activeChat.avatar_url} />}</div>
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
					<ChatMessage activeUser={activeChat} setActiveUser={setActiveChat} />
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
				{chatList.map((chat) => (
					<div
						key={chat.id}
						className={styles["chatItem"]}
						onMouseEnter={(e) => {
							e.preventDefault();

							setHoveredItemId(chat.id);
						}}
						onMouseLeave={(e) => {
							e.preventDefault();

							setHoveredItemId(chat.id);
						}}
					>
						<div
							className={styles["chatAvatarContainer"]}
							onClick={(e) => {
								handleAddActiveChat(chat);
							}}
						>
							{chat.avatar && <img src={chat.avatar} className={styles["chatAvatar"]} />}
						</div>
						<div
							className={styles["chatContent"]}
							onClick={(e) => {
								handleAddActiveChat(chat);
							}}
						>
							<span className={styles["chatName"]}>{chat.name}</span>
							<div className={styles["chatMessagePreview"]}>
								<span>{chat.lastMessage}</span>
							</div>
						</div>
						{hoveredItemId === chat.id && renderButtons()}
					</div>
				))}
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
