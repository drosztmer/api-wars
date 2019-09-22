function pageNext() {
    let nextButton = document.querySelector('#next');
    nextButton.setAttribute('class', 'button');
    nextButton.addEventListener('click', function () {
        nextButton.disabled = true;
        let table = document.querySelector('#table');
        let pageCounter = table.dataset.currentPage;
        pageCounter++;
        table.dataset.currentPage = pageCounter;
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        getTable(pageCounter);
    });
}

function pagePrevious() {
    let previousButton = document.querySelector('#previous');
    previousButton.setAttribute('class', 'button');
    previousButton.addEventListener('click', function () {
        previousButton.disabled = true;
        let table = document.querySelector('#table');
        let pageCounter = table.dataset.currentPage;
        pageCounter--;
        table.dataset.currentPage = pageCounter;
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        getTable(pageCounter);
    });
}


function getTable(pageCounter) {
    fetch(`https://swapi.co/api/planets/?page=${pageCounter}`).then((response) => response.json())
        .then((data) => {
            let tableHead = document.createElement('thead');
            let nameHead = document.createElement('th');
            let diameterHead = document.createElement('th');
            let climateHead = document.createElement('th');
            let terrainHead = document.createElement('th');
            let surfaceHead = document.createElement('th');
            let populationHead = document.createElement('th');
            let residentsHead = document.createElement('th');
            let voteHead = document.createElement('th');

            nameHead.innerText = 'Name';
            diameterHead.innerText = 'Diameter';
            climateHead.innerText = 'Climate';
            terrainHead.innerText = 'Terrain';
            surfaceHead.innerText = 'Surface Water Percentage';
            populationHead.innerText = 'Population';
            residentsHead.innerText = 'Residents';
            voteHead.innerText = '';

            tableHead.appendChild(nameHead);
            tableHead.appendChild(diameterHead);
            tableHead.appendChild(climateHead);
            tableHead.appendChild(terrainHead);
            tableHead.appendChild(surfaceHead);
            tableHead.appendChild(populationHead);
            tableHead.appendChild(residentsHead);
            tableHead.appendChild(voteHead);

            table.appendChild(tableHead);
            let texts = [];
            for (let i = 0; i < data.results.length; i++) {
                let newRow = document.createElement('tr');

                let name = document.createElement('td');
                let diameter = document.createElement('td');
                let climate = document.createElement('td');
                let terrain = document.createElement('td');
                let surface = document.createElement('td');
                let population = document.createElement('td');
                let residents = document.createElement('td');
                let voteCell = document.createElement('td');

                name.innerText = data.results[i].name;
                if (data.results[i].diameter !== 'unknown') {
                    diameter.innerText = `${parseInt(data.results[i].diameter).toLocaleString()} km`;
                }
                else {
                    diameter.innerText = data.results[i].diameter;
                }
                climate.innerText = data.results[i].climate;
                terrain.innerText = data.results[i].terrain;
                if (data.results[i].surface_water !== 'unknown') {
                    surface.innerText = `${data.results[i].surface_water}%`;
                } else {
                    surface.innerText = data.results[i].surface_water;
                }
                if (data.results[i].population > 0) {
                    population.innerText = `${parseInt(data.results[i].population).toLocaleString()} people`;
                } else {
                    population.innerText = 'unknown';
                }
                if (data.results[i].residents.length === 0) {
                    residents.innerText = 'No known residents';
                } else {

                    texts[i] = data.results[i].residents;

                    function getNames(people) {
                        for (let j = 0; j < texts[i].length; j++) {
                            fetch(`${texts[i][j]}`).then((response) => response.json())
                                .then((data) => {
                                    let modal = createModal(data.name, data.height, data.mass, data.hair_color,
                                        data.skin_color, data.eye_color, data.birth_year, data.gender, i);
                                    appendText(data.name, data.height, data.mass, data.hair_color,
                                        data.skin_color, data.eye_color, data.birth_year, data.gender, i);
                                    document.body.appendChild(modal);
                                });
                        }
                    }

                    getNames();
                    console.log();

                    if (document.contains(document.querySelector(`#myModal${i}`))) {
                        document.querySelector(`#myModal${i}`).remove();
                    }
                    if (document.contains(document.querySelector(`#myText${i}`))) {
                        document.querySelector(`#myText${i}`).innerHTML = '';
                    }
                    if (document.contains(document.querySelector(`#modalTableHead${i}`))) {
                        while (document.querySelector(`#modalTableHead${i}`).childNodes.length > 8) {
                            document.querySelector(`#modalTableHead${i}`).removeChild(document.querySelector(`#modalTableHead${i}`).lastChild);
                        }
                    }


                    let residentsButton = document.createElement('button');
                    residentsButton.setAttribute('id', 'modal-button');
                    residentsButton.setAttribute('type', 'button');
                    residentsButton.setAttribute('class', 'button');
                    residentsButton.setAttribute('data-toggle', 'modal');
                    residentsButton.setAttribute('data-target', `#myModal${i}`);
                    residents.appendChild(residentsButton);
                    residentsButton.innerText = `${data.results[i].residents.length} resident(s)`;
                }
                let voteButton = document.createElement('button');
                voteButton.setAttribute('class', 'button');
                voteCell.appendChild(voteButton);
                voteButton.innerText = 'Vote';

                table.appendChild(newRow);
                newRow.appendChild(name);
                newRow.appendChild(diameter);
                newRow.appendChild(climate);
                newRow.appendChild(terrain);
                newRow.appendChild(surface);
                newRow.appendChild(population);
                newRow.appendChild(residents);
                newRow.appendChild(voteCell);
            }
            let previousButton = document.querySelector('#previous');
            if (data.previous == null) {
                previousButton.disabled = true;
            } else {
                previousButton.disabled = false;
            }
            let nextButton = document.querySelector('#next');
            if (data.next == null) {
                nextButton.disabled = true;
            } else {
                nextButton.disabled = false;
            }
        });
}

