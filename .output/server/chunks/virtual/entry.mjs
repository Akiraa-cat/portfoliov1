import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineProdDiagnostics } from 'nostics';
import { ansiFormatter } from 'nostics/formatters/ansi';
import { getCurrentScope, ref, watchEffect, getCurrentInstance, onBeforeUnmount, onDeactivated, onActivated, createApp, provide, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, hasInjectionContext, inject, defineAsyncComponent, mergeProps, toRef, watch, nextTick, computed, defineComponent, h, isReadonly, useSSRContext, isRef, isShallow, isReactive, toRaw } from 'vue';
import { f as createError, $ as $fetch, m as isEqual, n as stringifyParsedURL, o as stringifyQuery, p as parseQuery, q as hasProtocol, i as joinURL, v as defu, w as withQuery, x as sanitizeStatusCode, y as parseURL, e as encodePath, z as decodePath, A as isScriptProtocol } from '../_/nitro.mjs';
import { i as injectHead$1, V as VueResolver, b as baseURL, h as headSymbol } from '../routes/renderer.mjs';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
import { VolumeX, Volume2, AlertTriangle, Loader2 } from 'lucide-vue-next';
import { walkResolver } from 'unhead/utils';

function useHead(input, options = {}) {
  const head = options.head || injectHead$1();
  return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
  const scope = getCurrentScope();
  if (scope && !scope.active) {
    return { patch() {
    }, dispose() {
    }, _i: -1 };
  }
  const deactivated = ref(false);
  if (options.onRendered && scope) {
    const _onRendered = options.onRendered;
    options = { ...options, onRendered: (ctx) => scope.run(() => _onRendered(ctx)) };
  }
  let entry;
  watchEffect(() => {
    const i = deactivated.value ? {} : walkResolver(input, VueResolver);
    if (entry) {
      entry.patch(i);
    } else {
      entry = head.push(i, options);
    }
  });
  const vm = getCurrentInstance();
  if (vm) {
    onBeforeUnmount(() => {
      entry.dispose();
    });
    onDeactivated(() => {
      deactivated.value = true;
    });
    onActivated(() => {
      deactivated.value = false;
    });
  }
  return entry;
}

function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
const createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks() {
	return new Hookable();
}

