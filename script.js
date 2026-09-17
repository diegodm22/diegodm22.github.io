// =========================================
// CONFIGURACIÓN DE GITHUB
// =========================================

const GITHUB_USER = "diegodm22";
const GITHUB_REPO = "diegodm22.github.io";
const GITHUB_BRANCH = "main";


// =========================================
// CONFIGURACIÓN DE LOS MÓDULOS
// =========================================

const modules = {

    iso: {
        name: "ISO",
        description: "Implantación de Sistemas Operativos",

        topics: [

            {
                folder: "ud01-software-base",
                name: "UD01 - Software base"
            },

            {
                folder: "ud02-administracion-software-base",
                name: "UD02 - Administración de software base"
            },

            {
                folder: "ud03-aseguramiento-informacion",
                name: "UD03 - Aseguramiento de la información"
            },

            {
                folder: "ud04-implantacion-dominios",
                name: "UD04 - Implantación de dominios"
            },

            {
                folder: "ud05a-administracion-dominios",
                name: "UD05A - Administración de dominios"
            },

            {
                folder: "ud05b-gestion-acceso-dominio",
                name: "UD05B - Gestión de acceso al dominio"
            },

            {
                folder: "ud06-supervision-rendimiento",
                name: "UD06 - Supervisión del rendimiento del sistema"
            },

            {
                folder: "ud07-auditoria",
                name: "UD07 - Auditoría"
            },

            {
                folder: "ud08-resolucion-incidencias",
                name: "UD08 - Resolución Incidencias y servicio técnico"
            },

            {
                folder: "trabajos-taller",
                name: "Trabajos taller"
            }

        ]
    }

};


// =========================================
// OBTENER PARÁMETROS DE LA URL
// =========================================

const params = new URLSearchParams(
    window.location.search
);

const moduleId =
    params.get("modulo") || "iso";

const selectedUnit =
    params.get("unidad");

const currentModule =
    modules[moduleId];


// =========================================
// ELEMENTOS DE LA PÁGINA
// =========================================

const unitSelector =
    document.getElementById("unit-selector");

const unitList =
    document.getElementById("unit-list");

const unitContent =
    document.getElementById("unit-content");

const worksContainer =
    document.getElementById("works-container");

const selectedUnitTitle =
    document.getElementById("selected-unit-title");

const selectedUnitLabel =
    document.getElementById("selected-unit-label");

const previousButton =
    document.getElementById("previous-unit");

const nextButton =
    document.getElementById("next-unit");

const backButton =
    document.getElementById("back-to-units");


// =========================================
// CARGAR INFORMACIÓN DEL MÓDULO
// =========================================

if (currentModule) {

    const title =
        document.getElementById("module-title");

    const description =
        document.getElementById("module-description");

    if (title) {
        title.textContent =
            currentModule.name;
    }

    if (description) {
        description.textContent =
            currentModule.description;
    }

}


// =========================================
// FORMATEAR NOMBRE DE ARCHIVO
// =========================================

function formatFileName(filename) {

    let name = filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return name
        .split(" ")
        .map(word => {

            if (word.length === 0) {
                return word;
            }

            return (
                word.charAt(0).toUpperCase() +
                word.slice(1)
            );

        })
        .join(" ");
}


// =========================================
// OBTENER ARCHIVOS DE UNA UNIDAD
// =========================================

