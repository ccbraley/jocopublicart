globalObj = {
    artPieces: [],
    currentPosition : 0
}

fetch(`/getAll`)
    .then(response => response.json())
    .then(json => json.filter(piece => !!piece.image))
    .then(pieces => globalObj.artPieces = pieces)
    .then(() => {
        let position = getqsv('position')
        let moveBack = document.querySelector('#moveBack')
        let moveForward = document.querySelector('#moveForward')

        globalObj.currentPosition = position

        setImage()

        moveBack.addEventListener('click', () => {
            if(globalObj.currentPosition === 0){
                globalObj.currentPosition = globalObj.artPieces.length - 1
            }else{
                globalObj.currentPosition--
            }

            setImage()
        })

        moveForward.addEventListener('click', () =>{
            if(globalObj.currentPosition === globalObj.artPieces.length - 2){
                globalObj.currentPosition = 0
            }else{
                globalObj.currentPosition++
            }
            setImage()
        })


    })

function setImage(){
    let pieceImg = document.querySelector('#pieceImg')
    let description = document.querySelector('#description')
    let artist = document.querySelector('#artist')
    let title = document.querySelector('#title')
    let backgroundTitle = document.querySelector('#backgroundTitle')
    let location = document.querySelector('#location')
    let address = document.querySelector('#address')
    let city = document.querySelector('#city')
    
    let position = globalObj.currentPosition
    pieceImg.src = 'https://jocoarts.web.csit.jccc.edu/art2/public/images/' + encodeURI(globalObj.artPieces[position].image)
    pieceImg.alt = globalObj.artPieces[position].title

    description.textContent = globalObj.artPieces[position].info
    artist.textContent = globalObj.artPieces[position].firstName + " " + globalObj.artPieces[position].lastName
    backgroundTitle.textContent = globalObj.artPieces[position].title
    title.textContent = globalObj.artPieces[position].title
    location.textContent = globalObj.artPieces[position].name
    address.textContent = globalObj.artPieces[position].street
    city.textContent = globalObj.artPieces[position].city + ", " + globalObj.artPieces[position].state;
}

function getqsv(param) {
    var qs = window.location.search.substring(1);
    var v = qs.split('&');
    for (var i=0;i<v.length;i++) {
        var p = v[i].split('=');
        if (p['0'] == param) { return p['1']; }
    }
    return null;
}

let date = new Date();

document.getElementById("year").innerHTML = date.getFullYear();