// ==UserScript==
// @name         Net Buddy! v.5
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Still working on this
// @author       Joe Heath
// @match        https://*/*
// @match        http://*/*
// @match        https://manage.mist.com/*
// @match        https://*.heb.com/*
// @match        https://myheb.service-now.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM.getValue
// @grant        GM.listValues
// @grant        GM.notification
// @grant        GM_notification
// ==/UserScript==


(function() {
    'use strict';
// API Keys
const apiMistStoresKey = 'nope';
const apiMistMWTKey = 'nope';
// URLs
// const mistCheck = 'https://manage.mist.com';
// const hebCheck = 'https://www.heb.com';
// Additional API Endpoints/api/v1/const/alarm_defs
let apiMWTStats = 'https://api.mist.com/api/v1/orgs/f9d9f882-7e5f-4407-b1f4-75dbe221c52e/stats';
let apiStoreStats = 'https://api.mist.com/api/v1/orgs/9a9d648b-610b-40fb-bf16-1231f682ff51/stats';
let apiMWTGetSites = 'https://api.mist.com/api/v1/orgs/f9d9f882-7e5f-4407-b1f4-75dbe221c52e/sites';
let apiStoreGetSites = 'https://api.mist.com/api/v1/orgs/9a9d648b-610b-40fb-bf16-1231f682ff51/sites';
let apiStoreSearch = 'https://api.mist.com/api/v1/orgs/9a9d648b-610b-40fb-bf16-1231f682ff51/devices/search?ip=';
let apiStoreSites = 'https://api.mist.com/api/v1/sites/';
let apiMWTSearch = 'https://api.mist.com/api/v1/orgs/f9d9f882-7e5f-4407-b1f4-75dbe221c52e/devices/search?ip=';
let testAPIcall = 'https://api.mist.com/api/v1/orgs/9a9d648b-610b-40fb-bf16-1231f682ff51/alarms/search';
let apiGetMarvisActions = 'https://api.mist.com/api/v1/msps/c29867f8-9d99-4957-8889-99eff5264829/suggestion/count?distinct=org_id';
// Site API call
let apiSites = 'https://api.mist.com/api/v1/sites';
// variables to be stored
let oldStoreSites = 0;
let oldStoreAPs = 0;
let oldStoreOffline = 0;
let oldMWTSites = 0;
let oldMWTAPs = 0;
let oldMWTOffline = 0;
// Countdown for data refresh
function updateCountdown() {
    const currentTime = new Date().getTime();
    const nextExecutionTime = currentTime + (2 * 60 * 1000); // using milliseconds
    const timeDifference = nextExecutionTime - currentTime;
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    document.getElementById("countdown").textContent = `Next update in: ${minutes}m ${seconds}s`;
}

// net buddy sidebar

const sidebar = document.createElement('div');
    sidebar.id = 'constant-sidebar';
    sidebar.innerHTML = `
        <div id="sidebar-content">
            <div class="sidebar-header">
            <h2>
            <img src="https://images.heb.com/is/image/HEBGrocery/article-png/join-buddy-league-360.jpg" alt="Net Buddy!" style="left: 0; width:100%;">Network Buddy!!</img></h2>
            </div>
            <hr width="auto" size="5">
            <div id="sidebar-response1" class=sidebar-content;">
                <table style="width:100%;">
                    <tr><div id="api-orgdata-stores" style="border: 1px solid#00000; font-weight: bold;"></div></tr>
                    <tr><button id="api-stores" style="width: 90%; margin-left: 10px; padding: 1px; font-weight: bold;">Poll Stores</button></tr>
                    <tr><th><div id="api-response-stores"></div></th>
                        <th><div id="api-delta-stores"></div></th>
                    </tr>
                </table>
                </div>
            <hr width="auto" size="5">
                <div id="sidebar-response2" class=sidebar-content;">
                <table style="width:100%;">
                    <tr></tr>
                    <tr><div id="api-orgdata-mwt" style="border: 1px solid#00000; font-weight: bold;"></div></tr>
                    <tr><button id="api-mwta" style="width: 90%; margin-left: 10px; padding: 1px; font-weight: bold;">Poll MWTA</button></tr>
                    <tr><th><div id="api-response-mwt"></div></th>
                        <th><div id="api-delta-mwt"></div></th>
                    </tr>
                </table>
                <br>
                </div>
            <div id="countdown" style="margin-left: 35px;"></div>
            <div>
            <hr width="auto" size="5"></hr>
            <h3>Check Sites</h3>
            <hr width="auto" size="5">
            <div id="sidebar-response3"">
                <button id="api-load-stores" style="margin-left:10px; width:100px;">Load Stores</button>
                <button id="api-load-mwta" style="margin-right:5px; width:100px;">Load MWTA</button>
                <table style="width:99%;">
                    <tr><select id="nameDropdown" style="margin-left: 12px; width: 85%;">Choose a Site...</select></tr><br>
                    <tr></tr>
                    <tr><th><div id="api-response-siteinfo"></div></th>
                    </tr>
                </table>
                <hr width="auto" size="5">
                <br>
            </div>
        </div>
    `;
document.body.appendChild(sidebar);

// sidebar stylerer
GM_addStyle(`
    #constant-sidebar {
        position: fixed;
        font-size: 12px;
        top: 0;
        right: 0;
        bottom: 0;
        width: 220px;
        margin-top: auto;
        border-width: thin;
        border-color: black;
        color: black;
        background-color: #7dbaa5;
        box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        overflow-y: auto;
        transition: width 0.5s;
    }
    #sidebar-header {
        width: auto;
        font-size: 17px;
        left: 0;
        margin-top: auto;
        border-color: black;
    }
    #sidebar-content {
        margin-top: auto;
        border-color: black;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        color: black;
        font-weight: normal;
        background-color: #7dbaa5;
    }
    #sidebar-content h2 {
        font: small-caps bold 18px/24px Georgia, serif;
        text-align: center;
        text-shadow: 0 0 3px #ff0000;
        color: black; /* Change header text color to black */
    }
    #sidebar-content h3 {
        font: small-caps expanded bold 16px/22px Georgia, serif;
        text-align: center;
        letter-spacing: 2px;
        word-spacing: 2px;
        text-shadow: 0 0 3px #ff0000;
        color: black; /* Change header text color to black */
    }
    #api-response-stores {
        text-align: left;
        width: 100%;
        color: black;
    }
    #api-orgdata-stores {
        text-align: center;
        width: 100%;
        color: black;
    }
    #api-delta-stores {
        text-align: left;
        width: 100%;
        color: black;
    }
    #api-delta-mwt {
        text-align: left;
        width: 100%;
        color: black;
    }
    #api-response-siteinfo {
        text-align: left;
        margin-left: 15px;
        font-size: 14px;
        font-weight: bold;
        width: 100%;
        color: black;
        letter-spacing: 1px;
        word-spacing: 2px;
    }
    #api-response-mwt {
        text-align: left;
        width: 100%;
        color: black;
    }
    #api-orgdata-mwt {
        text-align: center;
        width: 100%;
        color: black;
    }
`);

// Function to hide the sidebar
function hideSidebar() {
    $('constant-sidebar').hide();
}

// Function to show the sidebar
function showSidebar() {
    $('constant-sidebar').show();
}
// This section is for the Mist data boxes and the API "GET" requests
// Basic function to make an API call
function makeAPICall(apiEndpoint, apiKey, successCallback, errorCallback) {
    updateCountdown();
    GM_xmlhttpRequest({
        method: 'GET',
        url: `${apiEndpoint}?key=${apiKey}`,
        onload: function(response) {
            console.log('API Response:', response.responseText);
            successCallback(response.responseText);
        },
        onerror: function(error) {
            console.error('API Error:', error);
            errorCallback(error);
        }
    });
}
function makeAPICall2(apiEndpoint, apiKey, updateSiteDropdown, errorCallback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: `${apiEndpoint}?key=${apiKey}`,
        onload: function(response) {
            const data = JSON.parse(response.responseText);
            updateSiteDropdown(data, apiKey);
        },
        onerror: function(error) {
            console.error('API Error:', error);
            errorCallback(error);
        }
    });
}
function makeSiteAPICall(selectedId, apiKey, updateSiteDropdown, errorCallback) {
    // Construct the URL properly
    const url = `$https://api.mist.com/api/v1/sites/${selectedId}/stats?key=${apiKey}`;

    // Make the API call using GM_xmlhttpRequest
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
            console.log('Site API Response:', response.responseText);
            // Call the success callback with the response data
            updateSiteDropdown(data, apiKey);
        },
        onerror: function(error) {
            console.error('Site API Error:', error);
            // Call the error callback with the error message
            errorCallback(error);
        }
    });
}


