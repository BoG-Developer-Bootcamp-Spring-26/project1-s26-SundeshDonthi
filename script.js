const TYPE_COLORS = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

let currentId = 132; 
let activeTab = 'info';

async function fetchPokemon(id) {
  document.getElementById('pokemon-name').textContent = 'Loading...';
  document.getElementById('info-content').innerHTML = '';
  document.getElementById('types-list').innerHTML = '';
  document.getElementById('moves-list').innerHTML = '';

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error('Pokémon not found');
    const data = await res.json();

    renderImage(data);
    renderName(data);
    renderTypes(data);
    renderInfo(data);
    renderMoves(data);
    updatePrevButton();

  } catch (err) {
    document.getElementById('pokemon-name').textContent = 'Error loading Pokémon';
    console.error(err);
  }
}

function renderImage(data) {
  const imgEl = document.getElementById('pokemon-img');
  imgEl.src = data.sprites.front_default || '';
  imgEl.alt = data.name;
}

function renderName(data) {
  document.getElementById('pokemon-name').textContent = data.name;
}

function renderTypes(data) {
  const typesList = document.getElementById('types-list');
  data.types.forEach(t => {
    const badge = document.createElement('span');
    badge.className = 'type-badge';
    badge.textContent = t.type.name;
    badge.style.background = TYPE_COLORS[t.type.name] || '#888';
    typesList.appendChild(badge);
  });
}

function renderInfo(data) {
  const height = (data.height * 0.1).toFixed(1);
  const weight = (data.weight * 0.1).toFixed(1);

  const stats = {};
  data.stats.forEach(s => {
    stats[s.stat.name] = s.base_stat;
  });

  document.getElementById('info-content').innerHTML = `
    height: ${height}m<br>
    weight: ${weight}kg<br>
    hp: ${stats['hp'] ?? 'N/A'}<br>
    attack: ${stats['attack'] ?? 'N/A'}<br>
    defense: ${stats['defense'] ?? 'N/A'}<br>
    special-attack: ${stats['special-attack'] ?? 'N/A'}<br>
    special-defense: ${stats['special-defense'] ?? 'N/A'}<br>
    speed: ${stats['speed'] ?? 'N/A'}
  `;
}

function renderMoves(data) {
  const movesList = document.getElementById('moves-list');
  data.moves.forEach(m => {
    const li = document.createElement('li');
    li.textContent = m.move.name;
    movesList.appendChild(li);
  });
}

function updatePrevButton() {
  document.getElementById('btn-prev').disabled = currentId <= 1;
}

function changePokemon(delta) {
  const newId = currentId + delta;
  if (newId < 1) return;
  currentId = newId;
  fetchPokemon(currentId);
}

function switchTab(tab) {
  activeTab = tab;

  const infoPanel = document.getElementById('info-panel');
  const movesPanel = document.getElementById('moves-panel');
  const tabInfo = document.getElementById('tab-info');
  const tabMoves = document.getElementById('tab-moves');
  const panelTitle = document.getElementById('panel-title');

  if (tab === 'info') {
    infoPanel.classList.remove('hidden');
    movesPanel.classList.add('hidden');
    tabInfo.classList.add('active');
    tabMoves.classList.remove('active');
    panelTitle.textContent = 'Info';
  } else {
    movesPanel.classList.remove('hidden');
    infoPanel.classList.add('hidden');
    tabMoves.classList.add('active');
    tabInfo.classList.remove('active');
    panelTitle.textContent = 'Moves';
  }
}

fetchPokemon(currentId);