module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("V034");


/***/ }),

/***/ "FiKB":
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "OiCc":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("FiKB");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
var _mongoose$models;


const UserSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  name: String,
  images: [{
    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  date: {
    type: Date,
    default: Date.now
  }
});
/* harmony default export */ __webpack_exports__["a"] = (((_mongoose$models = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.models) === null || _mongoose$models === void 0 ? void 0 : _mongoose$models.User) || mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('User', UserSchema));

/***/ }),

/***/ "RuLO":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("FiKB");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


async function dbConnect() {
  if (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connection.readyState >= 1) {
    return;
  }

  return mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
}

/* harmony default export */ __webpack_exports__["a"] = (dbConnect);

/***/ }),

/***/ "V034":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return handler; });
/* harmony import */ var _utils_dbConnect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("RuLO");
/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("OiCc");
/* harmony import */ var _models_Image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("kP+l");



async function handler(req, res) {
  const {
    method
  } = req;
  await Object(_utils_dbConnect__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])();

  switch (method) {
    case 'GET':
      try {
        const users = await _models_User__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].find({}).populate('images'); // console.log(users.iamges)

        res.status(200).json({
          success: true,
          data: users
        });
      } catch (error) {
        res.status(400).json({
          success: false
        });
      }

      break;

    case 'POST':
      try {
        const user = await _models_User__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].findOneAndUpdate({
          name: req.body.name
        }, {
          "$addToSet": {
            "images": req.body.images
          }
        }, {
          new: true,
          upsert: true
        });
        req.body.images.map(async id => {
          await _models_Image__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].findByIdAndUpdate(id, {
            user: user._id
          });
        });
        res.status(201).json({
          success: true,
          data: user
        });
      } catch (error) {
        res.status(400).json({
          success: false
        });
      }

      break;

    case 'PUT':
      try {
        console.log(req.body);
        const user = await _models_User__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].findByIdAndUpdate(req.body.id, {
          name: req.body.name
        }, (err, doc) => console.log(doc));

        if (!user) {
          return res.status(400).json({
            success: false
          });
        }

        res.status(200).json({
          success: true,
          data: user
        });
      } catch (error) {
        res.status(400).json({
          success: false
        });
      }

      break;

    case 'DELETE':
      try {
        const deleteUser = await _models_User__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].findByIdAndRemove(req.body).populate('images'); // .exec((err, user) => {
        //     user.images.map(async (image) => {
        //         await Image.findByIdAndRemove(image._id)
        //     })
        // })

        if (!deleteUser) return res.status(400).json({
          success: false
        });
        deleteUser.images.map(async image => {
          await _models_Image__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].findByIdAndRemove(image._id);
        });
        res.status(200).json({
          success: true,
          data: {}
        });
      } catch (error) {
        res.status(400).json({
          success: false
        });
      }

      break;

    default:
      res.status(400).json({
        success: false
      });
      break;
  }
}

/***/ }),

/***/ "kP+l":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("FiKB");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

const ImageSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  name: String,
  url: String,
  croped: Boolean,
  user: {
    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  }
});
/* harmony default export */ __webpack_exports__["a"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.models.Image || mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Image', ImageSchema));

/***/ })

/******/ });