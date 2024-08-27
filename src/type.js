
const SDK = self.SDK;

const PLUGIN_CLASS = SDK.Plugins.Genvidtech_VideoPlayerPlugin2;

PLUGIN_CLASS.Type = class MyDOMPluginType extends SDK.ITypeBase
{
	constructor(sdkPlugin, iObjectType)
	{
		super(sdkPlugin, iObjectType);
	}
};
