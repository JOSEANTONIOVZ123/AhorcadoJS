const getPokemonCount=async()=>{try{const response=await fetch('https://pokeapi.co/api/v2/pokemon-species');if(!response.ok)throw new Error('Failed to fetch Pokémon count');const data=await response.json();return data.count}catch(error){console.error(error.message)}};const fetchPokemon=async()=>{try{const count=await getPokemonCount();const apiUrl=`https://pokeapi.co/api/v2/pokemon?limit=${count}`;const response=await fetch(apiUrl);if(!response.ok)throw new Error('Pokémon not found');const{results}=await response.json();return results.map(({name})=>name)}catch(error){console.error(error.message)}};const getRandomWord=async()=>{const pokemons=await fetchPokemon();return pokemons[Math.floor(Math.random()*pokemons.length)]};const hangmanStages=[`
    
    `,`
     ------
     |    |
     |
     |
     |
     |
    ---
    `,`
     ------
     |    |
     |    O
     |
     |
     |
    ---
    `,`
     ------
     |    |
     |    O
     |    |
     |
     |
    ---
    `,`
     ------
     |    |
     |    O
     |   /|
     |
     |
    ---
    `,`
     ------
     |    |
     |    O
     |   /|\\
     |
     |
    ---
    `,`
     ------
     |    |
     |    O
     |   /|\\
     |   /
     |
    ---
    `,`
     ------
     |    |
     |    O
     |   /|\\
     |   / \\
     |
    ---
    `];const readline=require('readline');const rl=readline.createInterface({input:process.stdin,output:process.stdout});async function startGame(){const word=await getRandomWord();const wrongLetters=[];let attempts=7;let guessed='_'.repeat(word.length).split('');const begin=()=>{console.log(hangmanStages[7-attempts]);console.log("Letras falladas: "+wrongLetters.join(', '));console.log(guessed.join(' '));if(attempts>0){console.log(`Te quedan ${attempts-1} intentos.`)}};const askLetter=()=>{rl.question('Escribe una letra: ',(letter)=>{if(letter==="1"){console.clear();console.log(word)}
if(letter==="º"){console.clear();begin()}
if(letter==="win"){console.log("Has ganado Tramposo");process.exit(0)}
if(letter.length!==1||letter==(/^[A-ZÑ0-9]$/)){console.log('Por favor, introduce solo una letra.');askLetter();return}
let success=!1;for(let i=0;i<word.length;i++){if(word[i]==="-"){guessed[i]="-"}
if(word[i]===letter){guessed[i]=letter;success=!0}else if(letter==="1"||letter==="º"){success=!0}}
if(!success){if(!wrongLetters.includes(letter)){wrongLetters.push(letter);attempts--;if(attempts>0){console.log(`Letra incorrecta. Te quedan ${attempts} intentos.`)}}else{console.log('Ya has introducido esa letra incorrecta.')}}
begin();if(guessed.join('')===word){console.log('¡Felicidades! Has adivinado la palabra.');rl.close()}else if(attempts===0){console.log(`Has perdido. La palabra era: ${word}`);rl.close()}else{askLetter()}})};console.log('¡¡¡Bienvenido al juego del ahorcado!!!');begin();askLetter()}
startGame()