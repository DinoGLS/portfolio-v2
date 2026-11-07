// Script exécuté avant le premier rendu (côté serveur : pas de "use client" ici).
// Palette claire par défaut : « neige » (blanc neige + rouge inferno). ?palette=aube = variante lavande (mémorisée).
export const PALETTE_INIT_SCRIPT = `(function(){try{var k='portfolio-palette';var p=new URLSearchParams(location.search).get('palette');if(p==='neige'||p==='aube'){localStorage.setItem(k,p)}else{p=localStorage.getItem(k)}document.documentElement.dataset.palette=(p==='aube')?'aube':'neige'}catch(e){document.documentElement.dataset.palette='neige'}})();`;