function _getAsyncLocalStorage() {
	return globalThis.AsyncLocalStorage || globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncLocalStorage;
}
const _WeakRef = globalThis.WeakRef || class StrongRef {
	#value;
	constructor(value) {
		this.#value = value;
	}
	deref() {
		return this.#value;
	}
};
function createContext(opts = {}) {
	let currentInstance;
	let isSingleton = false;
	const checkConflict = (instance) => {
		if (currentInstance && currentInstance !== instance) throw new Error("Context conflict");
	};
	let als;
	if (opts.asyncContext) {
		const _AsyncLocalStorage = opts.AsyncLocalStorage || _getAsyncLocalStorage();
		if (_AsyncLocalStorage) als = new _AsyncLocalStorage();
		else console.warn("[unctx] `AsyncLocalStorage` is not provided.");
	}
	const _wrapInstance = (instance) => als && instance !== null && typeof instance === "object" ? { __unctx_weak: new _WeakRef(instance) } : instance;
	const _unwrapInstance = (store) => store && store.__unctx_weak ? store.__unctx_weak.deref() : store;
	const _getCurrentInstance = () => {
		if (als) {
			const store = als.getStore();
			if (store !== void 0) return _unwrapInstance(store);
		}
		return currentInstance;
	};
	return {
		use: () => {
			const _instance = _getCurrentInstance();
			if (_instance === void 0) throw new Error("Context is not available");
			return _instance;
		},
		tryUse: () => {
			return _getCurrentInstance() ?? null;
		},
		set: (instance, replace) => {
			if (!replace) checkConflict(instance);
			currentInstance = instance;
			isSingleton = true;
		},
		unset: () => {
			currentInstance = void 0;
			isSingleton = false;
		},
		call: (instance, callback) => {
			checkConflict(instance);
			currentInstance = instance;
			try {
				return als ? als.run(_wrapInstance(instance), callback) : callback();
			} finally {
				if (!isSingleton) currentInstance = void 0;
			}
		},
		async callAsync(instance, callback) {
			currentInstance = instance;
			const onRestore = () => {
				currentInstance = instance;
			};
			const onLeave = () => currentInstance === instance ? onRestore : void 0;
			asyncHandlers.add(onLeave);
			try {
				const r = als ? als.run(_wrapInstance(instance), callback) : callback();
				if (!isSingleton) currentInstance = void 0;
				return await r;
			} finally {
				asyncHandlers.delete(onLeave);
			}
		}
	};
}
function createNamespace(defaultOpts = {}) {
	const contexts = {};
	return { get(key, opts = {}) {
		if (!contexts[key]) contexts[key] = createContext({
			...defaultOpts,
			...opts
		});
		return contexts[key];
	} };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

//#region node_modules/nuxt/dist/app/diagnostics/_shared.js
/**
* Shared configuration for the runtime (E<N>xxx) diagnostics catalogs.
*
* Catalogs are split by domain and imported directly where used (no barrel),
* so the browser bundle only pulls in the codes a module references. Pair the
* pure-call annotations on each `defineDiagnostics()` with dev-guarded,
* statement-level report calls so report-only diagnostics strip from production.
*
* Codes are stable, fully-qualified `NUXT_E<NNNN>` identifiers. Codes with a
* dedicated docs page resolve a `see:` URL via {@link docsBase}; the rest opt
* out with `docs: false`.
*/
function docsBase(code) {
	return `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
}
var ansi = (open, close) => (s) => `\x1B[${open}m${s}\x1B[${close}m`;
var colors = {
	red: ansi(31, 39),
	yellow: ansi(33, 39),
	cyan: ansi(36, 39),
	gray: ansi(90, 39),
	bold: ansi(1, 22),
	dim: ansi(2, 22)
};
ansiFormatter(colors);
var prodReporter = (diagnostic) => {
	console.error(`[${diagnostic.name}]`);
};
var prodReporters = [prodReporter];
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/core.js
/**
* E1xxx
* Core / Nuxt-instance / lifecycle runtime diagnostics.
*/
var appDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fnuxt.config.mjs
var nuxtLinkDefaults = {
	"componentName": "NuxtLink"};
//#endregion
//#region node_modules/nuxt/dist/app/nuxt.js
function getNuxtAppCtx(id = "nuxt-app") {
	return getContext(id, { asyncContext: false });
}
var NuxtPluginIndicator = "__nuxt_plugin";
/** @since 3.0.0 */
function createNuxtApp(options) {
	let hydratingCount = 0;
	const nuxtApp = {
		_id: options.id || "nuxt-app",
		_scope: effectScope(),
		provide: void 0,
		versions: {
			get nuxt() {
				return "4.5.2";
			},
			get vue() {
				return nuxtApp.vueApp.version;
			}
		},
		payload: shallowReactive({
			...options.ssrContext?.payload || {},
			data: shallowReactive({}),
			state: reactive({}),
			once: /* @__PURE__ */ new Set(),
			_errors: shallowReactive({})
		}),
		static: { data: {} },
		runWithContext(fn) {
			if (nuxtApp._scope.active && !getCurrentScope()) return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
			return callWithNuxt(nuxtApp, fn);
		},
		isHydrating: false,
		deferHydration() {
			if (!nuxtApp.isHydrating) return () => {};
			hydratingCount++;
			let called = false;
			return () => {
				if (called) return;
				called = true;
				hydratingCount--;
				if (hydratingCount === 0) {
					nuxtApp.isHydrating = false;
					return nuxtApp.callHook("app:suspense:resolve");
				}
			};
		},
		_asyncDataPromises: {},
		_asyncData: shallowReactive({}),
		_state: shallowReactive({}),
		_payloadRevivers: {},
		...options
	};
	nuxtApp.payload.serverRendered = true;
	if (nuxtApp.ssrContext) {
		nuxtApp.payload.path = nuxtApp.ssrContext.url;
		nuxtApp.ssrContext.nuxt = nuxtApp;
		nuxtApp.ssrContext.payload = nuxtApp.payload;
		nuxtApp.ssrContext.config = {
			public: nuxtApp.ssrContext.runtimeConfig.public,
			app: nuxtApp.ssrContext.runtimeConfig.app
		};
	}
	nuxtApp.hooks = createHooks();
	nuxtApp.hook = nuxtApp.hooks.hook;
	{
		const contextCaller = async function(hooks, args) {
			for (const hook of hooks) await nuxtApp.runWithContext(() => hook(...args));
		};
		nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, args);
	}
	nuxtApp.callHook = nuxtApp.hooks.callHook;
	nuxtApp.provide = (name, value) => {
		const $name = "$" + name;
		defineGetter(nuxtApp, $name, value);
		defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
	};
	defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
	defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
	const runtimeConfig = options.ssrContext.runtimeConfig;
	nuxtApp.provide("config", runtimeConfig);
	return nuxtApp;
}
/** @since 3.0.0 */
async function applyPlugin(nuxtApp, plugin) {
	if (typeof plugin === "function") {
		const run = () => nuxtApp.runWithContext(() => plugin(nuxtApp));
		const { provide } = await run() || {};
		if (provide && typeof provide === "object") for (const key in provide) nuxtApp.provide(key, provide[key]);
	}
}
/** @since 3.0.0 */
async function applyPlugins(nuxtApp, plugins) {
	let error;
	for (const plugin of plugins) try {
		await applyPlugin(nuxtApp, plugin);
	} catch (e) {
		if (!nuxtApp.payload.error) throw e;
		error ||= e;
	}
	if (error) throw nuxtApp.payload.error || error;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin) {
	if (typeof plugin === "function") return plugin;
	const _name = plugin._name || plugin.name;
	delete plugin.name;
	return Object.assign(plugin.setup || (() => {}), plugin, {
		[NuxtPluginIndicator]: true,
		_name
	});
}
/**
* Ensures that the setup function passed in has access to the Nuxt instance via `useNuxtApp`.
* @param nuxt A Nuxt instance
* @param setup The function to call
* @since 3.0.0
*/
function callWithNuxt(nuxt, setup, args) {
	const fn = () => setup();
	const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
	return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
}
function tryUseNuxtApp(id) {
	let nuxtAppInstance;
	if (hasInjectionContext()) nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
	nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
	return nuxtAppInstance || null;
}
function useNuxtApp(id) {
	const nuxtAppInstance = tryUseNuxtApp(id);
	if (!nuxtAppInstance) throw appDiagnostics.NUXT_E1001();
	return nuxtAppInstance;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig(_event) {
	return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
	Object.defineProperty(obj, key, { get: () => val });
}
//#endregion
//#region node_modules/nuxt/dist/app/utils.js
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
//#endregion
//#region node_modules/nuxt/dist/app/components/injections.js
var PageRouteSymbol = Symbol("route");
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/navigation.js
/**
* E2xxx
* Navigation / routing / middleware runtime diagnostics.
*/
var navigationDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/app/composables/router.js
/** @since 3.0.0 */
var useRouter = () => {
	return useNuxtApp()?.$router;
};
/**
* Whether the current effect scope is (a descendant of) the component instance's scope.
* A detached scope (e.g. `createSharedComposable`) outlives the component, so the
* per-page route injected there would freeze after navigation (#18903).
*/
function isScopeWithinInstance(instance) {
	const instanceScope = instance.scope;
	let scope = getCurrentScope();
	while (scope) {
		if (scope === instanceScope) return true;
		scope = scope.parent;
	}
	return false;
}
/** @since 3.0.0 */
var useRoute = (() => {
	if (hasInjectionContext()) {
		const instance = getCurrentInstance();
		if (!instance || isScopeWithinInstance(instance)) return inject(PageRouteSymbol, useNuxtApp()._route);
	}
	return useNuxtApp()._route;
});
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
	return middleware;
}
/** @since 3.0.0 */
var isProcessingMiddleware = () => {
	try {
		if (useNuxtApp()._processingMiddleware) return true;
	} catch {
		return false;
	}
	return false;
};
var HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
var HTML_ATTR_ENCODE_MAP = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&#x27;",
	"<": "&lt;",
	">": "&gt;"
};
function encodeForHtmlAttr(value) {
	return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
/**
* A helper that aids in programmatic navigation within your Nuxt application.
*
* Can be called on the server and on the client, within pages, route middleware, plugins, and more.
* @param {RouteLocationRaw | undefined | null} [to] - The route to navigate to. Accepts a route object, string path, `undefined`, or `null`. Defaults to '/'.
* @param {NavigateToOptions} [options] - Optional customization for controlling the behavior of the navigation.
* @returns {Promise<void | NavigationFailure | false> | false | void | RouteLocationRaw} The navigation result, which varies depending on context and options.
* @see https://nuxt.com/docs/4.x/api/utils/navigate-to
* @since 3.0.0
*/
var navigateTo = (to, options) => {
	to ||= "/";
	const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
	const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
	const isExternal = options?.external || isExternalHost;
	if (isExternal) {
		if (!options?.external) throw navigationDiagnostics.NUXT_E2001({ toPath });
		const { protocol } = new URL(toPath, "http://localhost");
		if (protocol && isScriptProtocol(protocol)) throw navigationDiagnostics.NUXT_E2002({
			toPath,
			protocol
		});
	}
	const inMiddleware = isProcessingMiddleware();
	const router = useRouter();
	const nuxtApp = useNuxtApp();
	if (nuxtApp.ssrContext) {
		const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
		const location = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
		const redirect = async function(response) {
			await nuxtApp.callHook("app:redirected");
			const encodedHeader = encodeURL(location, isExternalHost);
			const encodedLoc = encodeForHtmlAttr(encodedHeader);
			nuxtApp.ssrContext["~renderResponse"] = {
				statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
				body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
				headers: { location: encodedHeader }
			};
			return response;
		};
		if (!isExternal && inMiddleware) {
			router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
			return to;
		}
		return redirect(!inMiddleware ? void 0 : false);
	}
	if (isExternal) {
		nuxtApp._scope.stop();
		if (options?.replace) (void 0).replace(toPath);
		else (void 0).href = toPath;
		if (inMiddleware) {
			if (!nuxtApp.isHydrating) return false;
			return new Promise(() => {});
		}
		return Promise.resolve();
	}
	const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
	return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
/**
* @internal
*/
function resolveRouteObject(to) {
	return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
/**
* @internal
*/
function encodeURL(location, isExternalHost = false) {
	const url = new URL(location, "http://localhost");
	if (!isExternalHost) return url.pathname.replace(/^\/{2,}/, "/") + url.search + url.hash;
	if (location.startsWith("//")) return url.toString().replace(url.protocol, "");
	return url.toString();
}
/**
* Encode the pathname of a route location string. Ensures decoded paths like
* `/café` are percent-encoded to match vue-router's encoded route records.
* Already-encoded paths are not double-encoded.
* @internal
*/
function encodeRoutePath(url) {
	const parsed = parseURL(url);
	return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/error.js
var NUXT_ERROR_SIGNATURE = "__nuxt_error";
/** @since 3.0.0 */
var useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
/** @since 3.0.0 */
var showError = (error) => {
	const nuxtError = createError$1(error);
	try {
		const error = /* @__PURE__ */ useError();
		error.value ||= nuxtError;
	} catch {
		throw nuxtError;
	}
	return nuxtError;
};
/** @since 3.0.0 */
var isNuxtError = (error) => !!error && typeof error === "object" && "__nuxt_error" in error;
/** @since 3.0.0 */
var createError$1 = (error) => {
	if (typeof error !== "string" && error.statusText) error.message ??= error.statusText;
	const nuxtError = createError(error);
	Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
		value: true,
		configurable: false,
		writable: false
	});
	Object.defineProperty(nuxtError, "status", {
		get: () => nuxtError.statusCode,
		configurable: true
	});
	Object.defineProperty(nuxtError, "statusText", {
		get: () => nuxtError.statusMessage,
		configurable: true
	});
	return nuxtError;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Ffetch.mjs
if (!globalThis.$fetch) globalThis.$fetch = $fetch.create({ baseURL: baseURL() });
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fglobal-polyfills.mjs
if (!("global" in globalThis)) globalThis.global = globalThis;
//#endregion
//#region node_modules/nuxt/dist/head/runtime/island-head.js
/**
* No-op `head.push` until the returned `unfreeze` runs. Plugin/transformer
* augmentations on the same head are unaffected.
*/
function freezeHead(head) {
	const realPush = head.push;
	head.push = () => ({
		dispose: () => {},
		patch: () => {},
		_i: 0
	});
	return () => {
		head.push = realPush;
	};
}
//#endregion
//#region node_modules/nuxt/dist/head/runtime/plugins/unhead.server.js
var plugin$2 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:head",
	enforce: "pre",
	setup(nuxtApp) {
		const head = nuxtApp.ssrContext.head;
		if (nuxtApp.ssrContext.islandContext) {
			const unfreeze = freezeHead(head);
			nuxtApp.hooks.hookOnce("app:created", unfreeze);
		}
		nuxtApp.vueApp.use(head);
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/manifest.js
/**
* E5xxx
* App manifest / route-rules runtime diagnostics.
*/
var manifestDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Frouter.options.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default = {};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froute-rules.mjs
var sensitiveMatcher = (m, p) => {
	return [];
};
var foldedMatcher = sensitiveMatcher;
var decodeRoutePath = function decodeRoutePath(path) {
	if (!path.includes("%")) return path;
	const queryIndex = path.indexOf("?");
	const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
	try {
		return queryIndex === -1 ? decodeURI(pathname) : decodeURI(pathname) + path.slice(queryIndex);
	} catch {
		return path;
	}
};
var normalizePath = (path, fold) => {
	if (typeof path !== "string") return path;
	const decoded = decodeRoutePath(path);
	return fold ? decoded.toLowerCase() : decoded;
};
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default = (path) => virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.sensitive ? defu({}, ...sensitiveMatcher("", normalizePath(path, false)).map((r) => r.data).reverse()) : defu({}, ...foldedMatcher("", normalizePath(path, true)).map((r) => r.data).reverse());
//#endregion
//#region node_modules/nuxt/dist/app/composables/manifest.js
var routeRulesMatcher = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default;
function getRouteRules(arg) {
	const path = typeof arg === "string" ? arg : arg.path;
	try {
		return routeRulesMatcher(path);
	} catch (e) {
		manifestDiagnostics.NUXT_E5003({
			path,
			cause: e
		});
		return {};
	}
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fmiddleware.mjs
var globalMiddleware = [/* @__PURE__ */ defineNuxtRouteMiddleware((to) => {})];
//#endregion
//#region node_modules/nuxt/dist/app/plugins/router.js
function getRouteFromPath(fullPath) {
	const route = fullPath && typeof fullPath === "object" ? fullPath : {};
	if (typeof fullPath === "object") fullPath = stringifyParsedURL({
		pathname: fullPath.path || "",
		search: stringifyQuery(fullPath.query || {}),
		hash: fullPath.hash || ""
	});
	const url = new URL(fullPath.toString(), "http://localhost");
	return {
		path: url.pathname,
		fullPath,
		query: parseQuery(url.search),
		hash: url.hash,
		params: route.params || {},
		name: void 0,
		matched: route.matched || [],
		redirectedFrom: void 0,
		meta: route.meta || {},
		href: fullPath
	};
}
var plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:router",
	enforce: "pre",
	setup(nuxtApp) {
		const initialURL = nuxtApp.ssrContext.url;
		const routes = [];
		const hooks = {
			"navigate:before": [],
			"resolve:before": [],
			"navigate:after": [],
			"error": []
		};
		const registerHook = (hook, guard) => {
			hooks[hook].push(guard);
			return () => {
				const index = hooks[hook].indexOf(guard);
				if (index !== -1) hooks[hook].splice(index, 1);
			};
		};
		(/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
		const route = reactive(getRouteFromPath(initialURL));
		let navigationCounter = 0;
		async function handleNavigation(url, replace) {
			const navigationId = ++navigationCounter;
			try {
				const to = getRouteFromPath(url);
				for (const middleware of hooks["navigate:before"]) {
					const result = await middleware(to, route);
					if (navigationId !== navigationCounter) return;
					if (result === false || result instanceof Error) return;
					if (typeof result === "string" && result.length) return await handleNavigation(result, true);
				}
				for (const handler of hooks["resolve:before"]) {
					await handler(to, route);
					if (navigationId !== navigationCounter) return;
				}
				Object.assign(route, to);
				for (const middleware of hooks["navigate:after"]) await middleware(to, route);
			} catch (err) {
				for (const handler of hooks.error) await handler(err);
			}
		}
		const router = {
			currentRoute: computed(() => route),
			isReady: () => Promise.resolve(),
			options: {},
			install: () => Promise.resolve(),
			push: (url) => handleNavigation(url),
			replace: (url) => handleNavigation(url),
			back: () => (void 0).history.go(-1),
			go: (delta) => (void 0).history.go(delta),
			forward: () => (void 0).history.go(1),
			beforeResolve: (guard) => registerHook("resolve:before", guard),
			beforeEach: (guard) => registerHook("navigate:before", guard),
			afterEach: (guard) => registerHook("navigate:after", guard),
			onError: (handler) => registerHook("error", handler),
			resolve: getRouteFromPath,
			addRoute: (parentName, route) => {
				routes.push(route);
			},
			getRoutes: () => routes,
			hasRoute: (name) => routes.some((route) => route.name === name),
			removeRoute: (name) => {
				const index = routes.findIndex((route) => route.name === name);
				if (index !== -1) routes.splice(index, 1);
			}
		};
		nuxtApp.vueApp.component("RouterLink", defineComponent({
			functional: true,
			props: {
				to: {
					type: String,
					required: true
				},
				custom: Boolean,
				replace: Boolean,
				activeClass: String,
				exactActiveClass: String,
				ariaCurrentValue: String
			},
			setup: (props, { slots }) => {
				const navigate = () => handleNavigation(props.to, props.replace);
				return () => {
					const route = router.resolve(props.to);
					return props.custom ? slots.default?.({
						href: props.to,
						navigate,
						route
					}) : h("a", {
						href: props.to,
						onClick: (e) => {
							e.preventDefault();
							return navigate();
						}
					}, slots);
				};
			}
		}));
		nuxtApp._route = route;
		nuxtApp._middleware ||= {
			global: [],
			named: {}
		};
		const initialLayout = nuxtApp.payload.state._layout;
		const initialLayoutProps = nuxtApp.payload.state._layoutProps;
		nuxtApp.hooks.hookOnce("app:created", async () => {
			router.beforeEach(async (to, from) => {
				to.meta = reactive(to.meta || {});
				if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
					to.meta.layout = initialLayout;
					to.meta.layoutProps = initialLayoutProps;
				}
				nuxtApp._processingMiddleware = true;
				nuxtApp._middlewareTo = to;
				if (!nuxtApp.ssrContext?.islandContext) {
					const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
					const routeRules = getRouteRules({ path: to.path });
					if (routeRules.appMiddleware) for (const key in routeRules.appMiddleware) {
						const guard = nuxtApp._middleware.named[key];
						if (!guard) continue;
						if (routeRules.appMiddleware[key]) middlewareEntries.add(guard);
						else middlewareEntries.delete(guard);
					}
					for (const middleware of middlewareEntries) {
						const result = await nuxtApp.runWithContext(() => middleware(to, from));
						if (result === false || result instanceof Error) {
							const error = result || createError({
								status: 404,
								statusText: `Page Not Found: ${initialURL}`,
								data: { path: initialURL }
							});
							delete nuxtApp._processingMiddleware;
							delete nuxtApp._middlewareTo;
							return nuxtApp.runWithContext(() => showError(error));
						}
						if (result === true) continue;
						if (result || result === false) return result;
					}
				}
			});
			router.afterEach(() => {
				delete nuxtApp._processingMiddleware;
				delete nuxtApp._middlewareTo;
			});
			await router.replace(initialURL);
			if (!isEqual(route.fullPath, initialURL)) await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
		});
		return { provide: {
			route,
			router
		} };
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/head.js
/**
* E6xxx
* Head / unhead runtime diagnostics.
*/
var unheadDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/head/runtime/composables.js
/**
* Injects the head client from the Nuxt context or Vue inject.
*/
function injectHead(nuxtApp) {
	const nuxt = nuxtApp || useNuxtApp();
	return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
		if (hasInjectionContext()) {
			const head = inject(headSymbol);
			if (!head) throw unheadDiagnostics.NUXT_E6001();
			return head;
		}
	});
}
function useHead$1(input, options = {}) {
	const head = options.head || injectHead(options.nuxt);
	return useHead(input, {
		head,
		...options
	});
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/payload.js
/**
* This is an experimental function for configuring passing rich data from server -> client.
* @since 3.4.0
*/
function definePayloadReducer(name, reduce) {
	useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
}
//#endregion
//#region node_modules/nuxt/dist/app/plugins/revive-payload.server.js
var reducers = [
	["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
	["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
	["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
	["Ref", (data) => isRef(data) && data.value],
	["Reactive", (data) => isReactive(data) && toRaw(data)]
];
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fplugins.server.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default = [
	plugin$2,
	plugin$1,
	/* @__PURE__ */ defineNuxtPlugin({
		name: "nuxt:revive-payload:server",
		setup() {
			for (const [reducer, fn] of reducers) definePayloadReducer(reducer, fn);
		}
	}),
	/* @__PURE__ */ defineNuxtPlugin({ name: "nuxt:global-components" })
];
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region components/BottomHudFooter.vue
var _sfc_main$7 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<footer${ssrRenderAttrs(mergeProps({
		id: "bottom-hud-footer",
		class: "relative z-20 w-full border-t border-[#2c3539]/80 bg-[#121316]/95 px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-gray-400 font-mono select-none"
	}, _attrs))}><div class="flex items-center gap-3"><span class="text-[#ff2a6d] font-bold">PROTOCOL: PORTFOLIO_REVIEW</span><span class="hidden sm:inline-block text-[#2c3539]">|</span><span class="hidden sm:inline-block text-gray-400"> DIRECTIVE: ACTIVE_DEVELOPMENT_TRACK </span></div><div class="flex items-center gap-4"><span>DATA_ENC: PROJECT_LOGS</span><span class="text-[#e5c158] font-bold">SEC_STATUS: ARCHIVE_READY</span></div></footer>`);
}
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BottomHudFooter.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var BottomHudFooter_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$7, [["ssrRender", _sfc_ssrRender]]), { __name: "BottomHudFooter" });
//#endregion
//#region components/DiagnosticPanel.vue
var _sfc_main$6 = {
	__name: "DiagnosticPanel",
	__ssrInlineRender: true,
	props: {
		isMuted: Boolean,
		onTriggerScreenFlash: Function
	},
	setup(__props) {
		const rebootAttempts = ref(0);
		const isRebooting = ref(false);
		const isPinging = ref(false);
		const progressPercentage = ref(99.04);
		const phaseText = ref("CURATING CORE PROJECT INDEX...");
		const logs = ref([
			{
				id: "1",
				text: "> PORTFOLIO ACCESS AUTHENTICATED // OPERATIVE CREDENTIALS VERIFIED",
				type: "normal"
			},
			{
				id: "2",
				text: "> SPECIALIZATION: FULL-STACK PRODUCT ENGINEERING & SYSTEM DESIGN",
				type: "normal"
			},
			{
				id: "3",
				text: "> LATEST PROJECT: NUXT-POWERED PORTFOLIO EXPERIENCE",
				type: "normal"
			},
			{
				id: "4",
				text: "> SUCCESS RATE: 96% DELIVERY CONFIDENCE",
				type: "normal"
			},
			{
				id: "5",
				text: "> FEATURED ACHIEVEMENT: BUILD SYSTEMS, UI SYSTEMS, AND OPS ENABLEMENT",
				type: "warning"
			},
			{
				id: "6",
				text: "> STATUS: DEVELOPMENT PHASE ACTIVE // READY FOR REVIEW",
				type: "error"
			}
		]);
		const terminalEndRef = ref(null);
		watch(() => logs.value, () => {
			nextTick(() => {
				if (terminalEndRef.value) terminalEndRef.value.scrollIntoView({ behavior: "smooth" });
			});
		}, { deep: true });
		const progressText = computed(() => `${progressPercentage.value.toFixed(2)}%`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				id: "primary-diagnostic-hud",
				class: "w-full chamfer-hud bg-[#121316]/95 border-2 border-[#1a4744] shadow-[0_0_40px_rgba(26,71,68,0.4)] relative overflow-hidden backdrop-blur-md select-none font-mono"
			}, _attrs))}><div class="absolute top-2 left-2 text-[#1a4744]/70 text-[9px] pointer-events-none select-none"> ┌── [PORTFOLIO_OS_V1] ─────────────────────── </div><div class="absolute top-2 right-2 text-[#1a4744]/70 text-[9px] pointer-events-none select-none"> ───────────────────── [ACCESS: VERIFIED] ┐ </div><div class="absolute bottom-2 right-2 text-[#1a4744]/70 text-[9px] pointer-events-none select-none"> [ARCHIVE: ACTIVE_DEV_MODE] ┘ </div><div class="px-5 pt-7 pb-4 md:px-8 border-b border-[#1a4744]/50 flex flex-wrap items-center justify-between gap-4"><div class="space-y-1.5 max-w-2xl"><div class="flex items-center gap-2.5"><span class="w-2.5 h-2.5 bg-[#ff2a6d] shadow-[0_0_8px_#ff2a6d]"></span><h1 class="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white uppercase font-sans"> PORTFOLIO ARCHIVES // OPERATIVE CREDENTIALS VERIFIED </h1></div><p class="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed"> Authenticated operator portfolio access. Core mission logs and codebase partitions are now online and ready for review. </p></div><div class="chamfer-btn bg-[#0a0a0c] border border-[#e5c158] px-3.5 py-1.5 flex flex-col items-end shadow-[0_0_12px_rgba(229,193,88,0.2)]"><span class="text-[9px] text-gray-400 uppercase tracking-widest"> CURRENT STATE </span><span class="text-[#e5c158] font-bold text-xs uppercase flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-[#e5c158] animate-ping"></span> LIVE_PORTFOLIO </span></div></div><div class="p-5 md:p-8 space-y-6"><div class="space-y-2 bg-[#0a0a0c]/80 p-4 border border-[#2c3539] chamfer-card"><div class="flex flex-wrap items-center justify-between text-xs gap-2"><div class="flex items-center gap-2"><span class="text-gray-400 uppercase tracking-wider text-[11px]"> PROJECT STATUS: </span><span class="text-[#ff2a6d] font-bold text-xs">${ssrInterpolate(phaseText.value)}</span></div><div class="text-xs flex items-center gap-2"><span class="text-gray-400">SYNCHRONIZED:</span><span class="text-[#ff2a6d] font-bold text-sm glitch-active">${ssrInterpolate(progressText.value)}</span><span class="text-[10px] text-[#e5c158] bg-[#e5c158]/10 border border-[#e5c158]/50 px-1.5 py-0.5 font-bold"> [ARCHIVE_READY] </span></div></div><div class="w-full h-5 bg-[#0a0a0c] border border-[#1a4744]/80 p-0.5 relative overflow-hidden flex items-center shadow-inner"><div class="h-full bg-gradient-to-r from-[#1a4744] via-[#ff2a6d] to-[#ff2a6d] transition-all duration-300 relative shadow-[0_0_12px_rgba(255,42,109,0.7)]" style="${ssrRenderStyle({ width: `${progressPercentage.value}%` })}"><div class="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_50%,transparent_100%)] w-24 animate-[marquee_2.2s_linear_infinite]"></div></div><div class="absolute right-1 top-0 bottom-0 w-1 bg-[#e5c158] animate-pulse"></div></div><div class="flex justify-between items-center text-[10px] text-gray-500 pt-0.5"><span>0% [INDEXING]</span><span class="text-gray-400"> REVIEW WINDOW: <span class="text-gray-300 font-semibold">ACTIVE // OPEN FOR INSPECTION</span></span><span>100% [ONLINE]</span></div></div><div class="space-y-2"><div class="flex items-center justify-between text-xs text-gray-400 px-1"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-[#ff2a6d]"></span><span class="uppercase tracking-widest text-[11px] text-gray-300 font-bold"> MISSION LOG / ACTIVE PORTFOLIO SIGNAL </span></div><div class="text-[10px] text-[#1a4744] font-bold"> BUFFER: LIVE_ARCHIVE_STREAM </div></div><div id="terminal-log-window" class="bg-[#0a0a0c]/95 border border-[#1a4744]/80 p-4 text-xs sm:text-sm h-48 sm:h-52 overflow-y-auto space-y-1.5 shadow-inner chamfer-card focus:outline-none" tabindex="0"><!--[-->`);
			ssrRenderList(logs.value, (log) => {
				_push(`<!--[-->`);
				if (log.type === "error") _push(`<div class="text-[#ff2a6d] font-bold flex items-center"><span>${ssrInterpolate(log.text)}</span><span class="animate-blink font-bold text-[#ff2a6d] ml-0.5">_</span></div>`);
				else if (log.type === "warning") _push(`<div class="text-[#e5c158]">${ssrInterpolate(log.text)}</div>`);
				else _push(`<div class="text-gray-300">${ssrInterpolate(log.text)}</div>`);
				_push(`<!--]-->`);
			});
			_push(`<!--]--><div></div></div></div><div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2c3539]"><div class="text-[11px] text-gray-400 text-center sm:text-left"><div class="text-gray-300 font-bold">MISSION REVIEW:</div><span> Review entries logged: <span class="text-[#ff2a6d] font-bold">${ssrInterpolate(rebootAttempts.value)}</span>. Mission notes staged for operator inspection. </span></div><div class="flex items-center gap-3 w-full sm:w-auto"><button id="bypassPingBtn" type="button"${ssrIncludeBooleanAttr(isPinging.value || isRebooting.value) ? " disabled" : ""} class="flex-1 sm:flex-none text-center px-4 py-2.5 border border-[#2c3539] hover:border-gray-400 text-gray-400 hover:text-white bg-[#121316] text-xs font-bold uppercase chamfer-btn transition-colors cursor-pointer disabled:opacity-50">${ssrInterpolate(isPinging.value ? "[REVIEWING...]" : "[OPEN CASE NOTES]")}</button><button id="rebootBtn" type="button"${ssrIncludeBooleanAttr(isRebooting.value) ? " disabled" : ""} class="flex-1 sm:flex-none px-6 py-2.5 bg-[#ff2a6d] hover:bg-[#ff2a6d]/90 text-black text-xs sm:text-sm font-bold tracking-wider uppercase chamfer-btn shadow-[0_0_25px_rgba(255,42,109,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80">`);
			if (isRebooting.value) _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin text-black" }, null, _parent));
			else _push(`<!---->`);
			_push(`<span>${ssrInterpolate(isRebooting.value ? "LOADING DEEP-DIVE..." : "VIEW PROJECT DEEP-DIVE [ENTER]")}</span></button></div></div></div><div class="bg-[#121316] px-5 py-3 border-t border-[#1a4744]/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-gray-400"><div><span class="text-gray-500">SPECIALIZATION:</span><span class="text-gray-300">FULL-STACK SYSTEMS</span></div><div><span class="text-gray-500">SUCCESS RATE:</span><span class="text-[#ff2a6d] font-bold">96%</span></div><div><span class="text-gray-500">LATEST PROJECT:</span><span class="text-gray-300">NUXT PORTFOLIO</span></div><div class="text-right sm:text-left"><span class="text-gray-500">FEATURED:</span><span class="text-[#e5c158] font-bold">DEV MODE ACTIVE</span></div></div></div>`);
		};
	}
};
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DiagnosticPanel.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
//#endregion
//#region components/HazardBanner.vue
var _sfc_main$5 = {
	__name: "HazardBanner",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				id: "hazard-warning-strip",
				class: "w-full chamfer-card overflow-hidden border border-[#ff2a6d]/80 shadow-[0_0_30px_rgba(255,42,109,0.22)] select-none"
			}, _attrs))}><div class="hazard-stripes h-3 w-full opacity-90"></div><div class="bg-[#0a0a0c]/95 px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-y border-[#ff2a6d]/40"><div class="flex items-center gap-2.5 text-[#ff2a6d]">`);
			_push(ssrRenderComponent(unref(AlertTriangle), { class: "w-4 h-4 md:w-5 md:h-5 flex-shrink-0 animate-pulse" }, null, _parent));
			_push(`<span class="font-bold text-xs md:text-sm tracking-wider uppercase font-mono"> PORTFOLIO ARCHIVES // OPERATIVE CREDENTIALS VERIFIED </span></div><div class="flex items-center gap-2 text-[11px] font-mono"><span class="text-gray-400">CLEARANCE REQUIRED:</span><span class="bg-[#ff2a6d]/20 text-[#ff2a6d] px-2.5 py-0.5 border border-[#ff2a6d]/60 font-bold uppercase tracking-widest text-[10px] chamfer-pill"> ACCESS: VERIFIED </span></div></div><div class="hazard-stripes h-2.5 w-full opacity-80"></div></div>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HazardBanner.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
