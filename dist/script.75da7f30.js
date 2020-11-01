// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"third_party/Metronome.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Copyright (C) 2019 Center for Computer Research in Music and Acoustics
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 **/
var DEBUG_MODE = false; // 1000ms => n ticks
// e.g. the tick factor of 25 means that 1000ms has 25 ticks in it, 
// thus 1 tick is 40ms.

var TICKS_PER_SEC = 25;
/**
 * The class `Metronome` can be used to drive the trigger function. With
 * given BPM and an AudioContext, the metronome instance can generate a value
 * stream that runs on a specified tempo (i.e. beat per minute).
 *
 * @class
 */

var Metronome = /*#__PURE__*/function () {
  /**
   * @constructor
   * @param {BaseAudioContext} context The associated BaseAudioContext
   * @param {Nunmber} [beatPerMinute=120] BPM
   */
  function Metronome(context, beatPerMinute) {
    _classCallCheck(this, Metronome);

    this._context = context;
    this._state = 'stopped';
    this._beatPerMinute = beatPerMinute || 120;
    this._beatCounter = 0; // In seconds. For the AudioContext time.

    this._interval = 60 / this._beatPerMinute;
    this._nextBeat = null;
    this._lastBeatScheduled = null; // In MS. Based on performance.now().

    this._tick = 1000 / TICKS_PER_SEC;
    this._prevTick = null;
    this._timerIds = [];
    this._boundCallback = this._callback.bind(this); // In MS. For debugging and timer quality.

    this._metric = {
      prev_ts: 0,
      ist_jitter: 0,
      avg_jitter: 0
    };
    this.onbeat = null;
  }
  /**
   * @private
   */


  _createClass(Metronome, [{
    key: "_callback",
    value: function _callback() {
      console.assert(this._state === 'stopped' || this._state === 'running');

      if (this._state === 'stopped') {
        clearTimeout(this._timerId);
        return;
      }

      var now = performance.now();
      var untilNextTick = this._tick - now % this._tick;
      this._metric.ist_jitter = Math.abs(this._tick - (now - this._metric.prev_ts));
      this._metric.avg_jitter = this._metric.avg_jitter * 0.75 + this._metric.ist_jitter * 0.25;
      this._metric.prev_ts = now;
      var currentTime = this._context.currentTime;
      var nextBeat = currentTime - currentTime % this._interval + this._interval;

      if (nextBeat - currentTime < this._tick / 1000) {
        if (nextBeat !== this._lastBeatScheduled) {
          if (this.onbeat) this.onbeat(nextBeat, this._interval, this._beatCounter);
          this._beatCounter++;
          this._lastBeatScheduled = nextBeat;
        }
      }

      if (this._timerId) clearTimeout(this._timerId);
      this._timerId = setTimeout(this._boundCallback, untilNextTick);

      if (DEBUG_MODE) {
        console.log("AVG JITTER=".concat(this._metric.avg_jitter.toFixed(4), "ms"));
      }
    }
    /**
     * Sets BPM for the metronome.
     * @param {Number} [beatPerMinute] BPM
     */

  }, {
    key: "setBPM",
    value: function setBPM(beatPerMinute) {
      this._beatPerMinute = beatPerMinute;
      this._interval = 60 / this._beatPerMinute;
    }
    /**
     * Resets the beat counter to zero.
     */

  }, {
    key: "resetCounter",
    value: function resetCounter() {
      this._counter = 0;
    }
    /**
     * Starts the metronome.
     */

  }, {
    key: "start",
    value: function start() {
      if (this._state === 'running') return;

      this._context.resume();

      this._state = 'running';

      this._callback();
    }
    /**
     * Stops the metronome.
     */

  }, {
    key: "stop",
    value: function stop() {
      if (this._state === 'stopped') return;
      this._state = 'stopped';

      this._callback();
    }
  }]);

  return Metronome;
}();

