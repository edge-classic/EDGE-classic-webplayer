import { Signal, signal } from '@preact/signals';
import { h } from 'preact';
import style from './style.css';
import { useEffect, useRef, useState } from 'preact/hooks';
import createEdgeModule from '../../edge-classic';
import LicenseModal from '../licenses';

const defaultDoomIWad = "/freedoom2.wad"
const defaultHereticIWad = "/blasphem.wad";

type PlayerConfig = {
	indexDBName: string;
}

type WadState = {
	error?: string;
	wadName?: string;
	isIWAD?: boolean;
}

const config: PlayerConfig = {
	indexDBName: '/edge-classic'
}

function getCookie(cname: string): string {
	let name = cname + "=";
	let ca;
	// prerender guard
	if (typeof window !== 'undefined') {
		ca = document.cookie.split(';');
	}
	if (!ca) {
		return "";
	}
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

class WadHandler {

	constructor(config: PlayerConfig) {
		this.config = config;
	}

	private error(message: string) {
		alert(message);
		console.error(message);
		console.trace();
	}

	setWads(wads: WadState[] | undefined) {
		this.wadState.value = wads;
	}

	async uploadWads(files: File[]) {

		const wads: WadState[] = [];

		for (let i = 0; i < files.length; i++) {

			const file = files[i];

			let database: IDBDatabase | undefined;

			try {
				database = await this.openDatabase();
				if (!database) {
					this.error("Unable to open database")
					return;
				}
			} catch (e) {
				this.error(e);
				database?.close();
				return;
			}

			const upload = new Promise<WadState>((resolve, reject) => {

				var reader = new FileReader();
				reader.readAsArrayBuffer(file);

				reader.onload = (e) => {

					const bits = e.target.result;
					const contents = new Uint8Array(bits as ArrayBuffer);

					const iwad = contents[0] === 73;

					const trans = database.transaction(['FILE_DATA'], 'readwrite');
					const path = `${this.config.indexDBName}/${file.name}`;
					const addReq = trans.objectStore('FILE_DATA').put({ timestamp: new Date(), mode: 33206, contents: contents }, path);

					addReq.onerror = (e) => {
						reject("Error storing wad data");
					}

					trans.oncomplete = (e) => {
						resolve({ wadName: file.name, isIWAD: iwad });
					}
				}

				reader.onerror = (e) => {
					reject("Error reading wad");
				}

			});

			try {
				const wad = await upload;
				database?.close();
				database = undefined;
				wads.push(wad)
			} catch (e) {
				this.error(e);
			} finally {
				database?.close();
			}

		}

		this.setWads(wads.length ? wads : undefined);

	}

	private async openDatabase() {

		return new Promise<IDBDatabase | undefined>((resolve, reject) => {

			// build pre-render guard
			if (typeof window !== 'undefined') {
				const dbrequest = window.indexedDB.open(this.config.indexDBName);

				dbrequest.onerror = (e) => {
					reject(`unable to load database ${this.config.indexDBName}`);
				}

				dbrequest.onupgradeneeded = (e) => {

					console.log("upgrade needed");

					const db = (e.target as IDBOpenDBRequest).result as IDBDatabase;
					if (!db.objectStoreNames.contains("FILE_DATA")) {
						console.log("Creating FILE_DATA object store");
						const store = db.createObjectStore("FILE_DATA", {});
						store.createIndex("timestamp", "timestamp", { unique: false });
					}
				};

				dbrequest.onsuccess = (e) => {
					console.log("db open");
					const db = (e.target as IDBOpenDBRequest).result as IDBDatabase;
					resolve(db);
				}
			}
		});
	}

	wadState: Signal<WadState[] | undefined> = signal(undefined);

	config: PlayerConfig;

	static get singleton(): WadHandler {
		if (!WadHandler.instance) {
			WadHandler.instance = new WadHandler(config);
		}
		return WadHandler.instance;
	}

	private static instance?: WadHandler;
}

type Project = {
	name: string;
	image: string;
	link: string;
}

const projects: Project[] = [

	{ name: "Operation: Arctic Wolf Revisited", image: "./assets/images/articwolf.png", link: "https://www.moddb.com/mods/edge-classic-add-ons/downloads/arctic-wolf-revisited" },
	{ name: "Astral Pathfinder", image: "./assets/images/astralpathfinder.png", link: "https://www.moddb.com/mods/edge-classic-add-ons/downloads/astral-pathfinder1" },
	{ name: "Aliens: Stranded", image: "./assets/images/aliensstranded.png", link: "https://www.moddb.com/mods/edge-classic-add-ons/downloads/aliens-stranded" }
]

const WadChooser = () => {

	const [showLicense, setShowLicense] = useState(false);

	const pelements = projects.map(p => {
		return <a href={p.link} target="_blank" style="display:flex;flex:1;flex-direction:column;height:100%;align-items:flex-end">
			<div style={{ display: "flex", flex: 0 }}>
				<div style={{ paddingTop: 12, paddingBottom: 4, fontSize: 14, whiteSpace: "pre", fontWeight: "normal" }}>{p.name}</div>
			</div>
			<div style={{ display: "flex", position: "relative", flexGrow: 1, width: "100%" }} >
				<img style="width:100%;height:100%;object-fit:cover;position:absolute" src={p.image} />
			</div>
		</a>
	});

	return <div style={{ display: "flex", width: "100%", maxWidth: "1440px", padding: 24, paddingLeft: 42 }}>
		{showLicense && <LicenseModal onClose={() => setShowLicense(false)} />}
		<div style={{ display: "flex", flexGrow: 1 }}>
			<div style={{ display: "flex", width: "80%" }}>
				<div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
					<div style={{ display: "flex" }}>
						<div style={{ fontSize: 18, fontWeight: "normal", paddingBottom: 24, width: 800 }}>Play EDGE-Classic in your browser by selecting an option below:
						</div>
					</div>

					<div style={{ display: "flex", alignItems: "center" }}>
						<button style="font-size:18px;width:292px;height:48px;padding:12px" onClick={() => {
							WadHandler.singleton.setWads([{ wadName: defaultDoomIWad, isIWAD: true }])
						}}>Play Freedoom 2</button>
					</div>
					<div style={{ paddingTop: 24 }} />
					<div style={{ display: "flex", alignItems: "center" }}>
						<button style="font-size:18px;width:292px;height:48px;padding:12px" onClick={() => {
							WadHandler.singleton.setWads([{ wadName: defaultHereticIWad, isIWAD: true }])
						}}>Play Blasphemer</button>
					</div>
					<div style={{ paddingTop: 24 }} />
					<div style={{ display: "flex", alignItems: "center" }}>
						<button style="font-size:18px;width:292px;height:48px;padding:12px" onClick={() => {
							document.getElementById('getWadFile').click()
						}}>Play Wad, EPK, or Zip files</button>
					</div>
					<div style={{ paddingTop: 24 }} />

					<textarea style="font-size:12px;width:292px;height:48px" placeholder="Enter custom command line" spellcheck={false} onChange={(ev: any) => {

						const value = (ev?.target?.value?.length ? ev?.target?.value : undefined)?.trim().replace("\n", " ");
						if (value?.length) {
							document.cookie = `customCommandLineCookie=${value}; SameSite=None; Secure`;
						} else {
							document.cookie = `customCommandLineCookie=; SameSite=None; Secure`;
						}

					}}>{getCookie("customCommandLineCookie")?.trim() ?? ""}</textarea>


					<div style={{ paddingTop: 128 }} />
					<div style={{ display: "flex", alignItems: "center" }}>
						<button style="font-size:18px;width:292px;height:48px;padding:12px" onClick={() => {
							setShowLicense(true);
						}}>Show Licenses</button>
					</div>
				</div>

				<input id="getWadFile" style="display:none" type="file" multiple onChange={(e) => {
					const files = Array.from((e.target as any).files as File[]);
					if (files.length === 0) {
						e.preventDefault();
						return;
					}

					const badFile = files.find(f => {
						const check = f.name.toLowerCase();
						if (!check.endsWith(".wad") && !check.endsWith(".zip") && !check.endsWith(".epk") && !check.endsWith(".7z")) {
							return true;
						}
						return false;
					})

					if (badFile) {
						e.preventDefault();
						alert(`Please select wad, epk, or zip files, ${badFile.name} is invalid`);
						return;
					}

					const wadHandler = WadHandler.singleton;
					wadHandler.uploadWads(files);

				}} />
			</div>
		</div>
		<div style={{ display: "flex", flexGrow: 1, width: "50%", flexDirection: "column" }}>
			<div style={{ display: "flex", flex: "0 0 24px", position: "relative" }}>
				<div style={{ position: "absolute", fontSize: 18, fontWeight: 400, whiteSpace: "pre" }}>Suggested Projects</div>
			</div>
			<div style={{ display: "flex", flexShrink: 0, flexGrow: 1, flexDirection: "column" }}>
				{pelements}
			</div>
		</div>
	</div>

}

const EdgeClassic = () => {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const [state, setState] = useState<{ loading: boolean }>({ loading: true });
	const wadState = WadHandler.singleton.wadState.value;


	const pointerLockChange = () => {
		const canvas = canvasRef?.current;
		const lock = canvas === document.pointerLockElement;

		// disabled for embedded classic site
		//Module._WebSetFullscreen(lock ? 1 : 0);

		/*
		// It feels good to open the menu when releasing pointer lock
		// though, it makes the interaction tricky to close the menu
		if (!lock) {
			Module._WebOpenGameMenu(1);
		}
		*/
	}

	useEffect(() => {

		const canvas = canvasRef?.current;
		const canvasContainer = canvasContainerRef?.current;

		let iwad = wadState?.find(w => w.isIWAD);

		if (!iwad) {
			iwad = { wadName: defaultDoomIWad, isIWAD: true };
		}
		
		console.log("WadState", wadState);

		/*
		let iwad = defaultDoomIWad;
		if (wadState.wadName === defaultHereticIWad) {
			iwad = defaultHereticIWad;
		}

		if (wadState.wadName !== iwad && wadState.isIWAD) {
			iwad = `edge-classic/${wadName}`;
		}
		*/

		if (!iwad) {
			throw "Unable to get iwad";
		}


		if (!canvasContainer) {
			throw "Unable to get canvas container";
		}

		if (!canvas) {
			throw "Unable to get canvas";
		}

		const syncCanvasSize = () => {
			const w = Math.floor(canvasContainer.offsetWidth);
			const h = Math.floor(canvasContainer.offsetHeight);
			console.log("Setting canvas size", w, h);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			canvas.width = w;
			canvas.height = h;
		}

		// initial update
		syncCanvasSize();

		const canvasSync = () => {
			syncCanvasSize();
			Module._WebSyncScreenSize();
		};

		document.addEventListener("pointerlockchange", pointerLockChange, false);

		let doSyncTimeout;
		window.addEventListener("resize", (ev) => {

			clearTimeout(doSyncTimeout);
			doSyncTimeout = setTimeout(canvasSync, 250);

		});

		canvas.addEventListener("webglcontextlost", function (e) { alert('FIXME: WebGL context lost, please reload the page'); e.preventDefault(); }, false);

		let iwadPath = iwad.wadName!;
		if (iwadPath !== defaultDoomIWad && iwadPath !== defaultHereticIWad) {
			iwadPath = `edge-classic/${iwadPath}`;
		}

		const args = ["-home", "/edge-classic", "-windowed", "-width", canvas.offsetWidth.toString(), "-height", canvas.offsetHeight.toString(), "-iwad", iwadPath];

		wadState.forEach(w => {
			if (w.isIWAD) {
				return;
			}
			args.push("-file")
			args.push(`edge-classic/${w.wadName}`);
		})

		let customCommandLine = getCookie("customCommandLineCookie");
		if (customCommandLine?.length) {
			args.push(...customCommandLine.split(" "));
		}



		createEdgeModule({
			edgePostInit: () => {
				console.log("Post-Init!");
				// jump
				if (!args.find(a => a.startsWith("-warp"))) {
					Module._WebOpenGameMenu(1);
				}

				setState({ ...state, loading: false });
			},
			onFullscreen: () => {
				/*
				console.log("On fullscreen");
				const elements = document.querySelectorAll(".playercontrols");
				elements?.forEach(e => {
					(e as any).style.display = "flex";
				});
				*/
			},
			preEdgeSyncFS: () => {
			},
			postEdgeSyncFS: () => {
			},
			arguments: args,
			preInit: () => {
				console.log("Pre-Init");
			},
			preRun: [],
			postRun: [],
			print: (function () {
				return function (text) {
					text = Array.prototype.slice.call(arguments).join(' ');
					console.log(text);
				};
			})(),
			printErr: function (text) {
				text = Array.prototype.slice.call(arguments).join(' ');
				console.error(text);
			},
			canvas: canvas,
			setStatus: function (text) { console.log("status", text) },
			monitorRunDependencies: function (left) { console.log(left) },
		}).then(module => {
			globalThis.Module = module;
			module.canvas = canvas;
		});


		return () => {

		};

	}, []);


	return <div id="canvas-container" ref={canvasContainerRef} style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
		<canvas id="canvas" ref={canvasRef} style={{ visibility: state.loading ? "hidden" : "visible" }}
			onClick={async (ev) => {
				const lock = canvasRef.current === document.pointerLockElement;
				if (!lock) {
					try {
						await canvasRef.current?.requestPointerLock();
					} catch (err) {
						console.error(err);
					}
				}
			}} />

		{!!state.loading && <div style={{ position: "absolute", display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
			<div class={style.loading}>
				<span style="--i:1">L</span>
				<span style="--i:2">O</span>
				<span style="--i:3">A</span>
				<span style="--i:4">D</span>
				<span style="--i:5">I</span>
				<span style="--i:6">N</span>
				<span style="--i:7">G</span>
				<span style="--i:8">.</span>
				<span style="--i:9">.</span>
				<span style="--i:10">.</span>
			</div>
		</div>}

	</div>
}
// floating player controls, not currently used
// {!state.loading && <PlayerControls />}

const PlayerControls = () => {
	const [fullscreen, setFullscreen] = useState(false);
	return <div className="playercontrols" style={{ display: "flex", width: "100%", padding: "24px", zIndex: 1, position: "absolute" }}>
		<div className="playercontrols" style={{ display: "flex", width: "100%" }} />
		<div className="playercontrols" style={{ display: "flex", flexShrink: 1, paddingRight: "48px" }}>
			<button style={{ opacity: 1 }} className="playercontrols" onClick={() => { Module._WebSetFullscreen(fullscreen ? 0 : 1, setFullscreen(!fullscreen)) }}>{fullscreen ? "Minimize" : "Maximize"}</button>
		</div>
	</div>
}

const Player = () => {

	const wadHandler = WadHandler.singleton;
	const wadState = wadHandler.wadState.value;

	return (
		<div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
			{!wadState?.length && <WadChooser />}
			{!!wadState?.length && <EdgeClassic />}
		</div>
	);
};

export default Player;