function createModal(name, height, mass, hairColor, skinColor, eyeColor, birthYear, gender, i) {
    let myModal = document.createElement('div');
    myModal.setAttribute('id', `myModal${i}`);
    myModal.setAttribute('class', 'modal fade');
    myModal.setAttribute('role', 'dialog');
    let modalDialog = document.createElement('div');
    modalDialog.setAttribute('class', 'modal-dialog');
    let modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal-content');
    modalContent.classList.add('myStyle');

    let modalHeader = document.createElement('div');
    modalHeader.setAttribute('class', 'modal-header');
    let xButton = document.createElement('button');
    xButton.setAttribute('type', 'button');
    xButton.setAttribute('class', 'close');
    xButton.setAttribute('data-dismiss', 'modal');
    xButton.innerHTML = '&times;';
    let modalBody = document.createElement('div');
    modalBody.setAttribute('class', 'modal-body');

    let modalTable = document.createElement('table');
    modalTable.setAttribute('class', 'table table-bordered');
    modalTable.setAttribute('id', `modal-table${i}`);
    let modalRow = document.createElement('tr');
    modalRow.setAttribute('id', `myRow${i}`);

    let modalTableHead = document.createElement('thead');
    modalTableHead.setAttribute('id', `modalTableHead${i}`);
    let modalNameHead = document.createElement('th');
    let modalHeightHead = document.createElement('th');
    let modalMassHead = document.createElement('th');
    let modalHairColorHead = document.createElement('th');
    let modalSkinColorHead = document.createElement('th');
    let modalEyeColorHead = document.createElement('th');
    let modalBirthYearHead = document.createElement('th');
    let modalGenderHead = document.createElement('th');

    modalNameHead.innerText = 'Name';
    modalHeightHead.innerText = 'Height';
    modalMassHead.innerText = 'Mass';
    modalHairColorHead.innerText = 'Hair color';
    modalSkinColorHead.innerText = 'Skin color';
    modalEyeColorHead.innerText = 'Eye color';
    modalBirthYearHead.innerText = 'Birth year';
    modalGenderHead.innerText = 'Gender';

    let modalName = document.createElement('td');
    let modalHeight = document.createElement('td');
    let modalMass = document.createElement('td');
    let modalHairColor = document.createElement('td');
    let modalSkinColor = document.createElement('td');
    let modalEyeColor = document.createElement('td');
    let modalBirthYear = document.createElement('td');
    let modalGender = document.createElement('td');
    modalName.innerText = name;
    modalHeight.innerText = height;
    modalMass.innerText = mass;
    modalHairColor.innerText = hairColor;
    modalSkinColor.innerText = skinColor;
    modalEyeColor.innerText = eyeColor;
    modalBirthYear.innerText = birthYear;
    modalGender.innerText = gender;

    let modalText = document.createElement('p');
    modalText.setAttribute('id', `myText${i}`);
    let modalFooter = document.createElement('div');
    modalFooter.setAttribute('class', 'modal-footer');
    let closeButton = document.createElement('button');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('class', 'btn btn-default');
    closeButton.setAttribute('data-dismiss', 'modal');
    closeButton.innerText = 'Close';

    modalTableHead.appendChild(modalNameHead);
    modalTableHead.appendChild(modalHeightHead);
    modalTableHead.appendChild(modalMassHead);
    modalTableHead.appendChild(modalHairColorHead);
    modalTableHead.appendChild(modalSkinColorHead);
    modalTableHead.appendChild(modalEyeColorHead);
    modalTableHead.appendChild(modalBirthYearHead);
    modalTableHead.appendChild(modalGenderHead);

    myModal.appendChild(modalDialog);
    modalDialog.appendChild(modalContent);
    modalContent.appendChild(modalHeader);
    modalHeader.appendChild(xButton);
    modalContent.appendChild(modalBody);
    modalBody.appendChild(modalTable);

    modalTable.appendChild(modalTableHead);
    modalTableHead.appendChild(modalRow);
    modalRow.appendChild(modalName);
    modalRow.appendChild(modalHeight);
    modalRow.appendChild(modalMass);
    modalRow.appendChild(modalHairColor);
    modalRow.appendChild(modalSkinColor);
    modalRow.appendChild(modalEyeColor);
    modalRow.appendChild(modalBirthYear);
    modalRow.appendChild(modalGender);

    modalContent.appendChild(modalFooter);
    modalFooter.appendChild(closeButton);
    return myModal;
}

