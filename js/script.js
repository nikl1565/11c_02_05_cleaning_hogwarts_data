"use strict";

window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: undefined,
    gender: undefined,
    image: undefined,
    house: "",
};

function init() {
    console.log("init");

    loadStudents();

    console.log(allStudents);
}

function loadStudents() {
    console.log("loadStudents");

    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
        .then((response) => response.json())
        .then((jsonData) => {
            prepareObjects(jsonData);
        });
}

function prepareObjects(jsonData) {
    console.log("prepareObjects");
    console.log(jsonData);

    jsonData.forEach((jsonObject) => {
        const student = Object.create(Student);

        const fullName = jsonObject.fullname.toLowerCase().trim();
        const firstSpaceInFullName = fullName.indexOf(" ");
        const lastSpaceInFullName = fullName.lastIndexOf(" ");
        const checkForHyphen = fullName.indexOf("-");

        // Firstname
        if (firstSpaceInFullName === -1) {
            const firstNameFirstLetter = fullName[0].toUpperCase();
            const firstNameAfterFirstLetter = fullName.substring(1);
            student.firstName = firstNameFirstLetter + firstNameAfterFirstLetter;
        } else {
            const findFirstName = fullName.substring(0, firstSpaceInFullName);
            const firstNameFirstLetter = findFirstName[0].toUpperCase();
            const firstNameAfterFirstLetter = findFirstName.substring(1);
            student.firstName = firstNameFirstLetter + firstNameAfterFirstLetter;
        }

        let middlePartOfName = fullName.substring(firstSpaceInFullName, lastSpaceInFullName).trim();
        // Middlename or nickname exists
        if (middlePartOfName) {
            // If nickname
            if (middlePartOfName.startsWith('"')) {
                middlePartOfName = middlePartOfName.replaceAll('"', "");

                const middlePartOfNameFirstLetter = middlePartOfName[0].toUpperCase();
                const middlePartOfNameAfterFirstLetter = middlePartOfName.substring(1);
                student.nickName = middlePartOfNameFirstLetter + middlePartOfNameAfterFirstLetter;
                student.middleName = null;

                // Else middlename
            } else {
                const middlePartOfNameFirstLetter = middlePartOfName[0].toUpperCase();
                const middlePartOfNameAfterFirstLetter = middlePartOfName.substring(1);
                student.middleName = middlePartOfNameFirstLetter + middlePartOfNameAfterFirstLetter;
                student.nickName = null;
            }
        } else {
            student.middleName = null;
            student.nickName = null;
        }

        // Lastname
        const lastName = fullName.substring(lastSpaceInFullName).trim();
        const hasLastNameHyphen = lastName.indexOf("-");
        // If no hyphen
        if (hasLastNameHyphen === -1) {
            const lastNameFirstLetter = lastName[0].toUpperCase();
            const lastNameAfterFirstLetter = lastName.substring(1);
            student.lastName = lastNameFirstLetter + lastNameAfterFirstLetter;
            // Else has hyphen
        } else {
            const lastNameFirstLetter = lastName[0].toUpperCase();
            const beforeHyphenUppercase = lastName.substring(1, hasLastNameHyphen + 1);
            console.log("beforeHyphen", beforeHyphenUppercase);
            const hyphenUppercase = lastName[hasLastNameHyphen + 1].toUpperCase();
            console.log("hyphenUppercase", hyphenUppercase);
            const afterHyphenUppercase = lastName.substring(hasLastNameHyphen + 2);
            console.log("afterHyphenUppercase", afterHyphenUppercase);

            student.lastName = lastNameFirstLetter + beforeHyphenUppercase + hyphenUppercase + afterHyphenUppercase;
        }

        // House
        const house = jsonObject.house.toLowerCase().trim();
        const houseFirstLetterUppercase = house[0].toUpperCase();
        const houseAfterFirstLetter = house.substring(1);
        student.house = `${houseFirstLetterUppercase}${houseAfterFirstLetter}`;

        // Gender
        const gender = jsonObject.gender.toLowerCase();
        const genderFirstLetter = gender[0].toUpperCase();
        const genderAfterFirstLetter = gender.substring(1);
        student.gender = genderFirstLetter + genderAfterFirstLetter;

        // Add student to allStudent list
        allStudents.push(student);
    });

    console.table(allStudents);
}

function displayListOfStudents() {
    console.log("displayListOfStudents");
}

function displayStudent() {
    console.log("displayStudent");
}