var _default = Metronome;
exports.default = _default;
},{}],"third_party/CreateBufferMap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Copyright (C) 2019 Center for Computer Research in Music and Acoustics
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 **/

/**
 * @param {BaseAudioContext} audioContext The associated BaseAudioContext
 * @param {object} sampleDataCollection
 */
var _default = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(audioContext, sampleDataCollection) {
    var bufferMap, index, sampleData, response, arrayBuffer, audioBuffer;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bufferMap = {};
            _context.t0 = regeneratorRuntime.keys(sampleDataCollection);

          case 2:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 24;
              break;
            }

            index = _context.t1.value;

            if (!Object.prototype.hasOwnProperty.call(sampleDataCollection, index)) {
              _context.next = 22;
              break;
            }

            sampleData = sampleDataCollection[index];
            _context.prev = 6;
            _context.next = 9;
            return fetch(sampleData.url);

          case 9:
            response = _context.sent;
            _context.next = 12;
            return response.arrayBuffer();

          case 12:
            arrayBuffer = _context.sent;
            _context.next = 15;
            return audioContext.decodeAudioData(arrayBuffer);

          case 15:
            audioBuffer = _context.sent;
            bufferMap[sampleData.key] = audioBuffer;
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t2 = _context["catch"](6);
            throw new Error("[CreateBufferMap] ".concat(_context.t2, " (").concat(sampleData.url, ")"));

          case 22:
            _context.next = 2;
            break;

          case 24:
            return _context.abrupt("return", bufferMap);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 19]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;
},{}],"node_modules/@vanillaes/csv/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.stringify = stringify;

/**
 * Parse takes a string of CSV data and converts it to a 2 dimensional array
 *
 * options
 * - typed - infer types [false]
 *
 * @static
 * @param {string} csv the CSV string to parse
 * @param {Object} [options] an object containing the options
 * @param {Function} [reviver] a custom function to modify the values
 * @returns {Array} a 2 dimensional array of `[entries][values]`
 */
function parse(csv, options) {
  var reviver = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (v) {
    return v;
  };
  var ctx = Object.create(null);
  ctx.options = options || {};
  ctx.reviver = reviver;
  ctx.value = '';
  ctx.entry = [];
  ctx.output = [];
  ctx.col = 1;
  ctx.row = 1;
  var lexer = new RegExp(new RegExp("\"|,|\\r\\n|\\n|\\r|[^\",\\r\\n]+", "y"));
  var isNewline = new RegExp(/^(\r\n|\n|\r)$/);
  var matches = [];
  var match = '';
  var state = 0;

  while ((matches = lexer.exec(csv)) !== null) {
    match = matches[0];

    switch (state) {
      case 0:
        // start of entry
        switch (true) {
          case match === '"':
            state = 3;
            break;

          case match === ',':
            state = 0;
            valueEnd(ctx);
            break;

          case isNewline.test(match):
            state = 0;
            valueEnd(ctx);
            entryEnd(ctx);
            break;

          default:
            ctx.value += match;
            state = 2;
            break;
        }

        break;

      case 2:
        // un-delimited input
        switch (true) {
          case match === ',':
            state = 0;
            valueEnd(ctx);
            break;

          case isNewline.test(match):
            state = 0;
            valueEnd(ctx);
            entryEnd(ctx);
            break;

          default:
            state = 4;
            throw Error("CSVError: Illegal state [row:".concat(ctx.row, ", col:").concat(ctx.col, "]"));
        }

        break;

      case 3:
        // delimited input
        switch (true) {
          case match === '"':
            state = 4;
            break;

          default:
            state = 3;
            ctx.value += match;
            break;
        }

        break;

      case 4:
        // escaped or closing delimiter
        switch (true) {
          case match === '"':
            state = 3;
            ctx.value += match;
            break;

          case match === ',':
            state = 0;
            valueEnd(ctx);
            break;

          case isNewline.test(match):
            state = 0;
            valueEnd(ctx);
            entryEnd(ctx);
            break;

          default:
            throw Error("CSVError: Illegal state [row:".concat(ctx.row, ", col:").concat(ctx.col, "]"));
        }

        break;
    }
  } // flush the last value


  if (ctx.entry.length !== 0) {
    valueEnd(ctx);
    entryEnd(ctx);
  }

  return ctx.output;
}
/**
 * Stringify takes a 2 dimensional array of `[entries][values]` and converts them to CSV
 *
 * options
 * - eof - add a trailing newline at the end of file [true]
 *
 * @static
 * @param {Array} array the input array to stringify
 * @param {Object} [options] an object containing the options
 * @param {Function} [replacer] a custom function to modify the values
 * @returns {string} the CSV string
 */


