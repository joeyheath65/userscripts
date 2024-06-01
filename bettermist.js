// ==UserScript==
// @name         Better Mist!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make Mist Great Again
// @author       Joe Heath - joseph.r.heath@gmail.com
// @match        https://*.mist.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


function addSuccessPercentageColumn() {
    const networkServersSection = document.querySelector('section.section-wrapper.status-section.network-servers-section');

    if (networkServersSection) {
        console.log('Network Servers section found:', networkServersSection);
        const table = networkServersSection.querySelector('table');
        if (table) {
            const thead = table.querySelector('thead tr');
            const tbody = table.querySelector('tbody');

            // Add a new column header if it doesn't already exist
            if (!thead.querySelector('.hdr-successPercentage')) {
                const newHeader = document.createElement('th');
                newHeader.className = 'hdr-successPercentage';
                newHeader.innerHTML = '<span class="sort-heading">Success Percentage</span>';
                thead.appendChild(newHeader);
            }
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const goodAttemptsCell = row.querySelector('.row-goodAttempts');
                const badAttemptsCell = row.querySelector('.row-badAttempts');
                const goodAttempts = parseInt(goodAttemptsCell.textContent.trim(), 10) || 0;
                const badAttempts = parseInt(badAttemptsCell.textContent.trim(), 10) || 0;
                const totalAttempts = goodAttempts + badAttempts;
                const successPercentage = totalAttempts === 0 ? 0 : (goodAttempts / totalAttempts * 100).toFixed(2);

                let percentageCell = row.querySelector('.row-successPercentage');
                if (!percentageCell) {
                    percentageCell = document.createElement('td');
                    percentageCell.className = 'row-successPercentage';
                    row.appendChild(percentageCell);
                }
                percentageCell.textContent = `${successPercentage}%`;
            });
        } else {
            console.log('Table not found in Network Servers section');
        }
    } else {
        console.log('Network Servers section not found');
    }
}
function observeForSection() {
    const observer = new MutationObserver((mutations, me) => {
        const networkServersSection = document.querySelector('section.section-wrapper.status-section.network-servers-section');
        if (networkServersSection) {
            addSuccessPercentageColumn();
            me.disconnect(); 
            observeTabChanges(); 
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

function observeTabChanges() {
    const tabs = document.querySelectorAll('.section-wrapper.status-section.network-servers-section .tab-menu-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            setTimeout(addSuccessPercentageColumn, 100);
        });
    });
}

window.addEventListener('load', observeForSection);


})();
