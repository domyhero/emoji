console.log( "=== +emoji options page load ===" )

/*
function loadOptions() {
    var scale = document.getElementById("fieldscale");
    scale.value = localStorage["scale"];

    var usefont = document.getElementById("fieldusefont");
    usefont.checked = (localStorage["usefont"] == "true");

    var hidePUA = document.getElementById("fieldhidePUA");
    hidePUA.checked = (localStorage["hidePUA"] == "true");

    var blacklist = document.getElementById("fieldblacklist");
    blacklist.value = localStorage["blacklist"];
}

function saveOptions() {
    var scale = document.getElementById("fieldscale");
    localStorage["scale"] = scale.value;

    var usefont = document.getElementById("fieldusefont");
    localStorage["usefont"] = usefont.checked;

    var hidePUA = document.getElementById("fieldhidePUA");
    localStorage["hidePUA"] = hidePUA.checked;

    var blacklist = document.getElementById("fieldblacklist");
    localStorage["blacklist"] = blacklist.value;

    window.close();
}

function cancelOptions() {
    window.close();
}

function init() {
    var save = document.getElementById("buttonsave");
    save.addEventListener("click", saveOptions);

    var cancel = document.getElementById("buttoncancel");
    cancel.addEventListener("click", cancelOptions);

    loadOptions();
}

document.body.addEventListener("load", init());
*/

import 'option_css';

import Velocity  from 'velocity';

import Setting   from 'setting';

/**
* Entry: Get settings from response
*/
chrome.runtime.sendMessage( "get_settings", function ( resp ) {
    console.log( "get_settings", resp )
    $( "body" ).velocity({ opacity: 1 }, { duration: 1000, complete: ()=> {
        $( "body" ).removeAttr( "style" );
    }});
    settingRender( { ...resp } );
});

/**
 * Setting Render
 * 
 * @param {object} options
 */
function settingRender( options ) {
    ReactDOM.render( <Setting options={ options } />, $( ".setting" )[0] );
}