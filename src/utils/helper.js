/**
 * @fileoverview Helper for the Coding with Chrome editor.
 *
 * This helper class provides shortcuts to get the implemented instances and
 * make sure that they have the correct type.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.utils.Helper');
goog.provide('cwc.utils.HelperInstances');

goog.require('cwc.config.Debug');
goog.require('cwc.config.Prefix');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Features');
goog.require('cwc.utils.Logger');

goog.require('goog.events');
goog.require('goog.events.EventTarget');



/**
 * @typedef {cwc.ui.Account|
 *   cwc.file.File|
 *   cwc.fileHandler.FileCreator|
 *   cwc.fileHandler.FileExporter|
 *   cwc.fileHandler.FileLoader|
 *   cwc.fileHandler.FileSaver|
 *   cwc.mode.Modder|
 *   cwc.protocol.arduino.Api|
 *   cwc.protocol.serial.Api|
 *   cwc.protocol.bluetooth.Api|
 *   cwc.protocol.ev3.Api|
 *   cwc.renderer.Renderer|
 *   cwc.ui.Blockly|
 *   cwc.ui.ConnectionManager|
 *   cwc.ui.Debug|
 *   cwc.ui.Documentation|
 *   cwc.ui.Editor|
 *   cwc.ui.Experimental|
 *   cwc.ui.GDrive|
 *   cwc.ui.Gui|
 *   cwc.ui.Help|
 *   cwc.ui.Layout|
 *   cwc.ui.Library|
 *   cwc.ui.Menubar|
 *   cwc.ui.Message|
 *   cwc.ui.Navigation|
 *   cwc.ui.Preview|
 *   cwc.ui.Runner|
 *   cwc.ui.SelectScreen|
 *   cwc.ui.SettingScreen|
 *   cwc.ui.Turtle|
 *   cwc.ui.connectScreen.Screens|
 *   cwc.utils.Dialog}
 */
cwc.utils.HelperInstance;



/**
 * Helper for all the ui parts and modules.
 * @constructor
 * @final
 * @export
 */
cwc.utils.Helper = function() {
  /** @type {!string} */
  this.name = 'Helper';

  /** @private {!cwc.utils.LogLevel} */
  this.loglevel_ = cwc.config.LogLevel;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.loglevel_, this.name);

  /** @private {!cwc.utils.Features} */
  this.features_ = new cwc.utils.Features();

  /** @private {string} */
  this.prefix_ = cwc.config.Prefix.GENERAL || '';

  /** @private {string} */
  this.cssPrefix_ = cwc.config.Prefix.CSS || '';

  /** @private {goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {Object<string, cwc.utils.HelperInstance>} */
  this.instances_ = {};
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.utils.Helper.prototype.getEventHandler = function() {
  return this.eventHandler_;
};


/**
 * @param {!string} name
 * @param {!Object} data
 */
cwc.utils.Helper.prototype.dispatchEvent = function(name, data) {
  this.eventHandler_.dispatchEvent({
    type: name,
    data: data
  });
};


/**
 * @param {!string} name
 * @param {!cwc.utils.HelperInstance} instance
 * @param {boolean=} opt_overwrite
 * @export
 */
cwc.utils.Helper.prototype.setInstance = function(name, instance,
    opt_overwrite) {
  if (this.instances_[name] && !opt_overwrite) {
    this.log_.error('Instance', name, ' already exists!');
  }
  this.log_.debug('Set', name, 'instance to', instance);
  this.instances_[name] = instance;
};


/**
 * @param {!string} name
 * @param {boolean=} opt_required
 * @return {cwc.utils.HelperInstance}
 * @export
 */
cwc.utils.Helper.prototype.getInstance = function(name, opt_required) {
  var error = null;
  if (typeof this.instances_[name] == 'undefined') {
    error = 'Instance ' + name + ' is not defined!';
    this.log_.error(error);
  } else if (!this.instances_[name]) {
    error = 'Instance ' + name + ' is not initialized yet.';
    this.log_.warn(error);
  }
  if (opt_required && error) {
    throw 'Required ' + error;
  } else if (error) {
    return null;
  }
  return this.instances_[name];
};


/**
 * @param {!string} name
 * @param {!Element} node
 * @param {boolean=} opt_required
 * @param {string=} opt_prefix
 * @return {cwc.utils.HelperInstance}
 * @export
 */
cwc.utils.Helper.prototype.decorateInstance = function(name, node,
    opt_required, opt_prefix) {
  var instance = this.getInstance(name, opt_required);
  if (instance) {
    instance.decorate(node, opt_prefix || this.getPrefix());
  }
  return instance;
};


/**
 * @return {Object}
 */
cwc.utils.Helper.prototype.getI18nData = function() {
  var i18nInstance = this.getInstance('i18n');
  if (i18nInstance) {
    return i18nInstance.getLanguageData();
  }
  return {};
};


/**
 * Shows an error message over the message instance.
 * @param {!string} error_msg
 * @export
 */
cwc.utils.Helper.prototype.showError = function(error_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.error(error_msg);
  } else {
    this.log_.error(error_msg);
  }
};


/**
 * Shows a warning message over the message instance.
 * @param {!string} warn_msg
 * @export
 */
