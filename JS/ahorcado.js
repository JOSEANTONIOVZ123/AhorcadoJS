
//Poner a los pokemon
const getPokemonCount = async () => {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon-species');
        if (!response.ok) throw new Error('Failed to fetch Pokémon count');
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error(error.message);
    }
};

const fetchPokemon = async () => {
    try {
        const count = await getPokemonCount();
        const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${count}`; //con ${count} sacas los 1025 pokemons
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Pokémon not found');
        const { results } = await response.json();
        return results.map(({ name }) => name);
    } catch (error) {
        console.error(error.message);
    }
};

//conseguir una palabra aleatoria
const getRandomWord = async () => {
    const pokemons = await fetchPokemon();
    return pokemons[Math.floor(Math.random() * pokemons.length)];
};
//He aislado el dibujo del ahorcado para que se pueda ver todo el código sin problema
//Dibujar el ahorcado
const hangmanStages = [
    `
    
    `,
    `
     ------
     |    |
     |
     |
     |
     |
    ---
    `,
    `
     ------
     |    |
     |    O
     |
     |
     |
    ---
    `,
    `
     ------
     |    |
     |    O
     |    |
     |
     |
    ---
    `,
    `
     ------
     |    |
     |    O
     |   /|
     |
     |
    ---
    `,
    `
     ------
     |    |
     |    O
     |   /|\\
     |
     |
    ---
    `,
    `
     ------
     |    |
     |    O
     |   /|\\
     |   /
     |
    ---
    `,
    `
     ------
     |    |
     |    O
     |   /|\\
     |   / \\
     |
    ---
    `
];

//Poder leer por consola(solo funciona en nodejs)
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});


//Función principal 
async function startGame() {
    const word = await getRandomWord();
    const wrongLetters = [];
    let attempts = 7;
    //tapar la palabra con _
    let guessed = '_'.repeat(word.length).split('');

    //Escribir la palabra oculta
    const begin = () => {
        console.log(hangmanStages[7 - attempts]);// escribe por pantalla la "imagen" del ahorcado
        // console.log("palabra provisional: "+word)
        console.log("Letras falladas: " + wrongLetters.join(', '));
        console.log(guessed.join(' '));
        if (attempts > 0) {
            console.log(`Te quedan ${attempts-1} intentos.`);
        }
    };

    //poder escribir por consola
    //Logica del ahorcado
    const askLetter = () => {
        rl.question('Escribe una letra: ', (letter) => {
            if (letter === "1") {
                console.clear();
                console.log(word);
            }
            if (letter === "º") {
                console.clear();
                begin();
            }
            if (letter === "win") {
                console.log("Has ganado Tramposo");
                process.exit(0);
            }

            if (letter.length !== 1 || letter == (/^[A-ZÑ0-9]$/)) {
                console.log('Por favor, introduce solo una letra.');
                askLetter();
                return;
            }
            //Bucle for para comprobar si la letra que he escrito está dentro de la palabra
            let success = false;
            for (let i = 0; i < word.length; i++) {
                if (word[i] === "-") {
                    guessed[i] = "-";
                }
                if (word[i] === letter) {
                    guessed[i] = letter; //cambia la letra oculta en la posición i por la letra sin ocultar
                    success = true;
                }else if (letter === "1"|| letter === "º") {
                    success = true;
                }
            }

            //si no encuentra la letra en la palabra
            if (!success) {
                //si la letra no está en el array wrongLetters lo añade
                if (!wrongLetters.includes(letter)) {
                    wrongLetters.push(letter);
                    attempts--;// pierdes un intento
                    if (attempts > 0) {
                        console.log(`Letra incorrecta. Te quedan ${attempts} intentos.`);
                    }
                } else {
                    console.log('Ya has introducido esa letra incorrecta.'); //sino no la registra y no pierdes un intento
                }
            }
            
            begin();
            
            
            //comprobar si has ganado o perdido/ sino pide otra letra y vuelta a empezar
            if (guessed.join('') === word) {
                console.log('¡Felicidades! Has adivinado la palabra.');
                rl.close();
            } else if (attempts === 0) {
                console.log(`Has perdido. La palabra era: ${word}`);
                rl.close();
            } else {
                askLetter();
            }
        });
    };

    //iniciar el juego
    console.log('¡¡¡Bienvenido al juego del ahorcado!!!');
    begin();
    askLetter();
}

startGame();