function stringify(array) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var replacer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (v) {
    return v;
  };
  var ctx = Object.create(null);
  ctx.options = options;
  ctx.options.eof = ctx.options.eof !== undefined ? ctx.options.eof : true;
  ctx.row = 1;
  ctx.col = 1;
  ctx.output = '';
  var needsDelimiters = new RegExp(/"|,|\r\n|\n|\r/);
  array.forEach(function (row, rIdx) {
    var entry = '';
    ctx.col = 1;
    row.forEach(function (col, cIdx) {
      if (typeof col === 'string') {
        col = col.replace('"', '""');
        col = needsDelimiters.test(col) ? "\"".concat(col, "\"") : col;
      }

      entry += replacer(col, ctx.row, ctx.col);

      if (cIdx !== row.length - 1) {
        entry += ',';
      }

      ctx.col++;
    });

    switch (true) {
      case ctx.options.eof:
      case !ctx.options.eof && rIdx !== array.length - 1:
        ctx.output += "".concat(entry, "\n");
        break;

      default:
        ctx.output += "".concat(entry);
        break;
    }

    ctx.row++;
  });
  return ctx.output;
}
/** @private */


function valueEnd(ctx) {
  var value = ctx.options.typed ? inferType(ctx.value) : ctx.value;
  ctx.entry.push(ctx.reviver(value, ctx.row, ctx.col));
  ctx.value = '';
  ctx.col++;
}
/** @private */


function entryEnd(ctx) {
  ctx.output.push(ctx.entry);
  ctx.entry = [];
  ctx.row++;
  ctx.col = 1;
}
/** @private */


function inferType(value) {
  var isNumber = new RegExp(/.\./);

  switch (true) {
    case value === 'true':
    case value === 'false':
      return value === 'true';

    case isNumber.test(value):
      return parseFloat(value);

    case isFinite(value):
      return parseInt(value);

    default:
      return value;
  }
}
},{}],"third_party/LoadCSV.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("@vanillaes/csv/index.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Copyright (C) 2020 Center for Computer Research in Music and Acoustics
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 **/

/**
 * @typedef {object} M15NCSVData
 * @property {object} metadata
 * @property {object} metadata.skipped The number of skipped rows while sanitizing
 * @property {object} metadata.columns The number of columns in payload
 * @property {object} metadata.rows The number of rows in payload
 * @property {array} metadata.maxValues Max values for each column
 * @property {array} metadata.minValues Min values for each column
 * @property {array} payload Data array (1D or 2D)
 */

/**
 * Loads a CSV file and returns a JS object with sanitized numeric data.
 * @param {string} url An URL for a CSV file
 * @param {object} formatOptions Various options for data parsing/sanitizing
 * @param {number!} formatOptions.columns The number of columns
 * @param {boolean} formatOptions.normalize Flag for normalization. (0.0 ~ 1.0)
 * @param {array<any>} formatOptions.ignore Values to ignore.
 * @returns {M15NCSVData}
 */
var loadCSV = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var response, text;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch(url);

          case 2:
            response = _context.sent;
            _context.next = 5;
            return response.text();

          case 5:
            text = _context.sent;
            return _context.abrupt("return", (0, _index.parse)(text));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function loadCSV(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = loadCSV;
exports.default = _default;
},{"@vanillaes/csv/index.js":"node_modules/@vanillaes/csv/index.js"}],"script.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _Metronome = _interopRequireDefault(require("./third_party/Metronome.js"));

