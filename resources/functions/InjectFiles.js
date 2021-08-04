const {app} = require('electron')
const {LoadJS} = require('./load/LoadJS')
const {LoadCSS} = require('./load/LoadCSS')

exports.LoadFiles = async function () {
    LoadCSS('init.css')
    LoadJS('regionChange.js')

    /* Custom UWP Window Frame (WIP) */
    /*if (app.preferences.value('visual.emulateMacOS').includes(false)) {
        LoadCSS('uwpWindowFrame.css')
        LoadJS('uwpWindowFrame.js')
    }*/

    if (app.preferences.value('visual.emulateMacOS').includes('left') || app.preferences.value('visual.emulateMacOS').includes('right')) {
        app.preferences.value('visual.removeUpsell', [true]);
        app.preferences.value('visual.removeAppleLogo', [true]);
    }

    /* Remove Apple Music Logo */
    if (app.preferences.value('visual.removeAppleLogo').includes(true)) {
        LoadJS('removeAppleLogo.js')
    }

    /* Remove Upsell */
    if (app.preferences.value('visual.removeUpsell').includes(true)) {
        LoadJS('removeUpsell.js')
    }

    /* Create Settings Button */
    LoadJS('settingsInit.js')

    /* Load the Emulation Files */
    if (app.preferences.value('visual.emulateMacOS').includes('left')) {
        LoadJS('emulateMacOS.js')
    } else if (app.preferences.value('visual.emulateMacOS').includes('right')) {
        LoadJS('emulateMacOS_rightAlign.js')
    }

    /* Load Glasstron */
    if (app.preferences.value('visual.transparencyMode').includes(true)) {
        LoadCSS('glasstron.css')
    } else {
        LoadCSS('glasstronDisabled.css')
    }

    /* Streamer Mode */
    if (app.preferences.value('visual.streamerMode').includes(true)) {
        LoadCSS('streamerMode.css')
    }

    /* Load a Theme if it is Found in the Configuration File */
    if (app.preferences.value('visual.theme') && !(app.preferences.value('visual.theme').includes('Template')) && !(app.preferences.value('visual.theme').includes('default'))) {
        LoadCSS(`${app.preferences.value('visual.theme')}.css`, true)
    }

    /* Load Back Button */
    if (app.win.webContents.canGoBack() && app.preferences.value('advanced.backButton').includes(true)) {
        LoadJS('backButton.js')
    } else { /* Remove it if user cannot go back */
        app.win.webContents.executeJavaScript(`if (document.querySelector('#backButton')) { document.getElementById('backButton').remove() };`);
    }

    /* Remove the Scrollbar */
    if (app.preferences.value('advanced.removeScrollbars').includes(true)) app.win.webContents.insertCSS('::-webkit-scrollbar { display: none; }');

    /* Inject the MusicKitInterop file */
    await app.win.webContents.executeJavaScript('MusicKitInterop.init()');
}