
const SDK = self.SDK;

const PLUGIN_CLASS = SDK.Plugins.Genvidtech_VideoPlayerPlugin2;

PLUGIN_CLASS.Instance = class MyDOMInstance extends SDK.IWorldInstanceBase
{
	constructor(sdkType, inst)
	{
		super(sdkType, inst);
		
		// Lazy-created IWebGLText object for button text
		this._webglText = null;
	}
	
	Release()
	{
		// Release the WebGL text if it was created
		if (this._webglText)
		{
			this._webglText.Release();
			this._webglText = null;
		}
	}
	
	OnCreate()
	{
		// // Default to top-left origin
		// this._inst.SetOrigin(0, 0);
	}
	
	// Render a button label on a grey background for the editor as a placeholder.
	// Note the pixel-snapping path for text rendering is omitted for brevity. See the editorTextPlugin
	// template for a full text rendering implementation.
	Draw(iRenderer, iDrawParams)
	{
	}
	
	OnPropertyChanged(id, value)
	{
	}
	
	LoadC2Property(name, valueString)
	{
		return false;		// not handled
	}
};
