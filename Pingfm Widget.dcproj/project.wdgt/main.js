/* 
 This file was generated by Dashcode.  
 You may edit this file to customize your widget or web page 
 according to the license.txt file included in the project.
 */

// Ping.fm application API key.
const API_KEY = '4217564672bbb9e35396f53d79e0e114';

// Preference key which holds the User's application key.
const PREF_KEY_NAME = 'PingfmUserApplicationKey';

const API_URL = 'http://api.ping.fm/v1';

//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    dashcode.setupParts();
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));

    // TODO: Preferences not working at the moment.
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey(PREF_KEY_NAME));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    // Restart any timers that were stopped on hide
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
    
    // TODO: Preferences not working at the moment.
    // saveAppKey();
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}


function clearButtonOnClick(event)
{
    clearTextArea('messageTextArea');
    updateCharacterCount();
}

function clearTextArea(id)
{
    var textArea = document.getElementById(id);
    if (textArea)
        textArea.value = '';
}

function messageTextAreaCounter(event)
{
    updateCharacterCount();
}

function updateCharacterCount()
{
    var textArea  = document.getElementById('messageTextArea');
    var charCount = textArea.value.length;
    var status    = document.getElementById('characterCount');
    status.innerHTML = charCount;

    if (charCount >= 140) status.style.color = 'red';
    else status.style.color = 'black';
}

function openPingfmKeyPage(event)
{
    var url = 'http://ping.fm/key/';
    widget.openURL(url);
}

function openPingfmPage(event)
{
    var url = 'http://ping.fm/';
    widget.openURL(url);
}

function postButtonOnClick(event)
{
    var message = document.getElementById('messageTextArea').value;
    if (message) postToPingfm(message);
}

// TODO: This seems to be broken for some reason.
function saveAppKey()
{
    var keyName = PREF_KEY_NAME;
    var appKey  = document.getElementById('appKeyTextArea').value;
    if (appKey) {
        widget.setPreferenceForKey(keyName, appKey);
    } else {
        widget.setPreferenceForKey(keyName, null);
    }
}

// Returns an array of API keys.
// First element is the application key.
// Second element is the user application key.
function getUserAppKey() {
    var key = document.getElementById('appKeyTextArea').value;
    if (key) return key;
    else return null;
}

function postToPingfm(message)
{
    // Create XMLHttpRequest and assign a handler.
    var onloadHandler = function() { parseResponse(xmlRequest); };
    var xmlRequest = new XMLHttpRequest();
    xmlRequest.onload = onloadHandler;

    // Build the URL and payload.
    var user_app_key = getUserAppKey();
    if (!user_app_key) {
        showBack();
        return;
    }
    var url = API_URL + "/user.post";
    url += "?debug=1";  // REMOVE AFTER TESTING.
    url += "&api_key=" + API_KEY;
    url += "&user_app_key=" + user_app_key;
    url += "&post_method=default";
    url += "&body=" + message;

    // Send that shit.
    xmlRequest.open("POST", url);
    xmlRequest.setRequestHeader("Cache-Control", "no-cache");
    xmlRequest.send(null);
}

function parseResponse(xmlRequest)
{
    if (xmlRequest.status == 200) {
        alert(xmlRequest.responseXML);
    } else {
        alert('Error: ' + xmlRequest.status);
    }
}
