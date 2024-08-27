const C3 = self.C3;

// NOTE: use a unique DOM component ID to ensure it doesn't clash with anything else.
// This must also match the ID in plugin.js and domSide.js.
const DOM_COMPONENT_ID = "mycompany-mydomplugin";

C3.Plugins.Genvidtech_VideoPlayerPlugin2.Instance = class MyDOMInstance extends C3.SDKInstanceBase
{
	constructor(inst, properties)
	{
		super(inst, DOM_COMPONENT_ID);

		this._isPlaying = false;
		this._isPaused = false;
	}
	
	Release()
	{
		super.Release();
	}
	
	_OnStateChanged(e) {
		if (e.state) {
		  // Check if player state has been updated
		  switch (e.state.playerState) {
			case "playing": {
			  this._isPlaying = true;
			  this._isPaused = false;
	
			  break;
			}
			case "paused": {
			  this._isPaused = true;
			  this._isPlaying = false;
	
			  break;
			}
		  }
		}
	
		// // Trigger 'On State Changed' in the event system
		// this.Trigger(C3.Plugins.Genvidtech_VideoPlayerPlugin.Cnds.OnStateChanged);
	  }

	_Load()
	{
		this.PostToDOM("load");
	}

	_Play()
	{
		this.PostToDOM("play");
	}

	_Pause()
	{
		this.PostToDOM("pause");
	}

	SaveToJson()
	{
		return {
			// data to be saved for savegames
		};
	}
	
	LoadFromJson(o)
	{
		// load state for savegames
	}

	GetScriptInterfaceClass()
	{
		return self.IMyDOMInstance;
	}
};

// Script interface. Use a WeakMap to safely hide the internal implementation details from the
// caller using the script interface.
const map = new WeakMap();

self.IMyDOMInstance = class IMyDOMInstance extends self.IInstance {
	constructor()
	{
		super();
		
		// Map by SDK instance
		map.set(this, self.IInstance._GetInitInst().GetSdkInstance());
	}
};
