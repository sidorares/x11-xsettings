var x11 = require('x11');
var xsettings = require('../index.js');

x11.createClient(function(err, display) {
    var X = display.client;
    X.InternAtom(false, '_XSETTINGS_S0', function(err, settingsOwnerAtom) {
      X.InternAtom(false, '_XSETTINGS_SETTINGS', function(err, xsettingsAtom) {
        X.GetSelectionOwner(settingsOwnerAtom, function(err, win) {
          X.GetProperty(0, win, xsettingsAtom, 0, 0, 1e20, function(err, propValue) {
            console.log(xsettings.decode(propValue.data));
          });
        });
      });
    });
});
