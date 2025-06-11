const C3 = globalThis.C3;

// NOTE: use a unique DOM component ID to ensure it doesn't clash with anything else.
// This must also match the ID in plugin.js and domSide.js.
const DOM_COMPONENT_ID = "genvidtech-gcorevideoplugin";

class GCoreVideoInstance extends globalThis.ISDKDOMInstanceBase {
	
	_url: string = "";
	_subtitles: string = "";
	_noLowLatency: boolean = false;
	_isInitialized = false;
	_isReady = false;

	_currentPlaybackTime = 0;
	_currentVolume = -1;
	_duration = -1;

	_playerState = "offline";
	_audioState = "offline";

	_lastError: JSONObject = {
		category: "",
		message: ""
	};

	constructor() {
		super({ domComponentId: DOM_COMPONENT_ID });

		this._InitializeState();

		const properties = this._getInitProperties();

		console.log('debug properties', properties)
		if (properties) {
			this._url = (properties[0] ?? "") as string;
			this._subtitles = (properties[1] ?? "off") as string;
			this._noLowLatency = (properties[2] ?? false) as boolean;
		}

		this._createElement();
	}

	_release() {
		this._InitializeState();
		super._release();
	}

	_getElementState() {
		// Return JSON with the state of the element. This is passed along to both CreateElement()
		// and UpdateState() in domSide.js. It provides a convenient way to send all the DOM element
		// state in one go, ensuring any changes are reflected in the real element.
		return {
			"url": this._url,
			"subtitles": this._subtitles,
			"noLowLatency": this._noLowLatency
		};
	}

	// Initialize state when setting up or disposing player
	_InitializeState() {
		this._isInitialized = false;

		this._currentPlaybackTime = 0;
		this._currentVolume = -1;
		this._duration = -1;

		this._playerState = "offline";
		this._audioState = "offline";

		this._lastError = {
			category: "",
			message: ""
		};
	}

	_OnStateChanged(e: JSONObject) {
		if (e.state) {
			const state = e.state as JSONObject;
			if (state.playerState) {
				switch (state.playerState) {
					case "loading":
					case "offline": {
						this._InitializeState();
						break;
					}
				}
				this._playerState = state.playerState as string;
			}

			// Check if audio state has been updated
			if (state.audioState) {
				this._audioState = state.audioState as string;
			}

			if (state.currentPlaybackTime) {
				this._currentPlaybackTime = state.currentPlaybackTime as number;
			}

			if (state.currentVolume) {
				// Should we differed treatment of volume and mute?
				const currentVolume = state.currentVolume as number;
				if (currentVolume === 0) {
					this._audioState = "muted";
				} else if (currentVolume > 0) {
					this._audioState = "unmuted";
				}
				this._currentVolume = currentVolume;
			}

			if (state.duration) {
				this._duration = state.duration as number;
			}

			// Finally mark the player as ready when current volume and duration values have been retrieved
			if (!this._isReady && this._currentVolume > -1 && this._duration > -1) {
				this._isInitialized = true;
			}
		}

		this._trigger(C3.Plugins.Genvidtech_GCoreVideoPlugin.Cnds.OnStateChanged);
	}

	_OnError(e: JSONValue) {
		this._lastError = (e as JSONObject).error as JSONObject;
		this._trigger(C3.Plugins.Genvidtech_GCoreVideoPlugin.Cnds.OnError);
	}

	_GetLastError() {
		return this._lastError;
	}

	_Play() {
		this._postToDOMElement("play", null);
	}

	_Pause() {
		this._postToDOMElement("pause", null);
	}

	_SetPlaybackTime(playbackTime: number) {
		this._postToDOMElement("seek", { requestedPlaybackTime: playbackTime });
	}

	_SetVolume(level: number) {
		this._postToDOMElement("setVolume", { requestedVolume: level });
	}

	_SetMuted(mute: boolean) {
		if (mute) {
			this._postToDOMElement("mute", null);
		} else {
			this._postToDOMElement("unmute", null);
		}
	}

	_GetState() {
		return {
			playerState: this._playerState,
			audioState: this._audioState,
			currentVolume: this._currentVolume,
			duration: this._duration,
			currentPlaybackTime: this._currentPlaybackTime,
		};
	}

	_SetURL(url: string, subtitles: string, noLowLatency: boolean) {
		if (subtitles === "") {
			subtitles = this._subtitles
		}
		if (!noLowLatency) {
			noLowLatency = this._noLowLatency
		}
		if (this._url === url && this._subtitles === subtitles && this._noLowLatency === noLowLatency) {
			return;
		}

		// Update the locally stored text, and call UpdateElementState().
		// This calls GetElementState() - which contains the button text as part of the state -
		// and then calls UpdateState() in domSide.js with the state object, where the button text
		// is applied to the DOM element.
		this._url = url;
		this._subtitles = subtitles;
		this._noLowLatency = noLowLatency;
		this._updateElementState();
	}

	_GetURL() {
		return this._url;
	}

	_SetSubtitles(language?: string) {
		language = language || "off";
		if (this._subtitles === language)
			return;

		this._subtitles = language;
		this._updateElementState();
	}

	_GetSubtitles() {
		return this._subtitles;
	}

	_SetNoLowLatency(noLowLatency?: boolean) {
		noLowLatency = noLowLatency || false;
		if (this._noLowLatency === noLowLatency)
			return;

		this._noLowLatency = noLowLatency;
		this._updateElementState();
	}

	_GetNoLowLatency() {
		return this._noLowLatency ? 1 : 0;
	}

	_saveToJson() {
		// TODO: Add more state in it?
		return {
			// data to be saved for savegames
			"url": this._url,
			"subtitles": this._subtitles,
			"noLowLatency": this._noLowLatency
		};
	}

	_loadFromJson(o: JSONObject) {
		// load state for savegames
		this._url = (o["url"] ?? "") as string;
		this._subtitles = (o["subtitles"] ?? "off") as string;
		this._noLowLatency = (o["noLowLatency"] ?? false) as boolean;

		this._updateElementState();		// ensures any state changes are updated in the DOM
	}
};

C3.Plugins.Genvidtech_GCoreVideoPlugin.Instance = GCoreVideoInstance;

export type { GCoreVideoInstance as SDKInstanceClass };