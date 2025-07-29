/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/lzma";
exports.ids = ["vendor-chunks/lzma"];
exports.modules = {

/***/ "(rsc)/./node_modules/lzma/index.js":
/*!************************************!*\
  !*** ./node_modules/lzma/index.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("//! © 2015 Nathan Rugg <nmrugg@gmail.com> | MIT\n\nvar lzma;\n\nfunction load_lzma()\n{\n    return __webpack_require__(\"(rsc)/./node_modules/lzma sync recursive\")((__webpack_require__(/*! path */ \"path\").join)(__dirname, \"src\" ,\"lzma_worker.js\")).LZMA_WORKER;\n}\n\nlzma = load_lzma();\n\n///NOTE: This function is for backwards compatibility's sake.\nmodule.exports.LZMA = function LZMA()\n{\n    return lzma;\n}\n\nmodule.exports.compress   = lzma.compress;\nmodule.exports.decompress = lzma.decompress;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbHptYS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxnRUFBUSw4Q0FBb0Isb0NBQW9DLENBQUM7QUFDNUU7O0FBRUE7O0FBRUE7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2Qix5QkFBeUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jczItc2tpbi10cmFja2VyLy4vbm9kZV9tb2R1bGVzL2x6bWEvaW5kZXguanM/YWY3ZCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyEgwqkgMjAxNSBOYXRoYW4gUnVnZyA8bm1ydWdnQGdtYWlsLmNvbT4gfCBNSVRcblxudmFyIGx6bWE7XG5cbmZ1bmN0aW9uIGxvYWRfbHptYSgpXG57XG4gICAgcmV0dXJuIHJlcXVpcmUocmVxdWlyZShcInBhdGhcIikuam9pbihfX2Rpcm5hbWUsIFwic3JjXCIgLFwibHptYV93b3JrZXIuanNcIikpLkxaTUFfV09SS0VSO1xufVxuXG5sem1hID0gbG9hZF9sem1hKCk7XG5cbi8vL05PVEU6IFRoaXMgZnVuY3Rpb24gaXMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5J3Mgc2FrZS5cbm1vZHVsZS5leHBvcnRzLkxaTUEgPSBmdW5jdGlvbiBMWk1BKClcbntcbiAgICByZXR1cm4gbHptYTtcbn1cblxubW9kdWxlLmV4cG9ydHMuY29tcHJlc3MgICA9IGx6bWEuY29tcHJlc3M7XG5tb2R1bGUuZXhwb3J0cy5kZWNvbXByZXNzID0gbHptYS5kZWNvbXByZXNzO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/lzma/index.js\n");

/***/ })

};
;