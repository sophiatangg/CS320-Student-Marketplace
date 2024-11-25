import CardMini from "@components/CardMini";
import { fetchTradeRequestCounts, fetchTradeRequests } from "@database/trade"; // Assuming fetchTradeRequests is here
import Window from "@popups/Window";
import { useAuth } from "@providers/AuthProvider"; // Assuming you have an auth provider
import { useContextDispatch } from "@providers/StoreProvider";
import styles from "@styles/TradeManageWindow.module.scss";
import cns from "@utils/classNames";
import { useEffect, useRef, useState } from "react";
import { BsChatQuoteFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { LuCheck } from "react-icons/lu";

const TradeManageWindow = () => {
	const { currentUser } = useAuth();

	const tradeWindowRef = useRef();
	const sliderRef = useRef();

	const [activeTab, setActiveTab] = useState("RECEIVED");
	const [isLoading, setIsLoading] = useState(false);
	const [requestCounterBadge, setRequestCounterBadge] = useState({
		received: 0,
		sent: 0,
	});

	const [showBadges, setShowBadges] = useState(false);

	const [tradeRequests, setTradeRequests] = useState([]);

	const dispatch = useContextDispatch();

	const isTradeRequestsEmpty = tradeRequests.length === 0;

	const handleOpenTradeManageWindow = (bool) => {
		dispatch({
			type: "SET_TRADE_MANAGE_DISPLAYED",
			payload: bool,
		});
	};

	const handleChat = (e) => {
		e.preventDefault();

		dispatch({
			type: "SET_TRADE_MANAGE_DISPLAYED",
			payload: false,
		});

		setTimeout(() => {
			dispatch({
				type: "SET_CHAT_DISPLAYED",
				payload: true,
			});
		}, 10);
	};

	useEffect(() => {
		const loadTradeRequests = async () => {
			if (!currentUser || !currentUser.id) return;

			setIsLoading(true);

			try {
				const requests = await fetchTradeRequests({
					userId: currentUser.id,
					type: activeTab,
				});

				setTradeRequests(requests);
			} catch (error) {
				console.error(`Error loading ${activeTab.toLowerCase()} trade requests:`, error);
			} finally {
				setIsLoading(false);
			}
		};

		loadTradeRequests();
	}, [activeTab, currentUser]);

	useEffect(() => {
		const loadTradeRequests = async () => {
			if (!currentUser || !currentUser.id) return;

			try {
				const requestCount = await fetchTradeRequestCounts({
					userId: currentUser.id,
					type: activeTab,
				});

				setRequestCounterBadge((prev) => {
					return {
						...prev,
						[activeTab.toLowerCase()]: requestCount.length || 0,
					};
				});
			} catch (error) {
				console.error(`Error loading ${activeTab.toLowerCase()} trade request counter:`, error);
			}
		};

		loadTradeRequests();
	}, [activeTab, currentUser]);

	useEffect(() => {
		if (!sliderRef.current) return;
		if (!tradeWindowRef.current) return;

		// Update slider position and width whenever the active tab changes
		const activeTab = tradeWindowRef.current.querySelector(`.${styles.activeTab}`);
		if (activeTab && sliderRef.current) {
			const { offsetLeft, offsetWidth } = activeTab;

			sliderRef.current.style.transform = `translateX(${offsetLeft}px) translateY(-50%)`; // Only include -50% for Y
			sliderRef.current.style.width = `${offsetWidth}px`;
		}
	}, [activeTab]);

	useEffect(() => {
		const loadTradeBadges = async () => {
			if (!currentUser || !currentUser.id) return;

			try {
				const receivedRequests = await fetchTradeRequests({
					userId: currentUser.id,
					type: "RECEIVED",
				});

				const sentRequests = await fetchTradeRequests({
					userId: currentUser.id,
					type: "SENT",
				});

				setRequestCounterBadge({
					received: receivedRequests.length,
					sent: sentRequests.length,
				});
			} catch (error) {
				console.error(`Error loading ${activeTab.toLowerCase()} trade requests badges`, error);
			}
		};

		loadTradeBadges();
	}, []);

	const renderHeader = () => {
		return (
			<div className={styles["header"]}>
				<h1>Manage Trade Offers</h1>
				<div
					className={styles["closeButton"]}
					tabIndex={0}
					onClick={(e) => {
						e.preventDefault();
						handleOpenTradeManageWindow(false);
					}}
				>
					<IoClose
						tabIndex={0}
						style={{
							width: "100%",
							height: "100%",
						}}
					/>
				</div>
			</div>
		);
	};

	const renderBadgeCounter = (type) => {
		return (
			<div className={styles["tabItemBadge"]}>
				<span>{requestCounterBadge[type]}</span>
			</div>
		);
	};

	const renderTabs = () => {
		return (
			<div className={styles["tabContainer"]}>
				<div
					className={cns(styles["tabItem"], {
						[styles["activeTab"]]: activeTab === "RECEIVED",
					})}
					onClick={() => setActiveTab("RECEIVED")}
				>
					<span>Received</span>
					{showBadges && renderBadgeCounter("received")}
				</div>
				<div
					className={cns(styles["tabItem"], {
						[styles["activeTab"]]: activeTab === "SENT",
					})}
					onClick={() => setActiveTab("SENT")}
				>
					<span>Sent</span>
					{showBadges && renderBadgeCounter("sent")}
				</div>
				<div ref={sliderRef} className={styles["tabSlider"]} />
			</div>
		);
	};

	const renderButtons = () => {
		const buttonOpt = [
			{
				name: "chat",
				className: "chatButton",
				onClick: (e) => {
					handleChat(e);
				},
				icon: () => {
					return <BsChatQuoteFill />;
				},
			},
			{
				name: "accept",
				className: "acceptButton",
				onClick: (e) => {},
				icon: () => {
					return <LuCheck />;
				},
			},
			{
				name: "reject",
				className: "rejectButton",
				onClick: (e) => {},
				icon: () => {
					return <IoClose />;
				},
			},
		];

		return (
			<div className={styles["tradeInfoButtons"]}>
				{buttonOpt.map((button, buttonIdx) => {
					return (
						<div key={buttonIdx} id={button.name} className={styles["tradeInfoButton"]} tabIndex={0} onClick={button.onClick}>
							<span>{button.icon()}</span>
						</div>
					);
				})}
			</div>
		);
	};

	const renderTradeRequestsIsLoading = () => {
		return (
			<div className={styles["tradeRequestPlaceholder"]}>
				<p>Loading...</p>
			</div>
		);
	};

	const renderTradeRequestsEmpty = () => {
		return (
			<div className={styles["tradeRequestEmpty"]}>
				<p>No trade requests found</p>
			</div>
		);
	};

	const renderTradeRequests = () => {
		if (isLoading) {
			return renderTradeRequestsIsLoading();
		}

		if (isTradeRequestsEmpty) {
			return renderTradeRequestsEmpty();
		}

		return tradeRequests.map((request, index) => {
			return (
				<div key={index} className={styles["tradeRequestCard"]}>
					<div className={styles["tradeInfoFrom"]}>
						<h2>
							<p>
								{activeTab === "RECEIVED" ? (
									<>
										From <span>{request.trader?.name || "Unknown Trader"}</span>
									</>
								) : (
									<>
										To <span>{request.trader?.name || "Unknown Seller"}</span>
									</>
								)}
							</p>
						</h2>
						{renderButtons()}
					</div>
					<div className={styles["tradeRequestCardInner"]}>
						<div className={styles["tradeItem"]}>
							<h2>{activeTab === "RECEIVED" ? "What they want" : "What you want"}</h2>
							{request.trade_goal && <CardMini item={request.trade_goal} isDefaultSelected={false} />}
						</div>
						<div className={styles["tradeItem"]}>
							<h2>{activeTab === "RECEIVED" ? "What they offer" : "What you offer"}</h2>
							<div className={styles["tradeOfferItems"]}>
								{request.trade_offers.map((item, itemIndex) => {
									return (
										<div key={itemIndex} className={styles["offeredItem"]}>
											<CardMini item={item} isDefaultSelected={false} />
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			);
		});
	};

	return (
		<Window dispatchType={"SET_TRADE_MANAGE_DISPLAYED"}>
			<div className={styles["tradeManageWindowContainer"]} ref={tradeWindowRef}>
				{renderHeader()}
				<div className={styles["inner"]}>
					{renderTabs()}
					<div
						className={cns(styles["innerContent"], {
							[styles["contentLoading"]]: isLoading,
							[styles["contentEmpty"]]: isTradeRequestsEmpty,
						})}
					>
						{renderTradeRequests()}
					</div>
				</div>
			</div>
		</Window>
	);
};

export default TradeManageWindow;