// Function to handle the success of the first API call
function storesAPIsuccess(response) {
    const data = JSON.parse(response);
    const orgFields = {
        "Total Stores": data.num_sites,
        "AP Inventory": data.num_inventory,
        "APs In Use": data.num_devices,
    };
    const storeFields = {
        "APs Online": data.num_devices_connected,
        "APs Offline": data.num_devices_disconnected,
    };
    const newSites = data.num_sites;
    const newAPs = data.num_devices_connected;
    const newOffline = data.num_devices_disconnected;
    const deltaSites = newSites - oldStoreSites;
    const deltaAPs = newAPs - oldStoreAPs;
    const deltaOffline = newOffline - oldStoreOffline;

    // Print delta values
    console.log("Delta Sites:", deltaSites);
    console.log("Delta APs:", deltaAPs);
    console.log("Delta Offline:", deltaOffline);

    // Update old values for the next call
    oldStoreSites = newSites;
    oldStoreAPs = newAPs;
    oldStoreOffline = newOffline;
    // Add more fields as needed
    const deltaFields = {
        "Change":deltaAPs,
        // Add more fields as needed
    };
    let responseString = '';
    for (const key in storeFields) {
        if (storeFields.hasOwnProperty(key)) {
            responseString += `${key}: ${storeFields[key]}<br>`;
        }
    }
    let responseDelta = '';
    for (const key in deltaFields) {
        if (deltaFields.hasOwnProperty(key)) {
            responseDelta += `${key}: ${deltaFields[key]}<br>`;
        }
    }
    let responseOrg = '';
    for (const key in orgFields) {
        if (orgFields.hasOwnProperty(key)) {
            responseOrg += `${key}: ${orgFields[key]}<br>`;
        }
    }
    $('#api-orgdata-stores').html(responseOrg);
    $('#api-response-stores').html(responseString);
    $('#api-delta-stores').html(responseDelta);
}
// Function to handle the error of the makeAPICall function
function handleErrorAPIcall1(error) {
    $('#api-response-stores').append('First API Error: ' + error + '<br>');
}

