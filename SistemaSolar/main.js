// --- Escena, cámara y renderizador ---
const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1200);

const motor = new THREE.WebGLRenderer();
motor.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(motor.domElement);

motor.setAnimationLoop(animar);

// --- Función utilitaria para crear planetas ---
function crearEsfera(tamaño, colorHex) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(tamaño, 32, 16),
        new THREE.MeshBasicMaterial({ color: colorHex })
    );
}

// --- Crear cuerpo solar ---
const sol = crearEsfera(20, 0xffff00);
sol.position.set(0, 0, 0);
escena.add(sol);

// --- Datos de planetas ---
const datosPlanetas = [
    { nombre: "mercurio", radio: 40, vel: 0.08, tam: 3, color: 0xF5C527, lunas: 1 },
    { nombre: "venus", radio: 60, vel: 0.06, tam: 5, color: 0xF59C27, lunas: 2 },
    { nombre: "tierra", radio: 80, vel: 0.04, tam: 5, color: 0x278BF5, lunas: 3 },
    { nombre: "marte", radio: 100, vel: 0.03, tam: 4, color: 0xF52727, lunas: 4 },
    { nombre: "jupiter", radio: 140, vel: 0.02, tam: 12, color: 0xFA880C, lunas: 5 },
    { nombre: "saturno", radio: 180, vel: 0.015, tam: 10, color: 0xFFC48A, lunas: 6 },
    { nombre: "urano", radio: 220, vel: 0.01, tam: 7, color: 0x8AF7FF, lunas: 7 },
    { nombre: "neptuno", radio: 260, vel: 0.008, tam: 7, color: 0xA18AFF, lunas: 8 }
];

// --- Arreglos para planetas y sus lunas ---
const planetas = [];
const lunasSistema = [];
const colorLuna = 0xF2E1E1;

// Crear planetas y sus lunas
datosPlanetas.forEach((info, indice) => {
    const planeta = crearEsfera(info.tam, info.color);
    escena.add(planeta);
    planetas.push({ mesh: planeta, ...info });

    const listaLunas = [];
    for (let i = 0; i < info.lunas; i++) {
        const lunar = crearEsfera(1, colorLuna);
        escena.add(lunar);
        listaLunas.push(lunar);
    }
    lunasSistema.push(listaLunas);
});

camara.position.z = 300;

let tiempo = 0;

// --- Animación ---
function animar() {

    // Movimiento de planetas alrededor del sol
    planetas.forEach((p, idx) => {
        p.mesh.position.x = p.radio * Math.cos(tiempo * p.vel);
        p.mesh.position.y = p.radio * Math.sin(tiempo * p.vel);

        // Movimiento de lunas para este planeta
        const lunas = lunasSistema[idx];

        lunas.forEach((luna, j) => {
            const ang = tiempo * 0.2 + (j / lunas.length) * Math.PI * 2;
            const radioOrbita = 8 + idx;
            luna.position.x = p.mesh.position.x + radioOrbita * Math.cos(ang);
            luna.position.y = p.mesh.position.y + radioOrbita * Math.sin(ang);
        });
    });

    tiempo += 0.1;
    motor.render(escena, camara);
}
