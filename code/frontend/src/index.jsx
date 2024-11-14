import DissolveFilter from "@components/DissolveFilter";
import "@media/fonts/walsheim/GTWalsheimPro-Bold.ttf";
import "@media/fonts/walsheim/GTWalsheimPro-Light.ttf";
import "@media/fonts/walsheim/GTWalsheimPro-Medium.ttf";
import "@media/fonts/walsheim/GTWalsheimPro-Regular.ttf";
import { AuthProvider } from "@stores/AuthProvider";
import { StoreProvider } from "@stores/StoreProvider";
import "@styles/_.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-perfect-scrollbar/dist/css/styles.css";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";

const elem = document.getElementById("root");
const root = createRoot(elem);

root.render(
	<StrictMode>
		<StoreProvider>
			<BrowserRouter>
				<AuthProvider>
					<App />
					<DissolveFilter />
				</AuthProvider>
			</BrowserRouter>
		</StoreProvider>
	</StrictMode>,
);