function appendText(name, height, mass, hairColor, skinColor, eyeColor, birthYear, gender, i, modal) {
    if (document.querySelector(`#myRow${i}`) != null) {
        let modalRow = document.createElement('tr');

        let modalName = document.createElement('td');
        let modalHeight = document.createElement('td');
        let modalMass = document.createElement('td');
        let modalHairColor = document.createElement('td');
        let modalSkinColor = document.createElement('td');
        let modalEyeColor = document.createElement('td');
        let modalBirthYear = document.createElement('td');
        let modalGender = document.createElement('td');
        modalName.innerText = name;
        modalHeight.innerText = height;
        modalMass.innerText = mass;
        modalHairColor.innerText = hairColor;
        modalSkinColor.innerText = skinColor;
        modalEyeColor.innerText = eyeColor;
        modalBirthYear.innerText = birthYear;
        modalGender.innerText = gender;

        modalRow.appendChild(modalName);
        modalRow.appendChild(modalHeight);
        modalRow.appendChild(modalMass);
        modalRow.appendChild(modalHairColor);
        modalRow.appendChild(modalSkinColor);
        modalRow.appendChild(modalEyeColor);
        modalRow.appendChild(modalBirthYear);
        modalRow.appendChild(modalGender);

        document.querySelector(`#modal-table${i}`).appendChild(modalRow);

    }

}

function init() {
    let pageCounter = 1;
    let table = document.querySelector('#table');
    table.dataset.currentPage = pageCounter;
    window.addEventListener('load', getTable(pageCounter));
    pageNext();
    pagePrevious();

}

init();


