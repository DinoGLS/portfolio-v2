// Script anti-flash : applique le thème AVANT le premier rendu (à mettre dans <head>).
// Fichier sans "use client" : une constante exportée d'un module client n'est pas une chaîne côté serveur.
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("portfolio-theme");var dark=s?s==="dark":!window.matchMedia("(prefers-color-scheme: light)").matches;var r=document.documentElement;r.classList.toggle("dark",dark);r.style.colorScheme=dark?"dark":"light"}catch(e){}})();`;
