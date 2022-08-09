'use strict'

// DOM Elemente
// Eventlistener
// Funktionen

let contacts = [];

// DOM Elemente
const form = document.getElementById('form');
const firstname = document.getElementById('firstnameId');
const lastname = document.getElementById('lastnameId');
const phone = document.getElementById('phoneId');
const email = document.getElementById('emailId');
const search = document.getElementById('search');
const clearLocalStorageBtn = document.getElementById('clearLocalStorage-btn');

// Eventlistener für Formular
form.addEventListener('submit', function (e) {
    // form submit unterbinden
    e.preventDefault('submit');

    // Funktionsaufruf, erhält ein Array als Parameter
    // function call, pass an array as parameter
    checkInputsNotEmpty([firstname, lastname, phone, email]);
    /**
     * Wir überprüfen die Länge der Usereingabe => characters
     */

    if (checkLength(firstname, 2, 20) && checkLength(lastname, 4, 10) && checkPhone(phone) &&checkEmail(email)) {
        // factory objekte in unser contacts[] pushen
        contacts.push(contactFactory(firstname.value, lastname.value, phone.value, email.value));

        // Liste befüllen, zur Liste hinzufügen
        populateList('list', contacts);
    
        // in LocalStorage als JSON String schreiben
        // toLocalStorage('LocalStorageJSONObject', contacts)
        toLocalStorage('LocalStorageJSONObject', serialize(contacts));
    
        // leert Input Felder
        clearText([firstname, lastname, phone, email]);
    }

});
 
// Eventlistener für Sucheingabe
search.addEventListener('input', (e) => searchContact(e.target.value));

// Eventlistener für LocalStorage leeren
clearLocalStorageBtn.addEventListener('click', clearLocalStorage);

// Initialisiere contacs[] mit daten aus dem localStorage
const initData = parse(getFromLocalStorage('LocalStorageJSONObject'));

// Initialisiere contacts[] mit Daten aus dem localStorage
initContacts(initData);


// FUNKTIONEN
function checkInputsNotEmpty(domArray) {
    // ocnsole.log(domArray);
    domArray.forEach( (input) => {
        // console.log(input.value);
        if (input.value.trim() === "") {
            // Funktionsaufruf Fehlermeldung
            checkError(input, `${getInputName(input)} ist erforderlich`);
        } else {
            // Funktionsaufruf erflogreich
            checkOK(input);
        }
    })
};

// Gibt die ID des Input=Elements zurück
function getInputName(input) {
    return input.name;
};

// Input empty function
function checkError(input, message) {
    const formInput = input.parentElement;
    formInput.className = 'form-input error';
    const small = formInput.querySelector('small');
    small.innerText = message;
};

// Input not empty function
function checkOK(input) {
    const formInput = input.parentElement;
    formInput.className = 'form-input success';
    // formInput.classList.add('success'); // Füge neuen css-classname zusätzlich zu
};

// Prüfe die Länge der Eingabe für Vorname und Nachname
function checkLength(input, min, max) {
    
    if (input.value.length < min) { // < min checkError
        checkError(input, `${getInputName(input)} muss mindestens ${min} Zeichen lang sein`);
        return false;

    } else if (input.value.length > max) { // > max checkError
        checkError(input, `${getInputName(input)} darf nicht länger als ${max} Zeichen lang sein`);
        return false;

    } else { // checkOK
        checkOK(input);
        return true;

    } 

};

// Prüfe Telefonnummer
function checkPhone(input) {
    // regex
    // if regex & input OK > checkOK()
    // else checkError(input, message)

    // const regex = /(\(?([\d \-\)\–\+\/\(]+)\)?([ .\-–\/]?)([\d]+))/;
    const regex = /\(?\+\(?49\)?[ ()]?([- ()]?\d[- ()]?){10}/g;

    if (regex.test(input.value)) {
        checkOK(input);
        return true;
    } else {
        checkError(input, 'Diese Telefonnr. ist nicht gültig');
        return false;
    }
};

// Prüfe E-Mail Adresse
function checkEmail(input) {

    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\u0022(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\u0022)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (regex.test(input.value)) {
        checkOK(input);
        return true;
    } else {
        checkError(input, 'Diese E-Mail ist nicht gültig');
        return false;
    }
};

// BROWSER & OUTPUT

// Factory pattern
// KONTAKT FACTORY FUNCTION
const contactFactory = (fname, lname, phone, email) => {
    return {
        firstname: fname,
        lastname: lname,
        phone: phone,
        email: email,
    }
};

// Liste befüllen
function populateList(elementId, inputArray) {

    const list = document.getElementById(elementId);

    list.innerHTML = '';
    
    inputArray.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="kontakt-info">
                <h4>${item.lastname}</h4>
                <p>${item.firstname}</p>
                <p>${item.phone}</p>
                <p>${item.email}</p>
            </div>
        `;
        list.appendChild(li);
    });

};

// in localStorage schreiben
// MEINE LÖSUNG
// function toLocalStorage (localStorageKey, localStorageValue) {

//     const jsonString = JSON.stringify(localStorageValue);

//     localStorage.setItem(localStorageKey, jsonString);
// };

function toLocalStorage (localStorageKey, localStorageValue) {
    localStorage.setItem(localStorageKey, localStorageValue);
};

function getFromLocalStorage (localStorageKey) {
    return localStorage.getItem(localStorageKey);
};

// Json string zurückgeben
function serialize (data) {
    return JSON.stringify(data);
};

function parse (data) {
    return JSON.parse(data);
};

function initContacts(data) {
    // prüfen ob localStorage data nicht leer it
    if (data != null) {
        // für jedes obj data in contacts[] push
        data.forEach((obj) => {
            contacts.push(obj);

        });

        // erzeuge Liste
        populateList('list', contacts);
    }
};

// Input Felder leeren
// function clearInput(firstname, lastname, phone, email) {
//     firstname.value = '';
//     lastname.value = '';
//     phone.value = '';
//     email.value = '';
// };

// Variante 2 Input Felder leeren
function clearText(domArray) {
    domArray.forEach( (input) => {
        input.value = '';
    });
};


// SUCH-FUNKTION
/**
 * hole li"s
 * itteriere über li's
 *      kontrolliere für jedes li, ob suche == inhalt von li
 *      alle buchstaben in GROß oder klein
 *      manipuliere entsprechend Suchresultat css classes
 */

function searchContact (searchValue) {
    const listItems = document.querySelectorAll('li');
    
    listItems.forEach( (item) => {
        if (item.innerText.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) {  // kontrolliere für jedes li, ob search == Inhalt von li
            item.classList.remove('hide');
        } else {
            item.classList.add('hide');
        }
    });
};

// LocalStorage Leer-Funktion
function clearLocalStorage () {
    localStorage.clear();
    location.reload();
};



