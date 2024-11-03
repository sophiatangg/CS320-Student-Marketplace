import AnimatedItemPage from "@animations/AnimatedItemPage";
import AnimatedText from "@animations/AnimatedText";
import AddToCartButton from "@components/AddToCartButton";
import Slider from "@components/Slider";
import TradeButton from "@components/TradeButton";
import styles from "@styles/ItemPage.module.scss";
import cns from "@utils/classNames";
import templateGame from "@utils/templateGame";
import { useState } from "react";
import { FaChevronUp, FaHeart } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useParams } from "react-router-dom";

const ItemPage = (props) => {
	const {
		allItems,
		extended,
		handleBrowse,
		handleLike,
		handleTradeOpen,
		selectedItem,
		setExtended,
		setSelectedItem,
		setTextExtended,
		textExtended,
	} = props;

	let { itemId } = useParams();
	const location = useLocation();

	const [carouselState, setCarouselState] = useState(0);
	const [isHover, setIsHover] = useState(false);

	const incrementCarousel = (e) => {
		if (carouselState === 3) {
			setCarouselState(0);
		} else {
			setCarouselState(carouselState + 1);
		}
	};

	const decrementCarousel = (e) => {
		if (carouselState === 0) {
			setCarouselState(3);
		} else {
			setCarouselState(carouselState - 1);
		}
	};

	const extendText = () => {
		setTextExtended(!textExtended);
	};

	const handleExtend = (e) => {
		if (document.getElementById("20").innerHTML === "More") {
			document.getElementById("20").className = styles["aboutBottom"];
		} else if (document.getElementById("20").innerHTML === "Hide") {
			document.getElementById("20").className = "aboutBottomClosed";
		}

		setExtended(!extended);
		if (textExtended === false) {
			setTimeout(extendText, 500);
		} else {
			setTextExtended(!textExtended);
		}
	};

	return (
		<>
			<div className={cns(styles["itemPage"], {})}>
				<AnimatedItemPage>
					<div className={styles["itemPageContent"]}>
						<header>
							<button className={styles["goBack"]} onClick={handleBrowse} id="19" aria-label="Back">
								<FaArrowLeftLong className={styles["arrow"]} />
								Store
							</button>
						</header>

						<section className={styles["item"]}>
							{
								<Slider
									selectedItem={selectedItem}
									setSelectedItem={setSelectedItem}
									allItems={allItems}
									incrementCarousel={incrementCarousel}
									decrementCarousel={decrementCarousel}
									carouselState={carouselState}
									setCarouselState={setCarouselState}
								/>
							}
							<div className={styles["gameInfo"]}>
								<div className={styles["about"]}>
									<div className={styles["aboutTop"]}>
										<h1 className={styles["itemName"]}>{selectedItem ? selectedItem.name : templateGame.name}</h1>
										<p>{selectedItem ? selectedItem.desc : templateGame.desc}</p>
									</div>
									<div
										className={cns(styles["moreBottom"], {
											[styles["conditionalOpen"]]: extended,
											[styles["conditionalClose"]]: !extended,
										})}
										id="about"
									>
										<AnimatedText>
											<div
												className={cns({
													[styles["open"]]: textExtended,
													[styles["closed"]]: !textExtended,
												})}
											>
												<h4>
													<span>Date Added:</span>
													<span>{selectedItem.date}</span>
												</h4>
												<h4>
													<span>Seller:</span>
													<span>{selectedItem.seller}</span>
												</h4>
												<h4>
													<span>Category:</span>
													<span>{selectedItem.category}</span>
												</h4>
												<h4>
													<span>Condition:</span>
													<span>{selectedItem.condition}</span>
												</h4>
											</div>
										</AnimatedText>
										<button
											id="20"
											onClick={handleExtend}
											className={cns(styles["moreBottomButton"], {
												[styles["buttonHovered"]]: isHover,
												[styles["buttonNotHovered"]]: !isHover,
											})}
											aria-label="Extend"
										>
											{extended ? "Hide Details" : "More Details"}
											{extended ? (
												<FaChevronUp className={styles["up"]} style={{ fill: isHover ? "#fff" : "#cccccc" }} />
											) : (
												<FaChevronUp className={styles["down"]} style={{ fill: isHover ? "#fff" : "#cccccc" }} />
											)}
										</button>
									</div>
								</div>

								<div className={styles["addToCart"]}>
									<div className={styles["infos"]}>
										<h3>${selectedItem ? selectedItem.price : templateGame.price}</h3>
										<div className={styles["cart-trade"]}>
											<AddToCartButton item={selectedItem} isBig={true} />
											<TradeButton isBig={true} handleTradeOpen={handleTradeOpen} />
										</div>
									</div>
									<button
										id={selectedItem ? selectedItem.id : templateGame.id}
										onClick={(e) => {
											handleLike(selectedItem.id);
										}}
										aria-label="Like"
									>
										<FaHeart
											className={selectedItem ? (selectedItem.isLiked ? styles["liked"] : styles["like"]) : styles["like"]}
										/>
									</button>
								</div>
							</div>
						</section>
					</div>
				</AnimatedItemPage>
			</div>
		</>
	);
};

export default ItemPage;
