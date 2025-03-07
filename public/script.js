let tareas = [];

function mostrarPestaña(tab, event) {
    document.querySelectorAll(".content").forEach(content => content.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(tab).classList.add("active");
    event.target.classList.add("active");
    cargarTareas();
}

function cargarTareas() {
    fetch('http://localhost:3000/cargar-tareas')
        .then(response => response.json())
        .then(data => {
            tareas = data;
            mostrarTareas();
        })
        .catch(error => console.error('Error al cargar tareas:', error));
}

function agregarTarea() {
    const tareaInput = document.getElementById("tareaInput");
    const prioridadInput = document.getElementById("prioridadInput");

    const tarea = {
        descripcion: tareaInput.value,
        prioridad: prioridadInput.value,
        completada: false
    };

    fetch('http://localhost:3000/guardar-tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...tareas, tarea]) // Agregar la nueva tarea a la lista existente
    })
        .then(() => {
            cargarTareas(); // Recargar tareas desde el backend
            tareaInput.value = '';
            prioridadInput.value = 'Normal';
        })
        .catch(error => console.error('Error al guardar tareas:', error));
}

function mostrarTareas() {
    const listaPrioritarias = document.getElementById("listaPrioritarias");
    const listaNormales = document.getElementById("listaNormales");
    listaPrioritarias.innerHTML = '';
    listaNormales.innerHTML = '';

    tareas.forEach((tarea, index) => {
        const li = document.createElement("li");
        
        const tareaText = document.createElement("span");
        tareaText.textContent = tarea.descripcion;
        if (tarea.completada) {
            tareaText.classList.add("completed");
        }

        const checkButton = document.createElement("button");
        checkButton.className = "check-button";
        checkButton.textContent = tarea.completada ? "✔️" : "";
        checkButton.onclick = () => marcarComoCompletada(index);
        if (tarea.completada) {
            checkButton.classList.add("active");
        } else {
            checkButton.classList.remove("active");
        }

        li.appendChild(tareaText);
        li.appendChild(checkButton);

        if (tarea.prioridad === "Prioritaria") {
            listaPrioritarias.appendChild(li);
        } else {
            listaNormales.appendChild(li);
        }
    });
}

function marcarComoCompletada(index) {
    tareas[index].completada = !tareas[index].completada;
    fetch('http://localhost:3000/guardar-tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tareas)
    })
        .then(() => cargarTareas())
        .catch(error => console.error('Error al guardar tareas:', error));
}

function limpiarTareasCompletadas() {
    fetch('http://localhost:3000/limpiar-tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([])
    })
        .then(() => cargarTareas())
        .catch(error => console.error('Error al limpiar tareas:', error));
}

document.getElementById("limpiar-tareas-completadas").addEventListener("click", limpiarTareasCompletadas);

mostrarPestaña('cargarTareas'); // Cargar tareas al inicio