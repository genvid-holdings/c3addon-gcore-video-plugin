const C3 = self.C3;

// NOTE: use a unique DOM component ID to ensure it doesn't clash with anything else
// This must also match the ID in instance.js and domSide.js.
const DOM_COMPONENT_ID = "mycompany-mydomplugin";

// NOTE: DOM plugins derive from C3.SDKDOMPluginBase, not C3.SDKPluginBase.
C3.Plugins.Genvidtech_VideoPlayerPlugin2 = class MyDOMPlugin extends C3.SDKDOMPluginBase
{
	constructor(opts)
	{
		super(opts, DOM_COMPONENT_ID);

		this.AddElementMessageHandler("state-changed", (sdkInst, e) => {
			sdkInst._OnStateChanged(e);
		  });
	}
	
	Release()
	{
		super.Release();
	}
};