cwc.utils.Helper.prototype.showWarning = function(warn_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.warning(warn_msg);
  } else {
    this.log_.warn(warn_msg);
  }
};


/**
 * Shows an info message over the message instance.
 * @param {!string} info_msg
 * @export
 */
cwc.utils.Helper.prototype.showInfo = function(info_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.info(info_msg);
  } else {
    this.log_.info(info_msg);
  }
};


/**
 * Shows an success message over the message instance.
 * @param {!string} success_msg
 * @export
 */
cwc.utils.Helper.prototype.showSuccess = function(success_msg) {
  var messageInstance = this.getInstance('message');
  if (messageInstance) {
    messageInstance.success(success_msg);
  } else {
    this.log_.info(success_msg);
  }
};


/**
 * Removes all defined event listeners in the provided list.
 * @param {Array} events_list
 * @param {string=} opt_name
 * @return {!Array} empty array
 */
cwc.utils.Helper.prototype.removeEventListeners = function(events_list,
    opt_name) {
  if (events_list) {
    this.log_.debug('Clearing', events_list.length, 'events listener',
        (opt_name) ? ' for ' + opt_name : '');
    goog.array.forEach(events_list, function(listener) {
      goog.events.unlistenByKey(listener);
    });
  }
  return [];
};


/**
 * @param {string} name
 * @param {string|boolean} value
 * @param {string=} opt_group
 * @export
 */
cwc.utils.Helper.prototype.setFeature = function(name, value, opt_group) {
  this.features_.set(name, value, opt_group);
};


/**
 * @param {string} name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkBrowserFeature = function(name) {
  return this.features_.getBrowserFeature(name);
};


/**
 * @param {string} name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkChromeFeature = function(name) {
  return this.features_.getChromeFeature(name);
};


/**
 * @param {string} name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkJavaScriptFeature = function(name) {
  return this.features_.getJavaScriptFeature(name);
};


/**
 * @param {string} name
 * @param {string=} opt_group
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.checkFeature = function(name, opt_group) {
  return this.features_.get(name, opt_group) || false;
};


/**
 * @export
 */
cwc.utils.Helper.prototype.detectFeatures = function() {
  return this.features_.detectFeatures();
};


/**
 * @export
 * @return {boolean}
 */
cwc.utils.Helper.prototype.getManifest = function() {
  return this.checkChromeFeature('manifest') &&
      chrome.runtime.getManifest();
};


/**
 * @export
 * @return {!string}
 */
cwc.utils.Helper.prototype.getAppVersion = function() {
  var manifest = this.getManifest();
  if (manifest) {
    return manifest['version'];
  }
  return String(new Date().getTime());
};


/**
 * @export
 */
cwc.utils.Helper.prototype.getFileExtensions = function() {
  var manifest = this.getManifest();
  if (manifest) {
    var fileExtensions = manifest['file_handlers']['supported']['extensions'];
    return fileExtensions;
  }
  return null;
};


/**
 * @param {string=} opt_name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.debugEnabled = function(opt_name) {
  var debugInstance = this.getInstance('debug');
  if (debugInstance) {
    return debugInstance.isEnabled(opt_name);
  }
  return false;
};


/**
 * @param {string=} opt_name
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.experimentalEnabled = function(opt_name) {
  var experimentalInstance = this.getInstance('experimental');
  if (experimentalInstance) {
    return experimentalInstance.isEnabled(opt_name);
  }
  return false;
};


/**
 * @return {!boolean}
 * @export
 */
cwc.utils.Helper.prototype.isGoogleAccountEnabled = function() {
  var accountInstance = this.getInstance('account');
  if (accountInstance) {
    return accountInstance.isAuthenticated();
  }
  return false;
};


/**
 * @param {string} prefix General Prefix
 * @export
 */
cwc.utils.Helper.prototype.setPrefix = function(prefix) {
  this.prefix_ = prefix || '';
};


/**
 * @return {!cwc.utils.Logger}
 * @export
 */
cwc.utils.Helper.prototype.getLogger = function() {
  return this.log_;
};


/**
 * @param {string=} opt_additional_prefix
 * @return {string}
 * @export
 */
cwc.utils.Helper.prototype.getPrefix = function(
    opt_additional_prefix) {
  if (opt_additional_prefix) {
    return this.prefix_ + opt_additional_prefix + '-';
  }
  return this.prefix_;
};


/**
 * @param {Function} func
 */
cwc.utils.Helper.prototype.handleUnsavedChanges = function(func) {
  var fileName = '';
  var fileModified = false;
  var fileInstance = this.getInstance('file');
  if (fileInstance) {
    fileName = fileInstance.getFileTitle();
    fileModified = fileInstance.isModified();
  }

  console.log('File', fileName, 'was modified:', fileModified);
  if (fileModified) {
    var dialogInstance = this.getInstance('dialog');
    var title = 'Unsaved Changes for ' + fileName;
    var content = 'Changes have not been saved. Exit?';
    dialogInstance.showYesNo(title, content).then((answer) => {
      if (answer) {
        func();
      }
    });
  } else {
    func();
  }
};


/**
 * @export
 */
cwc.utils.Helper.prototype.uninstallStyles = cwc.ui.Helper.uninstallStyles;
