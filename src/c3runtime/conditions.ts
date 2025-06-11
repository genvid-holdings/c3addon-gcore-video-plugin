import type { SDKInstanceClass } from "./instance.js";

const C3 = self.C3;

C3.Plugins.Genvidtech_GCoreVideoPlugin.Cnds =
{
	OnStateChanged(this: SDKInstanceClass) {
		return true;
	},
	OnError(this: SDKInstanceClass) {
		return true;
	},
	IsPlaying(this: SDKInstanceClass) {
		return this._isInitialized && this._playerState === "playing";
	},
	IsPaused(this: SDKInstanceClass) {
		return this._isInitialized && this._playerState === "paused";
	},
	IsLoading(this: SDKInstanceClass) {
		return this._playerState === "loading";
	},
	IsOffline(this: SDKInstanceClass) {
		return this._playerState === "offline";
	},
	IsReady(this: SDKInstanceClass) {
		return this._isInitialized;
	},
	IsEnded(this: SDKInstanceClass) {
		return this._isInitialized && this._playerState === "ended";
	},
	IsMuted(this: SDKInstanceClass) {
		return this._audioState === "muted";
	}
};