//#endregion
//#region components/TopHudHeader.vue
var _sfc_main$4 = {
	__name: "TopHudHeader",
	__ssrInlineRender: true,
	props: { isMuted: Boolean },
	emits: ["toggle-audio"],
	setup(__props, { emit: __emit }) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({
				id: "top-hud-header",
				class: "relative z-20 w-full border-b border-[#2c3539]/80 bg-[#121316]/95 backdrop-blur px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none"
			}, _attrs))}><div class="flex items-center gap-4 md:gap-6"><div class="flex items-center gap-2.5"><span class="relative flex h-2.5 w-2.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2a6d] opacity-75"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff2a6d]"></span></span><span class="font-bold text-white tracking-widest uppercase text-xs md:text-sm"> PORTFOLIO // ARCHIVE ACCESS </span><span class="hidden sm:inline-block px-1.5 py-0.5 border border-[#ff2a6d]/60 text-[#ff2a6d] text-[10px] font-bold bg-[#ff2a6d]/10 tracking-wider"> DEV_BUILD </span></div><div class="hidden md:flex items-center gap-2.5 border-l border-[#2c3539] pl-4"><span class="text-[10px] text-gray-400 uppercase tracking-tight"> SIGNAL GAUGE: </span><div class="flex items-center gap-1"><div class="w-2.5 h-4 bg-[#ff2a6d] chamfer-pill shadow-[0_0_8px_rgba(255,42,109,0.5)]"></div><div class="w-2.5 h-4 bg-[#ff2a6d] chamfer-pill shadow-[0_0_8px_rgba(255,42,109,0.5)]"></div><div class="w-2.5 h-4 bg-[#ff2a6d]/30 chamfer-pill"></div><div class="w-2.5 h-4 bg-[#ff2a6d]/20 chamfer-pill"></div><div class="w-2.5 h-4 bg-[#ff2a6d]/10 chamfer-pill"></div></div><span class="text-[#ff2a6d] font-bold text-[11px] tracking-tight"> [READY FOR REVIEW] </span></div></div><div class="flex items-center gap-3 md:gap-6 text-[11px]"><div class="hidden lg:flex items-center gap-2 text-gray-400"><span>LOC:</span><span class="text-gray-200">OPERATOR // PROJECT_ARCHIVE</span></div><div class="flex items-center gap-1.5 text-[#e5c158]"><span class="inline-block w-1.5 h-1.5 bg-[#e5c158] rounded-full animate-pulse shadow-[0_0_6px_rgba(229,193,88,0.8)]"></span><span class="font-medium">PORTFOLIO_DAEMON: ACTIVE</span></div><button id="audioToggleBtn" type="button" class="px-2.5 py-1 border border-[#2c3539] hover:border-[#ff2a6d] hover:text-[#ff2a6d] bg-[#0a0a0c]/80 text-gray-300 transition-colors uppercase text-[10px] flex items-center gap-1.5 cursor-pointer chamfer-btn" title="Toggle UI Web Audio Synthesizer (Key: M)">`);
			if (__props.isMuted) _push(ssrRenderComponent(unref(VolumeX), { class: "w-3.5 h-3.5 text-gray-400" }, null, _parent));
			else _push(ssrRenderComponent(unref(Volume2), { class: "w-3.5 h-3.5 text-[#ff2a6d] animate-pulse" }, null, _parent));
			_push(`<span>${ssrInterpolate(__props.isMuted ? "AUDIO: MUTED" : "AUDIO: ACTIVE")}</span></button></div></header>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TopHudHeader.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
//#endregion
//#region components/UnreachableNodes.vue
var _sfc_main$3 = {
	__name: "UnreachableNodes",
	__ssrInlineRender: true,
	props: { isMuted: Boolean },
	setup(__props) {
		const NODES = [
			"/overview",
			"/stack",
			"/showcase",
			"/timeline",
			"/notes"
		];
		const deniedNode = ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full flex flex-col items-center gap-2 select-none font-mono" }, _attrs))}><div class="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400"><span class="text-gray-500 uppercase tracking-wider mr-1 text-[10px]"> ARCHIVE PATHS: </span><!--[-->`);
			ssrRenderList(NODES, (node) => {
				_push(`<button type="button" class="px-2.5 py-1 bg-[#121316] border border-[#2c3539]/80 text-gray-500 line-through hover:border-[#ff2a6d]/60 hover:text-[#ff2a6d] transition-colors cursor-pointer text-[11px]"${ssrRenderAttr("title", `Section ${node} remains in active development review`)}> [${ssrInterpolate(node)}] </button>`);
			});
			_push(`<!--]--></div>`);
			if (deniedNode.value) _push(`<div class="text-[10px] text-[#ff2a6d] bg-[#ff2a6d]/10 border border-[#ff2a6d]/40 px-3 py-1 chamfer-card animate-pulse tracking-wide"> ACCESS DENIED: ${ssrInterpolate(deniedNode.value)} REMAINS IN ACTIVE DEVELOPMENT. REVIEW MODE ENFORCED. </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UnreachableNodes.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
//#endregion
//#region app.vue
var _sfc_main$2 = {
	__name: "app",
	__ssrInlineRender: true,
	setup(__props) {
		const isMuted = ref(true);
		const isFlashing = ref(false);
		const triggerScreenFlash = () => {
			isFlashing.value = true;
			setTimeout(() => {
				isFlashing.value = false;
			}, 450);
		};
		const toggleAudio = () => {
			isMuted.value = !isMuted.value;
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-void text-gray-300 font-mono antialiased overflow-x-hidden selection:bg-cyberPink selection:text-black relative flex flex-col justify-between" }, _attrs))}><div class="fixed inset-0 crt-overlay opacity-40 z-50 pointer-events-none"></div><div id="reboot-flash-overlay" class="${ssrRenderClass([isFlashing.value ? "reboot-flash" : "opacity-0", "fixed inset-0 z-60 pointer-events-none transition-none"])}"></div><div class="fixed inset-0 pointer-events-none z-0" style="${ssrRenderStyle({ "background": "radial-gradient(circle at 50% 45%, rgba(255, 42, 109, 0.05) 0%, rgba(26, 71, 68, 0.06) 50%, rgba(10, 10, 12, 0.95) 85%)" })}"></div>`);
			_push(ssrRenderComponent(_sfc_main$4, {
				"is-muted": isMuted.value,
				onToggleAudio: toggleAudio
			}, null, _parent));
			_push(`<main class="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-12"><div class="w-full max-w-4xl flex flex-col gap-6 items-center">`);
			_push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
			_push(ssrRenderComponent(_sfc_main$6, {
				"is-muted": isMuted.value,
				"on-trigger-screen-flash": triggerScreenFlash
			}, null, _parent));
			_push(ssrRenderComponent(_sfc_main$3, { "is-muted": isMuted.value }, null, _parent));
			_push(`</div></main>`);
			_push(ssrRenderComponent(BottomHudFooter_default, null, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-error-page.vue
var _sfc_main$1 = {
	__name: "nuxt-error-page",
	__ssrInlineRender: true,
	props: { error: Object },
	setup(__props) {
		const _error = __props.error;
		const status = Number(_error.statusCode || 500);
		const is404 = status === 404;
		const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
		const description = _error.message || _error.toString();
		const stack = void 0;
		const _Error404 = defineAsyncComponent(() => import('../build/error-404-WUffCVlZ.mjs'));
		const _Error = defineAsyncComponent(() => import('../build/error-500-BwQZWpR8.mjs'));
		const ErrorTemplate = is404 ? _Error404 : _Error;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({
				status: unref(status),
				statusText: unref(statusText),
				statusCode: unref(status),
				statusMessage: unref(statusText),
				description: unref(description),
				stack: unref(stack)
			}, _attrs), null, _parent));
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fisland-renderer.mjs
var IslandRenderer = () => null;
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-root.vue
var _sfc_main = {
	__name: "nuxt-root",
	__ssrInlineRender: true,
	setup(__props) {
		const nuxtApp = useNuxtApp();
		nuxtApp.deferHydration();
		nuxtApp.ssrContext.url;
		const SingleRenderer = false;
		provide(PageRouteSymbol, useRoute());
		nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
		const error = /* @__PURE__ */ useError();
		const abortRender = error.value && !nuxtApp.ssrContext.error;
		function invokeAppErrorHandler(err, target, info) {
			const errorHandler = nuxtApp.vueApp.config.errorHandler;
			if (errorHandler && !errorHandler.__nuxt_default) try {
				errorHandler(err, target, info);
			} catch (handlerError) {
				console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
			}
		}
		onErrorCaptured((err, target, info) => {
			nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
			{
				const p = nuxtApp.runWithContext(() => showError(err));
				onServerPrefetch(() => p);
				invokeAppErrorHandler(err, target, info);
				return false;
			}
		});
		const islandContext = nuxtApp.ssrContext.islandContext;
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderSuspense(_push, {
				default: () => {
					if (unref(abortRender)) _push(`<div></div>`);
					else if (unref(error)) _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
					else if (unref(islandContext)) _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
					else if (unref(SingleRenderer)) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
					else _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
				},
				_: 1
			});
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region node_modules/nuxt/dist/app/entry.js
var entry$1 = async function createNuxtAppServer(ssrContext) {
	const vueApp = createApp(_sfc_main);
	const nuxt = createNuxtApp({
		vueApp,
		ssrContext
	});
	try {
		await applyPlugins(nuxt, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default);
		await nuxt.hooks.callHook("app:created", vueApp);
	} catch (error) {
		await nuxt.hooks.callHook("app:error", error);
		nuxt.payload.error ||= createError$1(error);
	}
	if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) throw new Error("skipping render");
	return vueApp;
};
var entry_default = ((ssrContext) => entry$1(ssrContext));

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: entry_default
}, Symbol.toStringTag, { value: 'Module' }));

export { _plugin_vue_export_helper_default as _, useRouter as a, useRuntimeConfig as b, useNuxtApp as c, nuxtLinkDefaults as d, encodeRoutePath as e, entry as f, navigateTo as n, resolveRouteObject as r, useHead$1 as u };
//# sourceMappingURL=entry.mjs.map
