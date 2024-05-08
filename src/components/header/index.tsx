import { h } from 'preact';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<div style={{ display: "flex", width: "100%", maxWidth: "1440px" }}>
			<div style={{ display: "flex" }}>
				<a href="./" class={style.logo}>
					<img src="./assets/eclogo.png" height="48px" />
				</a>
			</div>

			<nav>
				<div style={{ display: "flex", width: "100%" }} />
				<div style={{ display: "flex" }}>
					<div style={{ display: "flex" }}>
						<a href="https://discord.gg/jUhEKHGWZm" target="_blank">
							<img src="./assets/discord-mark-white.svg" height="32px" />
						</a>
					</div>
					<div style={{ display: "flex" }}>
						<a href="https://github.com/edge-classic/EDGE-classic" target="_blank">
							<img src="./assets/github-mark-white.svg" height="32px" />
						</a>
					</div>
				</div>

			</nav>
		</div>
	</header >
);

export default Header;
