"use strict";

var TextAdventure = new function() {
    var adventure = this;
    var displayElement;
    var uniqueCounter = 0;
    var globalVariables = {}; // if localstorage isn't available

    adventure.Position = {
        left: "left",
        right: "right",
        up: "up",
        down: "down"
    };

    adventure.clearVariables = function() {
        if (typeof(Storage) !== "undefined") {
            for (var item in localStorage) {
                localStorage.removeItem(item);
            }
        } else {
            globalVariables = {};
        }
    }

    adventure.createVariables = function() {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof(Storage) !== "undefined" && localStorage.getItem(arguments[i]) !== null) {
                adventure.setVariable(arguments[i], localStorage.getItem(arguments[i]));
            } else {
                adventure.setVariable(arguments[i], "");
            }
        }
    }

    adventure.getVariable = function(name) {
        var variable;

        if (typeof(Storage) !== "undefined") {
            if (localStorage.hasOwnProperty(name) === false) return "";
            variable = localStorage.getItem(name);
        } else {
            if (typeof(globalVariables[name]) === "undefined") return "";
            variable = globalVariables[name];
        }

        return variable;
    }

    adventure.hasVariable = adventure.variableIsSet = adventure.variableNotEmpty = function(name) {
        return adventure.getVariable(name).length > 1;
    }

    adventure.setVariable = function(name, value) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(name, value);
        } else {
            globalVariables[name] = value;
        }
    }

    adventure.narration = function(text) {
        displayElement.innerHTML += "<div class='narration'>" + text + "</div>";
        window.scrollTo(0, document.body.scrollHeight);
    }

    adventure.dialog = function(name, text, position) {
        displayElement.innerHTML += "<div class='" + position + "-align'><span class='name'>" + name + "</span><span class='text'>" + text + "</span></div>";
        window.scrollTo(0, document.body.scrollHeight);
    }

    adventure.choices = function() {
        var id = "unique" + uniqueCounter++
            var choicesHTML = "<div id='" + id + "' class='choices'>";
        for (var i = 0; i < arguments.length; i++) {
            choicesHTML += "<button type='button' class='choice' onclick='" + arguments[i][1] + "; TextAdventure.disableChoices(\"" + id + "\");'>" + arguments[i][0] + "</button>";
        }
        choicesHTML += "</div>";
        displayElement.innerHTML += choicesHTML;
        window.scrollTo(0, document.body.scrollHeight);
    }

    adventure.input = function(name, next) {
        name = name.trim();
        var id = "unique-" + uniqueCounter++
            var inputHTML = "<div  id='" + id + "' class='input'>" +
                "<input type='text' placeholder='" + name + "' value='" + adventure.getVariable(name) + "'></input>" +
                "<button onclick=\"TextAdventure.setVariable('" + name + "', document.getElementById('" + id + "').children[0].value); document.getElementById('" + id + "').children[0].setAttribute('value', TextAdventure.getVariable('" + name + "')); TextAdventure.disableChoices('" + id + "'); " + next + ";\" >OK</button>" +
                "</div>";
        displayElement.innerHTML += inputHTML;
        window.scrollTo(0, document.body.scrollHeight);
    }

    adventure.disableChoices = function(id) {
        var buttons = document.getElementById(id).children;

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }

    adventure.start = function() {
        displayElement = document.getElementById("dialog");

        if (typeof(start) === "function") {
            start();
        } else {
            alert("You need a function named start to begin!");
        }
    }
}