// Function to handle the success of the second API call
function mwtAPIsuccess(response) {
    const data = JSON.parse(response);
    const orgFields = {
        "MWTA Sites": data.num_sites,
        "AP Inventory": data.num_inventory,
        "APs in Use": data.num_devices,
    };
    const storeFields = {
        "APs Online": data.num_devices_connected,
        "APs Offline": data.num_devices_disconnected,
    };
    const newSites = data.num_sites;
    const newAPs = data.num_devices_connected;
    const newOffline = data.num_devices_disconnected;
    const deltaSites = newSites - oldMWTSites;
    const deltaAPs = newAPs - oldMWTAPs;
    const deltaOffline = newOffline - oldMWTOffline;

    // Print delta values
    console.log("Delta Sites:", deltaSites);
    console.log("Delta APs:", deltaAPs);
    console.log("Delta Offline:", deltaOffline);

    // Update old values for the next call
    oldMWTSites = newSites;
    oldMWTAPs = newAPs;
    oldMWTOffline = newOffline;

    // Add more fields as needed
    const deltaFields = {
        "Change": deltaAPs,
    // Add more fields as needed
    };
    let responseString = '';
    for (const key in storeFields) {
        if (storeFields.hasOwnProperty(key)) {
            responseString += `${key}: ${storeFields[key]}<br>`;
        }
    }
    let responseDelta = '';
    for (const key in deltaFields) {
        if (deltaFields.hasOwnProperty(key)) {
            responseDelta += `${key}: ${deltaFields[key]}<br>`;
        }
    }
    let responseOrg = '';
    for (const key in orgFields) {
        if (orgFields.hasOwnProperty(key)) {
            responseOrg += `${key}: ${orgFields[key]}<br>`;
        }
    }
    $('#api-orgdata-mwt').html(responseOrg);
    $('#api-response-mwt').html(responseString);
    $('#api-delta-mwt').html(responseDelta);
}
// Function to handle the error of the makeAPICall2 function
function handleErrorAPIcall2(error) {
    $('#api-response-mwt').append('Second API Error: ' + error + '<br>');
}

