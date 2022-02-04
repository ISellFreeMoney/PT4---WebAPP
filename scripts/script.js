const dropArea = document.querySelector('.drag-area'),
    button = document.querySelector('button'),
    input = document.querySelector('input'),
    dragText = document.querySelector('header');
let file; // variable globale qui contiendra le fichier

button.onclick = () => {
    input.click(); // Si l'utilisateur clique sur le bouton, on lui demande de choisir un fichier
};

input.addEventListener('change', function(){
    file = this.files[0]; // On récupère le fichier choisi
    dropArea.classList.add('active');
    affFile();
});   

// Si l'utiliateur passe au dessus de la zone de drop
dropArea.addEventListener('dragover', (e) => {

    e.preventDefault(); // Annule le comportement par défaut du navigateur
    //console.log('dragover');
    dropArea.classList.add('active');
    dragText.textContent = ' Lachez le fichier pour deposer ';
});

// Si l'utilisateur sort de la zone de drop
dropArea.addEventListener('dragleave', () => {
    //console.log('dragleave');
    dropArea.classList.remove('active')
    dragText.textContent = ' Glisser et deposer pour upload le fichier ';

});

//Si l'utilisateur drop un fichier
dropArea.addEventListener('drop', (e) => {
    e.preventDefault(); // Annule le comportement par défaut du navigateur
    //console.log('drop');
    // Recuperer le fichier et [0] pour recuperer le premier fichier
    file = e.dataTransfer.files[0];
    affFile();
});

function affFile(){
    let fileType = file.type;
    //console.log(fileType);
    // Verifier le type de fichier
    let validType = ['image/png', 'image/jpeg', "image/webp", "image/jpg"]; // tableau de type de fichier valides
    if (validType.includes(fileType)) { // si le type de fichier est valide
        let reader = new FileReader(); // creer un objet de type FileReader
        reader.onload = () => {
            let fileURL = reader.result;
            let imgTag = `<img src="${fileURL}" alt="">`; // creer une balise img avec l'url du fichier
            dropArea.innerHTML = imgTag; // afficher l'image dans la zone de drop
        }
        reader.readAsDataURL(file); // Fichier traduit en base64
        //console.log('Type valide');
    } else { // si le type de fichier n'est pas valide
        alert('Fichier invalide: ' + fileType);
        dropArea.classList.remove('active');
    }
}

