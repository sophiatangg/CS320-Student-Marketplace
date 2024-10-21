import "@media/fonts/walsheim/GTWalsheimPro-Bold.ttf";
import "@media/fonts/walsheim/GTWalsheimPro-Light.ttf";
import "@media/fonts/walsheim/GTWalsheimPro-Medium.ttf";
import "@media/fonts/walsheim/GTWalsheimPro-Regular.ttf";
import "@styles/_.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const elem = document.getElementById("root");
const root = createRoot(elem);

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
);