function siteAPIsuccess(response) {
        const data = JSON.parse(response);
        const siteFields = {
            "Site Health": (data.num_ap !== 0) ? ((data.num_ap_connected / data.num_ap) * 100).toFixed(2) + "%" : "N/A",
            "Total APs": data.num_ap,
            "APs Online": data.num_ap_connected,
            "Clients Online": data.num_clients,
        };
        let responseString = '';
        for (const key in siteFields) {
            if (siteFields.hasOwnProperty(key)) {
                responseString += `${key}: ${siteFields[key]}<br>`;
            }
        }
    $('#api-response-siteinfo').html(responseString);
}
function handleErrorSiteAPI(error) {
    $('#api-response-siteinfo').append('Second API Error: ' + error + '<br>');
}
function onloadAPICalls() {
    makeAPICall(apiStoreStats, apiMistStoresKey, storesAPIsuccess, handleErrorAPIcall1);
    makeAPICall(apiMWTStats, apiMistMWTKey, mwtAPIsuccess, handleErrorAPIcall2);
}
onloadAPICalls();
// this replaces the function populateDropdown
function updateSiteDropdown(data, apiKey) {
    const dropdown = document.getElementById('nameDropdown');
    dropdown.innerHTML = '';
    const initialOption = document.createElement('option');
    initialOption.text = 'Select a site';
    initialOption.disabled = true;
    initialOption.selected = true;
    dropdown.add(initialOption);
    data.forEach(item => {
        const option = document.createElement('option');
        option.text = item.name;
        option.value = item.id; // Set value to id for later retrieval
        dropdown.add(option);
    });

    dropdown.addEventListener('change', function() {
        const selectedId = dropdown.value;
        const selectedName = dropdown.options[dropdown.selectedIndex].text;

        // Display the selected name
        console.log('Selected Name:', selectedName);
        console.log(selectedId);
        const url = `https://api.mist.com/api/v1/sites/${selectedId}/stats?key=${apiKey}`;
        console.log(url);
        // Make the API call using GM_xmlhttpRequest
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                console.log('Site API Response:', response.responseText);
                // Call the success callback with the response data
                siteAPIsuccess(response.responseText);
            },
            onerror: function(error) {
                console.error('Site API Error:', error);
                // Call the error callback with the error message
                errorCallback(error);
            }
        });
    });
}
// update Stores button click
$('#api-stores').on('click', function() {
    makeAPICall(apiStoreStats, apiMistStoresKey, function(response) {
        document.getElementById('api-response-stores').textContent = response;
        storesAPIsuccess(response);
    }, handleErrorAPIcall1);
    updateCountdown();
});
// update MWTA button click
$('#api-mwta').on('click', function() {
    makeAPICall(apiMWTStats, apiMistMWTKey, function(response) {
        document.getElementById('api-response-mwt').textContent = response;
        // Call the success callback
        mwtAPIsuccess(response);
    }, handleErrorAPIcall2);
    updateCountdown();
});
$('#api-load-stores').on('click', function() {
    makeAPICall2(apiStoreGetSites, apiMistStoresKey, updateSiteDropdown, function(response) {
    updateSiteDropdown(response);
    }, handleErrorAPIcall2);
});
$('#api-load-mwta').on('click', function() {
    makeAPICall2(apiMWTGetSites, apiMistMWTKey, updateSiteDropdown, function(response) {
    updateSiteDropdown(response);
    }, handleErrorAPIcall2);
});
$('#opentbn').on('click', function() {
    showSidebar();
});
$('#closebtn').on('click', function() {
    hideSidebar();
});

setInterval(() => {
    onloadAPICalls();
    updateCountdown();
    }, 2 * 60 * 1000); //  milliseconds

})();
