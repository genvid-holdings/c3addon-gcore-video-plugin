const C3 = self.C3;

// NOTE: use a unique DOM component ID to ensure it doesn't clash with anything else.
// This must also match the ID in plugin.js and domSide.js.
const DOM_COMPONENT_ID = "mycompany-mydomplugin";

// NOTE: DOM instances derive from C3.SDKDOMInstanceBase, not C3.SDKWorldInstanceBase.
C3.Plugins.Genvidtech_VideoPlayerPlugin2.Instance = class MyDOMInstance extends C3.SDKDOMInstanceBase
{
	constructor(inst, properties)
	{
		super(inst, DOM_COMPONENT_ID);

		this._isPlaying = false;
		
		if (properties)
		{
			this._text = properties[0];
		}
		
		// Create an element for this instance. The runtime handles this and will result in a call
		// to CreateElement() in domSide.js where the real DOM calls are made.
		this.CreateElement();
	}
	
	Release()
	{
		this.PostToDOMElement("dispose");

		super.Release();
	}
	
	GetElementState()
	{
		// Return JSON with the state of the element. This is passed along to both CreateElement()
		// and UpdateState() in domSide.js. It provides a convenient way to send all the DOM element
		// state in one go, ensuring any changes are reflected in the real element.
		return {
			"text": this._text
		};
	}

	_SetState(state) {
		if (this._state === state) {
		  return;
		}
	
		// Update the locally video player state.
		this._state = state;
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
	
		this._SetState(e.state);
	
		// // Trigger 'On State Changed' in the event system
		// this.Trigger(C3.Plugins.Genvidtech_VideoPlayerPlugin.Cnds.OnStateChanged);
	  }

	_Play()
	{
		this.PostToDOMElement("play");
	}

	_Pause()
	{
		this.PostToDOMElement("pause");
	}
	
	Draw(renderer)
	{
		// not used - a DOM element is positioned at this instance instead
	}
	
	SaveToJson()
	{
		return {
			// data to be saved for savegames
			"text": this._text
		};
	}
	
	LoadFromJson(o)
	{
		// load state for savegames
		this._text = o["text"];
		
		this.UpdateElementState();		// ensures any state changes are updated in the DOM
	}

	GetScriptInterfaceClass()
	{
		return self.IMyDOMInstance;
	}
};

// Script interface. Use a WeakMap to safely hide the internal implementation details from the
// caller using the script interface.
const map = new WeakMap();

self.IMyDOMInstance = class IMyDOMInstance extends self.IDOMInstance {
	constructor()
	{
		super();
		
		// Map by SDK instance
		map.set(this, self.IInstance._GetInitInst().GetSdkInstance());
	}

	// Example setter/getter property on script interface
	set text(t)
	{
		map.get(this)._Play(t);
	}

	get text()
	{
		return map.get(this)._GetText();
	}
};