var _CreateBufferMap = _interopRequireDefault(require("./third_party/CreateBufferMap.js"));

var _LoadCSV = _interopRequireDefault(require("./third_party/LoadCSV"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var context_ = new AudioContext();
var panner1_ = new PannerNode(context_, {
  panningModel: "HRTF"
});
var panner2_ = new PannerNode(context_, {
  panningModel: "HRTF"
});
var reverb_ = new ConvolverNode(context_);
var w = 512;
var h = 1;
var canvas = document.getElementById("c");
canvas.width = w;
canvas.height = h;
var ctx = canvas.getContext("2d");
var pos = {
  x: 0,
  y: 0
};
panner1_.connect(reverb_);
panner2_.connect(reverb_);
reverb_.connect(context_.destination);
panner1_.positionX.value = -1.0;
panner2_.positionX.value = 1.0;

var poll = function poll(color) {
  if (ctx.fillStyle != color) ctx.fillStyle = color;
  ctx.fillRect(pos.x, pos.y, 1, 1);
  pos.x += 1;

  if (pos.x + 1 > w) {
    pos.y += 1;
    pos.x = 0;
    window.scrollTo(0, pos.y - window.innerHeight);
  }
};

var date = function date(text) {
  ctx.fillStyle = "black";
  ctx.fillText(text, pos.x, pos.y);
};

var playGrain = function playGrain(output, buffer, start, duration, value) {
  var source = new AudioBufferSourceNode(context_);
  var amp = new GainNode(context_);
  source.connect(amp).connect(output);
  source.buffer = buffer;
  source.loop = true; // Grain!

  var grainStart = start + duration * Math.random();
  var bufferOffset = source.buffer.length * value;
  var grainDuration = 0.05 + duration * value;
  amp.gain.setValueAtTime(0.0, grainStart);
  amp.gain.linearRampToValueAtTime(0.7, grainStart + grainDuration * 0.5);
  amp.gain.linearRampToValueAtTime(0.0, grainStart + grainDuration);
  source.playbackRate.value = 1 + value;
  source.start(grainStart, bufferOffset, grainDuration);
};

var playDataSet = function playDataSet(bufferMap, csvData, timeStart, timeEnd) {
  var metro = new _Metronome.default(context_, 240); //365.25);

  var values = csvData;
  var q = Math.floor((timeEnd - timeStart) / 1000 / 60 / 60 / 24 / 7);
  var sI = 0; // console.log("V", values);

  metro.onbeat = function (start, duration, counter) {
    if (counter >= q) {
      metro.stop();
      return;
    }

    var tS = timeStart + counter / q * (-timeStart + timeEnd);
    var tE = timeStart + (counter + 1) / q * (-timeStart + timeEnd); // if(counter%4===0){
    //   date(new Date(tS));
    // }

    document.getElementById("time").innerText = new Date(tS);
    var M = values.findIndex(function (y) {
      return y[0] >= tE;
    });
    var mp0 = values.splice(0, M); // sI=M;

    var qz = mp0.map(function (x) {
      return x[1];
    }); // for(let o=0;o<qz.length/10;o++){
    //   let color=["blue","red"][qz[o]];
    //   poll(color);
    // }
    // while(qz.length<10000){
    //   qz.splice(Math.floor(Math.random()*qz.length),0,[2]);
    // }

    for (var o = 0; o < qz.length; o++) {
      var color = o < qz.length ? ["blue", "red", "white"][qz[o]] : "white";
      poll(color);
    }

    var mp = [0, 1].map(function (x) {
      return values.filter(function (y) {
        return y[1] === x;
      }).length / 100000;
    });
    console.log(counter, q, mp, new Date(tS), new Date(tE));
    playGrain(panner1_, bufferMap.ca, start, duration, mp[0]);
    playGrain(panner2_, bufferMap.ny, start, duration, mp[1]);
  };

  metro.start();
};

var OnStartButtonClicked = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var csvData, events, fires, keyR, sc, lastId, i, rowR, ans, pId, sDate, eDate, count, st, minT, maxT, ev, k, j, t, bufferMap;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _LoadCSV.default)("./data/president_polls.csv");

          case 2:
            csvData = _context.sent;
            events = [];
            fires = [[], []];
            keyR = csvData[0];
            sc = 100000;
            lastId = "-1";

            for (i = 1; i < csvData.length; i++) {
              rowR = csvData[i];
              ans = rowR[keyR.indexOf("answer")];
              pId = rowR[keyR.indexOf("poll_id")];
              sDate = new Date(rowR[keyR.indexOf("start_date")]).getTime();
              eDate = new Date(rowR[keyR.indexOf("end_date")]).getTime();
              count = parseFloat(rowR[keyR.indexOf("sample_size")]) * parseFloat(rowR[keyR.indexOf("pct")]) / 100;

              if (!isNaN(count / sc) && isFinite(count / sc)) {
                count = Math.round(count);
                st = lastId === pId;
                lastId = pId;

                if (!st) {
                  events.push({
                    timeStart: sDate,
                    duration: Math.max(eDate - sDate, 1000 * 60 * 60 * 24),
                    votes: [0, 0]
                  });
                }

                if (ans === "Biden") {
                  events[events.length - 1].votes[0] += count;
                } else if (ans === "Trump") {
                  events[events.length - 1].votes[1] += count;
                }
              }
            }

            minT = Infinity;
            maxT = -Infinity;
            console.log("firing logs");

            for (i = 0; i < events.length; i++) {
              // console.log(i, events.length);
              ev = events[i];

              for (k = 0; k < ev.votes.length; k++) {
                for (j = 0; j < ev.votes[k]; j++) {
                  t = ev.timeStart + Math.random() * ev.duration;
                  minT = Math.min(minT, t);
                  maxT = Math.max(maxT, t);
                  fires[k].push(t);
                }
              }
            }

            h = Math.ceil((fires[0].length + fires[1].length) / w);
            canvas.height = h;
            console.log("sorting firing logs"); // for (let i = 0; i < fires.length; i++) fires[i].sort();
            // let minT = Math.min(...fires.filter((x) => x.length > 0).map((x) => x.reduce((a,b)=>Math.min(a,b))));
            // let maxT = Math.max(
            //   ...fires.filter((x) => x.length > 0).map((x) => x.reduce((a,b)=>Math.max(a,b)))
            // );

            console.log("creting b map");
            _context.next = 19;
            return (0, _CreateBufferMap.default)(context_, [{
              key: "ny",
              url: "./sound/ny.m4a"
            }, {
              key: "ca",
              url: "./sound/waves.m4a"
            }, {
              key: "heavy",
              url: "./sound/heavy.wav"
            }]);

          case 19:
            bufferMap = _context.sent;
            reverb_.buffer = bufferMap.heavy;
            playDataSet(bufferMap, fires.map(function (x, i) {
              return x.map(function (y) {
                return [y, i];
              });
            }).reduce(function (a, b) {
              return a.concat(b);
            }).sort(function (a, b) {
              return a[0] - b[0];
            }), minT, maxT);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function OnStartButtonClicked() {
    return _ref.apply(this, arguments);
  };
}();

window.addEventListener("load", function () {
  var buttonEl = document.getElementById("start");
  buttonEl.addEventListener("click", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            buttonEl.disabled = true;
            _context2.next = 3;
            return OnStartButtonClicked();

          case 3:
            buttonEl.textContent = "PLAYING";

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});
},{"regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","./third_party/Metronome.js":"third_party/Metronome.js","./third_party/CreateBufferMap.js":"third_party/CreateBufferMap.js","./third_party/LoadCSV":"third_party/LoadCSV.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "37419" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map