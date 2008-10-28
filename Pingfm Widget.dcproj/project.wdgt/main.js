/* 
 This file was generated by Dashcode.  
 You may edit this file to customize your widget or web page 
 according to the license.txt file included in the project.
 */

const VERSION = '1.0.1';

// Ping.fm application API key.
const API_KEY = '4217564672bbb9e35396f53d79e0e114';

// Preference key which holds the User's application key.
const PREF_KEY_NAME = 'PingfmUserApplicationKey';

const API_URL = 'http://api.ping.fm/v1';

const DEBUG = true;

//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    dashcode.setupParts();
    loadVersionString();
}

function loadVersionString() {
    var version = document.getElementById('versionString');
    if (version) version.innerHTML += VERSION;
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

    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey(PREF_KEY_NAME));
    widget.setPreferenceForKey(null, PREF_KEY_NAME);
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
    
    saveAppKey();
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


// Yes, these are stupid.
function openPingfmKeyPage(event)
{
    widget.openURL('http://ping.fm/key/');
}

function openPingfmPage(event)
{
    widget.openURL('http://ping.fm/');
}

function openCodePage(event)
{
    widget.openURL('http://github.com/Oshuma/pingfm-widget/');
}


function postButtonOnClick(event)
{
    var message = document.getElementById('messageTextArea').value;
    if (message) postToPingfm(message);
}

function saveAppKey()
{
    var appKey  = document.getElementById('appKeyTextArea').value;
    if (appKey) {
        widget.setPreferenceForKey(appKey, PREF_KEY_NAME);
    } else {
        widget.setPreferenceForKey(null, PREF_KEY_NAME);
    }
}

// Returns the user's application API key.
function getUserAppKey() {
    var key = widget.preferenceForKey(PREF_KEY_NAME);
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
        document.getElementById('appKeyTextArea').focus();
        return;
    }
    var url = API_URL + "/user.post";
    var params;

    if (DEBUG)
        params += "&debug=1";

    params += "&api_key=" + API_KEY;
    params += "&user_app_key=" + user_app_key;
    params += "&post_method=default";
    params += "&body=" + message;

    // Send that shit.
    xmlRequest.open("POST", url);
    xmlRequest.setRequestHeader("Cache-Control", "no-cache");
    xmlRequest.send(params);
}

// TODO: Response notification would probably go here.
function parseResponse(xmlRequest)
{
    if (xmlRequest.status == 200) {
        if (DEBUG) {
            alert('Response XML: ' + xmlRequest.responseXML);
            alert('Response: '     + xmlRequest.responseText);
        }
        clearTextArea('messageTextArea');
        updateCharacterCount();
    } else {
        if (DEBUG) {
            alert('HTTP Code: '   + xmlRequest.status);
            alert('HTTP Status: ' + xmlRequest.statusText);
            alert('Response: '    + xmlRequest.responseText);
        }
    }
}
