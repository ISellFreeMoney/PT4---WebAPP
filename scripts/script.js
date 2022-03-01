const dropArea = document.querySelector('.drag-area'),
    button = document.querySelector('button'),
    input = document.querySelector('input'),
    dragText = document.querySelector('header');

const model = tf.loadLayersModel('model.json');

// variable globale qui contiendra le fichier
let file;

button.onclick = () => {
    // Si l'utilisateur clique sur le bouton, on lui demande de choisir un fichier
    input.click();
};


input.addEventListener('change', function(){
    file = this.files[0]; // On récupère le fichier choisi
    dropArea.classList.add('active');
    affFile();
    guessImage()
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
            // creer une balise img avec l'url du fichier
            let imgTag = `<img src="${fileURL}" alt="">`;
            // afficher l'image dans la zone de dro
            dropArea.innerHTML = imgTag;
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

function guessImage(){
    model.then(function (res) {
        // Convert the image into the right TensorFlow format
        let example = tf.browser.fromPixels(file).expandDims();
        // Change the size
        example = tf.file.resizeBilinear(example, [150, 150]).div(tf.scalar(255))
        // Cast to float
        example = tf.cast(example, dtype = 'float32');

        // Predict the class
        let prediction = res.predict(example);
        figurineClass=Math.round (prediction.dataSync());
        console.log(figurineClass);

    }, function (err) {
        console.log(err);
    });
}

