const dropArea = document.querySelector('.drag-area'),
    button = document.querySelector('button'),
    input = document.querySelector('input'),
    dragText = document.querySelector('header');

const model = tf.loadLayersModel('model.json');

// variable globale qui contiendra le fichier
let file;

button.onclick = () => {
    console.log('click');
    // Si l'utilisateur clique sur le bouton, on lui demande de choisir un fichier
    input.click();
};

input.addEventListener('change', function(){
    file = this.files[0]; // On récupère le fichier choisi
    dropArea.classList.add('active');
    affFile();
    guessImage();

});

// Permet de redemarrer le processus en cliquant a nouveau sur l'image
dropArea.addEventListener('click', function(){
    if(dropArea.classList.contains('active')) {
        dropArea.classList.remove('active');
        input.value = '';
        dropArea.innerHTML =
            '        <div class="icon"> <i class="fas fa-cloud-upload-alt"></i> </div>\n' +
            '        <header> Glisser et deposer pour upload le fichier </header>\n' +
            '        <span>OU</span>\n' +
            '        <button> Importer un fichier </button>\n' +
            '        <input type="file" hidden>';
            button.click();
    }
});


// Si l'utiliateur passe au dessus de la zone de drop
dropArea.addEventListener('dragover', (e) => {
    // Annule le comportement par défaut du navigateur
    e.preventDefault();
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
    guessImage();
});

// Affiche l'image dans la zone de drop
function affFile(){
    let fileType = file.type;
    //console.log(fileType);
    // Verifier le type de fichier
    // tableau de type de fichier valides
    let validType = ['image/png', 'image/jpeg', "image/webp", "image/jpg"];

    // si le type de fichier est valide
    if (validType.includes(fileType)) {
        // creer un objet de type FileReader
        let reader = new FileReader();
        reader.onload = () => {
            let fileURL = reader.result;
            // afficher l'image dans la zone de dro
            dropArea.innerHTML = `<img src="${fileURL}" alt="">`;
        }
        reader.readAsDataURL(file);
    }
    // si le type de fichier n'est pas valide
    else {
        alert('Fichier invalide: ' + fileType);
        dropArea.classList.remove('active');
    }
}

const classes=['Asterix','Obelix']

// Predit la classe de l'image
function guessImage(){
    model.then(function (res) {
        let fileType = file.type;
        //console.log(fileType);
        // Verifier le type de fichier
        // tableau de type de fichier valides
        let validType = ['image/png', 'image/jpeg', "image/webp", "image/jpg"];
        // si le type de fichier est valide
        if (validType.includes(fileType)) {
            const im = new Image();
            var fr = new FileReader();
            fr.onload = function () {
                im.src = fr.result;
            }
            fr.readAsDataURL(file);
            im.onload = () => {
                let a = tf.browser.fromPixels(im).expandDims();
                a = tf.image.resizeBilinear(a, [150, 150]).div(tf.scalar(255));
                a = tf.cast(a, dtype = 'float32');

                let prediction = res.predict(a);
                figurineClass = Math.round(prediction.dataSync());
                alert(classes[figurineClass]);
                console.log(figurineClass);
            }
        }
    }, function (err) {
        console.log(err);
    });

}

