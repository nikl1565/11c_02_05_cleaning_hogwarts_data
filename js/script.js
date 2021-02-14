"use strict";

window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
const Student = {
    firstName: "",
    middleName: "",
    nickName: undefined,
    lastName: "",
    gender: undefined,
    house: "",
    image: undefined,
};

let unfilteredStudents;

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
            unfilteredStudents = jsonData;
            console.log("unfilteredStudents", unfilteredStudents);

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

        let firstName;
        let firstNameFirstLetter;
        // Firstname
        if (firstSpaceInFullName === -1) {
            firstNameFirstLetter = fullName[0].toUpperCase();
            const firstNameAfterFirstLetter = fullName.substring(1);
            firstName = firstNameFirstLetter + firstNameAfterFirstLetter;
            student.firstName = firstNameFirstLetter + firstNameAfterFirstLetter;
        } else {
            const findFirstName = fullName.substring(0, firstSpaceInFullName);
            firstNameFirstLetter = findFirstName[0].toUpperCase();
            const firstNameAfterFirstLetter = findFirstName.substring(1);
            firstName = firstNameFirstLetter + firstNameAfterFirstLetter;
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
        let hasLastNameHyphen;
        let afterHyphenUppercase;

        if (firstName.toLowerCase() !== lastName.toLowerCase()) {
            console.log(lastName);
            hasLastNameHyphen = lastName.indexOf("-");
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
                afterHyphenUppercase = lastName.substring(hasLastNameHyphen + 2);
                console.log("afterHyphenUppercase", afterHyphenUppercase);

                student.lastName = lastNameFirstLetter + beforeHyphenUppercase + hyphenUppercase + afterHyphenUppercase;
            }
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

        console.log(student.lastName);

        // Image
        let multipleWithTheSameLastName = 0;
        unfilteredStudents.forEach((unfilteredStudent) => {
            const lastSpace = unfilteredStudent.fullname.lastIndexOf(" ");
            const lastName = unfilteredStudent.fullname
                .substring(lastSpace + 1)
                .trim()
                .toLowerCase();
            console.log("lol", lastName);

            if (lastName === student.lastName.toLowerCase()) {
                multipleWithTheSameLastName++;
            }
        });
        // If no lastname
        if (firstName.toLowerCase() === lastName.toLowerCase()) {
            student.image = `https://images.unsplash.com/photo-1598153346810-860daa814c4b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1780&q=80`;
            // Else if lastname with hyphen
        } else if (hasLastNameHyphen !== -1) {
            student.image = `img/${lastName.substring(hasLastNameHyphen + 1)}_${firstNameFirstLetter.toLowerCase()}.png`;
            // Else normal way
        } else if (multipleWithTheSameLastName >= 2) {
            console.log("lol");
            console.log("firstName", firstName);
            student.image = `img/${lastName}_${firstName}.png`;
        } else {
            student.image = `img/${lastName}_${firstNameFirstLetter.toLowerCase()}.png`;
        }
        // Add student to allStudent list
        allStudents.push(student);
    });

    console.table(allStudents);

    displayListOfStudents();
}

function displayListOfStudents() {
    console.log("displayListOfStudents");

    allStudents.forEach((student) => {
        console.log(student);

        const template = document.createElement("div");

        const name = document.createElement("h2");
        name.innerHTML = student.firstName;
        if (student.middleName) {
            name.innerHTML += ` ${student.middleName}`;
        }
        if (student.nickName) {
            name.innerHTML += ` "${student.nickName}"`;
        }
        name.innerHTML += ` ${student.lastName}`;

        const gender = document.createElement("p");
        gender.innerHTML = student.gender;

        const house = document.createElement("p");
        house.innerHTML = student.house;

        const image = document.createElement("img");
        image.src = student.image;
        image.alt = [student.firstName, student.nickName, student.middleName, student.lastName].filter(Boolean).join(" ");

        template.appendChild(name);
        template.appendChild(gender);
        template.appendChild(house);
        template.appendChild(image);

        document.querySelector("body").appendChild(template);
    });
}

function displayStudent() {
    console.log("displayStudent");
}
