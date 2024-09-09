"use strict";
{
	class ElementHandlerMap {
		constructor(domHandler) {
			this._map = new Map();
			this._dom = domHandler;
		}
		Set(element, handler) {
			let id = element.id ?? "";
			if (id !== "") {
				console.error({ error: "Element already have an id", element });
				throw new Error("Element already initialized!");
			}
			id = `gcore_${handler.elementId}`;
			if (this._map.has(id)) {
				console.error({ error: "Handler already exists", id });
				throw new Error("Handler already exists");
			}
			element.id = id;
			this._map.set(id, handler);
			return handler;
		}

		Get(element) {
			const id = element.id;
			if (!id) {
				console.error({ error: "No element Id on element", element });
				throw new Error("No element identifier");
			}
			if (!this._map.has(id)) {
				console.error({ error: "No handler with that id", id });
				throw new Error("Handler does not exist");
			}
			return this._map.get(id);
		}

		Delete(element) {
			const handler = this.Get(element);
			this._map.delete(element.id);
			return handler;
		}
	}

	// At least for preview, that seems to be the best way to "mock" an import.
	// That's also how other built-in plugins seems to work.
	globalThis.GenvidGCorePlugin_ElementHandlerMap = ElementHandlerMap;
}