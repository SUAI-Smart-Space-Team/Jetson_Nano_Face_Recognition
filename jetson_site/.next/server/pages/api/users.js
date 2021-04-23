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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ({

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("V034");


/***/ }),

/***/ "FiKB":
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "RDmp":
/***/ (function(module, exports) {

module.exports = require("cloudinary");

/***/ }),

/***/ "RuLO":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("FiKB");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("RDmp");
/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cloudinary__WEBPACK_IMPORTED_MODULE_1__);

 //connect to db 

async function dbConnect() {
  //return if connetcion exist 
  if (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connection.readyState >= 1) {
    return;
  }

  cloudinary__WEBPACK_IMPORTED_MODULE_1__["v2"].config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME
  });
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
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ handler; });

// EXTERNAL MODULE: ./utils/dbConnect.js
var dbConnect = __webpack_require__("RuLO");

// EXTERNAL MODULE: external "mongoose"
var external_mongoose_ = __webpack_require__("FiKB");
var external_mongoose_default = /*#__PURE__*/__webpack_require__.n(external_mongoose_);

// CONCATENATED MODULE: ./models/User.js

const UserSchema = new external_mongoose_default.a.Schema({
  name: String,
  images: [{
    type: external_mongoose_default.a.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  date: {
    type: Date,
    default: Date.now
  }
});
/* harmony default export */ var User = (external_mongoose_default.a.models.User || external_mongoose_default.a.model('User', UserSchema));
// EXTERNAL MODULE: ./models/Image.js
var Image = __webpack_require__("kP+l");

// EXTERNAL MODULE: external "cloudinary"
var external_cloudinary_ = __webpack_require__("RDmp");

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__("oyvS");

// CONCATENATED MODULE: ./pages/api/users.js






async function handler(req, res) {
  const {
    method
  } = req;
  await Object(dbConnect["a" /* default */])();

  switch (method) {
    case 'GET':
      try {
        const users = await User.find({}).populate('images');
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
        const user = await User.findOneAndUpdate({
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
          await Image["a" /* default */].findByIdAndUpdate(id, {
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
        const {
          id,
          name,
          images
        } = req.body;

        if (!images) {
          await User.findByIdAndUpdate(id, {
            name
          }, (err, doc) => console.log(doc));
        } else {
          let imageID = [];
          console.log(images);
          images.forEach(({
            path
          }) => {
            const objectId = new external_mongoose_default.a.Types.ObjectId();
            imageID.push(objectId);
            external_cloudinary_["v2"].uploader.upload(Object(external_path_["normalize"])(`public/uploads/${path}`), {
              public_id: objectId
            }, (err, {
              secure_url,
              public_id
            }) => {
              if (err) return console.log(err);
              const image = new Image["a" /* default */]({
                name: public_id,
                url: secure_url,
                user: id,
                _id: objectId,
                croped: true
              });
              image.save(err => console.error(err));
            });
          });
          await User.findOneAndUpdate({
            name
          }, {
            "$addToSet": {
              "images": imageID
            }
          }, {
            new: true,
            upsert: true
          });
        } // if (!user) {
        //     return res.status(400).json({ success: false })
        // }


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

    case 'DELETE':
      try {
        const {
          _id,
          imageId
        } = req.body;

        if (!imageId) {
          const deleteUser = await User.findByIdAndRemove({
            _id
          }).populate('images');
          if (!deleteUser) return res.status(400).json({
            success: false
          });
          deleteUser.images.map(async image => {
            await Image["a" /* default */].findByIdAndRemove(image._id);
          });
        } else {
          const deleteImage = await User.findByIdAndUpdate(_id, {
            "$pullAll": {
              "images": [imageId]
            }
          }).populate('images').exec((err, user) => user.images.forEach(image => image._id == imageId && image.remove())); // if (!deleteUser) return res.status(400).json({ success: false })
          // deleteUser.images.map(async (image) => {
          //     await Image.findByIdAndRemove(image._id)
          // })
        }

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
 // image model

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

/***/ }),

/***/ "oyvS":
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })

/******/ });