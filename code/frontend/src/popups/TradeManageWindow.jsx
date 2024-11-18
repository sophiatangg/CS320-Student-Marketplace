import CardMini from "@components/CardMini";
import { fetchTradeRequests } from "@database/trade"; // Assuming fetchTradeRequests is here
import Window from "@popups/Window";
import { useAuth } from "@providers/AuthProvider"; // Assuming you have an auth provider
import { useContextDispatch } from "@providers/StoreProvider";
import styles from "@styles/TradeManageWindow.module.scss";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuCheck } from "react-icons/lu";

const TradeManageWindow = () => {
	const { currentUser } = useAuth();
	const [tradeRequests, setTradeRequests] = useState([]);

	const dispatch = useContextDispatch();

	const handleOpenTradeManageWindow = (bool) => {
		dispatch({
			type: "SET_TRADE_MANAGE_DISPLAYED",
			payload: bool,
		});
	};

	useEffect(() => {
		const loadTradeRequests = async () => {
			if (!currentUser || !currentUser.id) return;

			try {
				const requests = await fetchTradeRequests({ userId: currentUser.id });
				setTradeRequests(requests);
			} catch (error) {
				console.error("Error loading trade requests:", error);
			}
		};

		loadTradeRequests();
	}, [currentUser]);

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

	const renderButtons = () => {
		const buttonOpt = [
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
						<div key={buttonIdx} className={styles[button.className]} tabIndex={0}>
							<span>{button.icon()}</span>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<Window dispatchType={"SET_TRADE_MANAGE_DISPLAYED"}>
			<div className={styles["tradeManageWindowContainer"]}>
				{renderHeader()}
				<div className={styles["inner"]}>
					<div className={styles["innerContent"]}>
						{tradeRequests.length === 0 ? (
							<p>No trade requests found.</p>
						) : (
							tradeRequests.map((request, index) => {
								return (
									<div key={index} className={styles["tradeRequestCard"]}>
										<div className={styles["tradeInfoFrom"]}>
											<h2>
												<p>
													Trade Offer from <span>{request.trader?.name || "Unknown Trader"}</span>
												</p>
											</h2>
											{renderButtons()}
										</div>
										<div className={styles["tradeRequestCardInner"]}>
											<div className={styles["tradeItem"]}>
												<h2>What they want</h2>
												{request.trade_goal && <CardMini item={request.trade_goal} isDefaultSelected={false} />}
											</div>
											<div className={styles["tradeItem"]}>
												<h2>Offers</h2>
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
							})
						)}
					</div>
				</div>
			</div>
		</Window>
	);
};

export default TradeManageWindow;
