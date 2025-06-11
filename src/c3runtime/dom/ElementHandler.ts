"use strict";

{
  interface GPlayerAPI {
    on(event: string, handler: (e: unknown) => void): void;
    method(opt: { name: string; [key: string]: unknown }): void;
    removeAllListeners(): void;
  }

  class ElementHandler {
    element: HTMLIFrameElement;
    elementId: number;
    handler: IDOMElementHandler;
    gplayerAPI: GPlayerAPI | null;
    isInitialized: boolean;
    controller: AbortController;

    constructor(
      element: HTMLIFrameElement,
      elementId: number,
      domHandler: IDOMElementHandler
    ) {
      this.element = element;
      this.elementId = elementId;
      this.handler = domHandler;
      this.gplayerAPI = null;
      this.isInitialized = false;
      this.controller = new AbortController();

      this.Setup();
    }

    Setup() {
      const { signal } = this.controller;
      this.element.addEventListener("error", (e) => this.OnIFrameError(e), {
        signal,
      });
      this.element.addEventListener("load", () => this.OnLoad(), { signal });

      const interactiveEvents = [
        "touchstart",
        "touchmove",
        "touchend",
        "mousedown",
        "mouseup",
        "mousedown",
        "mouseup",
        "keydown",
        "keyup",
        "click",
      ];
      interactiveEvents.map((e) =>
        this.element.addEventListener(e, (e) => e.stopPropagation(), { signal })
      );

      this.element.style.position = "absolute";
      this.element.style.border = "none";
      this.element.style.pointerEvents = "none";
      this.element.allow = "autoplay; encrypted-media";
    }

    PostToRuntime(event: string, data?: JSONValue) {
      this.handler.PostToRuntimeElement(event, this.elementId, data);
    }

    PostStateToRuntime(state: JSONObject) {
      this.PostToRuntime("state-changed", { state });
    }

    PostErrorToRuntime(category: string, message: string) {
      this.PostToRuntime("error", { error: { category, message } });
    }

    OnLoad() {
      if (this.element.src !== "") {
        if (this.gplayerAPI === null) {
          console.log("iframe loaded", this.element.src);
          this.CreatePlayer();
          console.log("Player created", this.gplayerAPI);
        }
      }
    }

    OnIFrameError(e: ErrorEvent) {
      console.error("GCore IFrame error", e);
      this.PostErrorToRuntime("iframe", `Error loading ${this.element.src}`);
    }

    UpdateState(e: JSONObject) {
      let url = (e["url"] ?? "") as string;
      const language = (e["subtitles"] ?? "off") as string;
      const noLowLatency = e["noLowLatency"] || false;
      if (url !== "") {
        if (language !== "off") {
          url += "?sub_lang=" + language;
        }
        if (noLowLatency) {
          url += (url.includes("?") ? "&" : "?") + "no_low_latency";
        }
      }
      if (this.element.src !== url) {
        let playerState = "offline";
        if (url !== "") {
          console.debug("Loading", url);
          playerState = "loading";
        } else {
          console.debug("Offloading video player");
          this.DestroyPlayer();
        }
        this.element.src = url;
        this.PostStateToRuntime({ playerState });
      }
    }
    CreatePlayer() {
      console.log("Setting up new player");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const GCorePlayer = (globalThis as any)["GcorePlayer"];
      
      if ( GCorePlayer && GCorePlayer["gplayerAPI"] ) {
        // Initialize the player
        const api = GCorePlayer["gplayerAPI"];
        this.gplayerAPI = new api(this.element);
      } else {
        console.error("[video player] GcorePlayer or gplayerAPI not found");
        throw new Error("GCore Player API not found");
      }

      this.gplayerAPI!["on"]("error", (err) => {
        console.error("VideoPlayer API Error", err);
        this.PostErrorToRuntime("gcore", err as string);
      });

      this.gplayerAPI!["on"]("play", () => {
        console.log("[video player]", "Playing");

        if (this.isInitialized) {
          this.PostStateToRuntime({
            playerState: "playing",
          });
        } else {
          // Sequence that load the video and ensure the state is ready.
          // Also seems to avoid the fullscreen pop on iOS, sometimes...
          this.OnPause();
          this.GetDuration();
          this.GetVolume();
        }
      });

      this.gplayerAPI!["on"]("pause", () => {
        console.log("[video player]", "Paused");
        this.isInitialized = true;
        this.PostStateToRuntime({
          playerState: "paused",
        });
      });

      this.gplayerAPI!["on"]("timeupdate", (e) => {
        this.PostStateToRuntime({
          currentPlaybackTime: (e as { current: number }).current,
        });
      });

      this.gplayerAPI!["on"]("volumeupdate", (e) => {
        console.log("[video player] Volume updated", e);

        this.PostStateToRuntime({
          currentVolume: e as number,
        });
      });

      this.gplayerAPI!["on"]("ended", () => {
        console.log("[video player]", "Ended");

        this.PostStateToRuntime({
          playerState: "ended",
        });
      });

      this.gplayerAPI!["on"]("ready", () => {
        console.log("[video player]", "Ready");

        this.isInitialized = false;

        // Actually load the video for the first time.
        this.OnPlay();
      });
    }
    DestroyPlayer() {
      if (this.gplayerAPI) {
        this.gplayerAPI!["removeAllListeners"]();
        this.gplayerAPI = null;
      }
    }
    Destroy() {
      // remove event listeners
      this.controller.abort();
      this.element.src = "";
      this.DestroyPlayer();
    }

    OnPlay() {
      console.log("[video player] Play requested");
      this.gplayerAPI!["method"]({ name: "play" });
    }

    OnPause() {
      console.log("[video player] Pause requested");
      this.gplayerAPI!["method"]({ name: "pause" });
    }

    OnSeek(state: JSONObject) {
      console.log("[video player] Seek requested", state.requestedPlaybackTime);
      if (state.requestedPlaybackTime) {
        this.gplayerAPI!["method"]({
          name: "seek",
          params: state.requestedPlaybackTime,
        });
      }
    }

    OnSetVolume(state: JSONObject) {
      console.log("[video player] Set volume requested", state.requestedVolume);
      if (state.requestedVolume) {
        this.gplayerAPI!["method"]({
          name: "setVolume",
          params: state.requestedVolume,
        });
      }
    }

    OnMute() {
      console.log("[video player]", "Mute requested");
      this.gplayerAPI!["method"]({
        name: "mute",
        callback: () => {
          console.log("[video player]", "Muted");

          this.PostStateToRuntime({
            audioState: "muted",
          });
        },
      });
    }

    OnUnmute() {
      console.log("[video player]", "Unmute requested");
      this.gplayerAPI!["method"]({
        name: "unmute",
        callback: () => {
          console.log("[video player]", "Unmuted");

          this.PostStateToRuntime({
            audioState: "unmuted",
          });
        },
      });
    }

    GetDuration() {
      console.log("[video player]", "Current duration requested");
      this.gplayerAPI!["method"]({
        name: "getDuration",
        callback: (res: number) => {
          console.log("[video player] Duration", res);

          this.PostStateToRuntime({
            duration: res,
          });
        },
      });
    }

    GetVolume() {
      console.log("[video player]", "Current volume requested");
      this.gplayerAPI!["method"]({
        name: "getVolume",
        callback: (res: number) => {
          console.log("[video player] Current volume", res);

          this.PostStateToRuntime({
            currentVolume: res,
          });
        },
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Genvidtech_GCoreVideoPlugin_ElementHandler =
    ElementHandler;
}
