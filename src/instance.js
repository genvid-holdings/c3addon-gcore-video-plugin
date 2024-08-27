
const SDK = self.SDK;

const PLUGIN_CLASS = SDK.Plugins.Genvidtech_VideoPlayerPlugin2;

PLUGIN_CLASS.Instance = class MyDOMInstance extends SDK.IInstanceBase
{
	constructor(sdkType, inst)
	{
		super(sdkType, inst);
	}
	
	Release()
	{
	}
	
	OnCreate()
	{
	}
	
	OnPropertyChanged(id, value)
	{
	}
};
