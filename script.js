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
// OBTENER MÓDULO DE LA URL
// =========================================

const params = new URLSearchParams(window.location.search);

const moduleId = params.get("modulo") || "iso";

const currentModule = modules[moduleId];


// =========================================
// CARGAR INFORMACIÓN DEL MÓDULO
// =========================================

if (currentModule) {

    const title = document.getElementById("module-title");
    const description = document.getElementById("module-description");

    if (title) {
        title.textContent = currentModule.name;
    }

    if (description) {
        description.textContent = currentModule.description;
    }

}


// =========================================
// CONVERTIR NOMBRE DE ARCHIVO
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
            if (word.length === 0) return word;

            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}


// =========================================
// OBTENER ARCHIVOS DE UNA CARPETA
// =========================================

async function getFiles(folder) {

    const url =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/proyectos/1asir/${moduleId}/${folder}?ref=${GITHUB_BRANCH}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            return [];
        }

        const files = await response.json();

        return files.filter(file => file.type === "file");

    } catch (error) {

        console.error("Error obteniendo archivos:", error);

        return [];
    }
}


// =========================================
// CREAR TARJETA DE UN TRABAJO
// =========================================

function createFileCard(file) {

    const card = document.createElement("a");

    card.className = "work-card";

    card.href = file.html_url;

    card.target = "_blank";

    card.rel = "noopener noreferrer";


    const icon = document.createElement("div");

    icon.className = "work-icon";

    icon.textContent = "PDF";


    const information = document.createElement("div");

    information.className = "work-information";


    const title = document.createElement("h4");

    title.textContent = formatFileName(file.name);


    const filename = document.createElement("p");

    filename.textContent = file.name;


    information.appendChild(title);

    information.appendChild(filename);


    const arrow = document.createElement("span");

    arrow.className = "work-arrow";

    arrow.textContent = "↗";


    card.appendChild(icon);

    card.appendChild(information);

    card.appendChild(arrow);


    return card;
}


// =========================================
// CARGAR TODOS LOS TEMAS
// =========================================

async function loadTopics() {

    const container = document.getElementById("topics-container");

    if (!container || !currentModule) {
        return;
    }


    container.innerHTML = "";


    for (const topic of currentModule.topics) {

        const files = await getFiles(topic.folder);


        const topicSection = document.createElement("section");

        topicSection.className = "topic-section";


        const header = document.createElement("div");

        header.className = "topic-header";


        const title = document.createElement("h3");

        title.textContent = topic.name;


        const count = document.createElement("span");

        count.className = "topic-count";

        count.textContent =
            `${files.length} ${files.length === 1 ? "trabajo" : "trabajos"}`;


        header.appendChild(title);

        header.appendChild(count);


        const works = document.createElement("div");

        works.className = "works-list";


        if (files.length === 0) {

            const empty = document.createElement("p");

            empty.className = "empty-topic";

            empty.textContent =
                "Todavía no hay trabajos en este tema.";

            works.appendChild(empty);

        } else {

            files.forEach(file => {

                works.appendChild(
                    createFileCard(file)
                );

            });

        }


        topicSection.appendChild(header);

        topicSection.appendChild(works);


        container.appendChild(topicSection);

    }

}


// =========================================
// INICIAR
// =========================================

loadTopics();
