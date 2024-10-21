import TradeButton from "@/components/TradeButton";
import cns from "@/utils/classNames";
import AddedToCart from "@components/AddedToCart";
import AddToCart from "@components/AddToCart";
import styles from "@styles/Card.module.scss";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Card = (props) => {
	const { game, handleAddToCart, handleHover, handleLike, handleHoverGame, handleSelectGame } = props;

	const variants = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	const location = useLocation();

	return (
		<motion.div
			className={cns(styles["card"])}
			onClick={handleSelectGame}
			id={game.id}
			style={{ margin: 0, padding: 0 }}
			variants={variants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<div className={styles["thumbnail"]}>
				<img src={game.cover} className={styles["img"]} alt="Game Cover Image" />
			</div>
			<div className={styles["content"]}>
				<h2 className={styles["name"]}>{game.name}</h2>
				<div className={styles["buttons"]}>
					<div className={styles["price-cart-trade"]}>
						<span className={styles["price"]}>${game.price}</span>
						<div className={styles["cart-trade"]}>
							<span>
								{game.inCart ? (
									<AddedToCart />
								) : (
									<AddToCart game={game} handleHoverGame={handleHoverGame} handleAddToCart={handleAddToCart} />
								)}
							</span>
							<span className={styles["divider"]}></span>
							<span>
								<TradeButton />
							</span>
						</div>
					</div>
					<button className={styles["like"]} id={game.id} onClick={handleLike} aria-label="Like">
						<FaHeart style={{ fill: game.isLiked ? "#F53333" : "#cccccc" }} className={styles["likeSVG"]} />
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default Card;