async function getFiles(folder) {

    const url =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/proyectos/1asir/${moduleId}/${folder}?ref=${GITHUB_BRANCH}`;

    try {

        const response =
            await fetch(url);

        if (!response.ok) {
            return [];
        }

        const files =
            await response.json();

        return files.filter(file =>
            file.type === "file" &&
            file.name
                .toLowerCase()
                .endsWith(".pdf")
        );

    } catch (error) {

        console.error(
            "Error obteniendo archivos:",
            error
        );

        return [];
    }
}


// =========================================
// CREAR TARJETA DE PDF
// =========================================

function createFileCard(file) {

    const card =
        document.createElement("a");

    card.className =
        "work-card";

    /*
     * download_url abre directamente
     * el archivo PDF.
     */

    card.href =
        file.download_url || file.html_url;

    card.target =
        "_blank";

    card.rel =
        "noopener noreferrer";


    const icon =
        document.createElement("div");

    icon.className =
        "work-icon";

    icon.textContent =
        "PDF";


    const information =
        document.createElement("div");

    information.className =
        "work-information";


    const title =
        document.createElement("h4");

    title.textContent =
        formatFileName(file.name);


    const filename =
        document.createElement("p");

    filename.textContent =
        file.name;


    information.appendChild(title);

    information.appendChild(filename);


    const arrow =
        document.createElement("span");

    arrow.className =
        "work-arrow";

    arrow.textContent =
        "↗";


    card.appendChild(icon);

    card.appendChild(information);

    card.appendChild(arrow);


    return card;
}


// =========================================
// CREAR LISTA DE UNIDADES
// =========================================

function renderUnitSelector() {

    if (!unitList || !currentModule) {
        return;
    }

    unitList.innerHTML = "";


    currentModule.topics.forEach(
        (topic, index) => {

            const card =
                document.createElement("button");

            card.className =
                "unit-card";

            card.type =
                "button";


            const number =
                document.createElement("span");

            number.className =
                "unit-number";

            number.textContent =
                String(index + 1)
                    .padStart(2, "0");


            const information =
                document.createElement("div");

            information.className =
                "unit-information";


            const title =
                document.createElement("h3");

            title.textContent =
                topic.name;


            const description =
                document.createElement("p");

            description.textContent =
                "Ver trabajos de esta unidad";


            information.appendChild(title);

            information.appendChild(description);


            const arrow =
                document.createElement("span");

            arrow.className =
                "unit-arrow";

            arrow.textContent =
                "→";


            card.appendChild(number);

            card.appendChild(information);

            card.appendChild(arrow);


            card.addEventListener(
                "click",
                () => {

                    openUnit(topic.folder);

                }
            );


            unitList.appendChild(card);

        }
    );
}


// =========================================
// ABRIR UNA UNIDAD
// =========================================

async function openUnit(folder) {

    if (!currentModule) {
        return;
    }


    const index =
        currentModule.topics.findIndex(
            topic => topic.folder === folder
        );


    if (index === -1) {
        return;
    }


    const topic =
        currentModule.topics[index];


    // Actualizar URL

    const newUrl =
        `asignatura.html?modulo=${moduleId}&unidad=${encodeURIComponent(folder)}`;

    window.history.pushState(
        {},
        "",
        newUrl
    );


    // Ocultar selector

    unitSelector.classList.add(
        "hidden"
    );


    // Mostrar contenido

    unitContent.classList.remove(
        "hidden"
    );


    // Actualizar título

    selectedUnitTitle.textContent =
        topic.name;


    selectedUnitLabel.textContent =
        `UNIDAD ${String(index + 1).padStart(2, "0")}`;


    // Botón anterior

    if (index === 0) {

        previousButton.disabled = true;

    } else {

        previousButton.disabled = false;

        previousButton.onclick =
            () => {

                openUnit(
                    currentModule
                        .topics[index - 1]
                        .folder
                );

            };

    }


    // Botón siguiente

    if (
        index ===
        currentModule.topics.length - 1
    ) {

        nextButton.disabled = true;

    } else {

        nextButton.disabled = false;

        nextButton.onclick =
            () => {

                openUnit(
                    currentModule
                        .topics[index + 1]
                        .folder
                );

            };

    }


    // Limpiar trabajos

    worksContainer.innerHTML =
        `<div class="loading">
            Cargando trabajos...
        </div>`;


    // Obtener PDFs

    const files =
        await getFiles(folder);


    worksContainer.innerHTML =
        "";


    if (files.length === 0) {

        const empty =
            document.createElement("p");

        empty.className =
            "empty-topic";

        empty.textContent =
            "Todavía no hay trabajos en esta unidad.";

        worksContainer.appendChild(
            empty
        );

        return;
    }


    // Crear trabajos

    files.forEach(file => {

        worksContainer.appendChild(
            createFileCard(file)
        );

    });

}


// =========================================
// VOLVER AL SELECTOR
// =========================================

function showUnitSelector() {

    unitContent.classList.add(
        "hidden"
    );

    unitSelector.classList.remove(
        "hidden"
    );


    const newUrl =
        `asignatura.html?modulo=${moduleId}`;

    window.history.pushState(
        {},
        "",
        newUrl
    );

}


// =========================================
// BOTÓN "TODAS LAS UNIDADES"
// =========================================

if (backButton) {

    backButton.addEventListener(
        "click",
        showUnitSelector
    );

}


// =========================================
// INICIO
// =========================================

if (currentModule) {

    renderUnitSelector();


    /*
     * Si la URL tiene una unidad,
     * abrirla directamente.
     */

    if (selectedUnit) {

        const exists =
            currentModule.topics.some(
                topic =>
                    topic.folder === selectedUnit
            );


        if (exists) {

            openUnit(selectedUnit);

        }

    }

}