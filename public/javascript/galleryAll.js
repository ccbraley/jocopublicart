globalObj = {
    artPieces: []
}

//Get all addresses in database then run addressToMarker on them
fetch(`/getAll`)
    .then(response => response.json())
    .then(json => json.filter(piece => !!piece.image))
    .then(pieces => globalObj.artPieces = pieces)
    .then(() => globalObj.artPieces.forEach((artPiece, i) => {
        try{

            if(!artPiece.image) throw `Image name is null for ${artPiece.title}`

            let image = new Image()

            image.src = 'https://jocoarts.web.csit.jccc.edu/art2/public/images/' + encodeURI(artPiece.image)

            if(screen.width > 850){
                image.addEventListener('click', allImagesOnClick)
            }

            image.setAttribute('data-position', i)

            let wrapper = document.createElement('div')

            let artInformation = document.createElement('section');
            artInformation.className = 'mobileOnly';
            artInformation.innerHTML += `<div class="sectionTitle"><span id="title">${artPiece.title}</span></div>
                                <div class="sectionArtist"><span id="artist">${artPiece.firstName + " " + artPiece.lastName}</span></div>
                                <div class="address">
                                    <img class="mapMarker" src="/img/mapmarker.svg" alt="Map Marker">
                                    <div>
                                        <div class="sectionLocation"><span id="location">${artPiece.name}</span></div>
                                        <div class="sectionAddress"><span id="address">${artPiece.street}</span></div>
                                        <div class="sectionCity"><span id="city">${artPiece.city + ", " + artPiece.state}</span></div>
                                    </div>
                                </div>
                                <img src=${image.src} data-position=${i} alt=${artPiece.title}>
                                <div class="sectionDescription" id="sectionDescription${i}">
                                    <span class="description">${artPiece.info.slice(0, 70)}</span>
                                    <span class="sectionMore" id="sectionMore${i}"><span id="more">...more</span></span>
                                </div>
                                `  
            
            document.querySelector('.allImages').appendChild(wrapper)
            if(screen.width > 850) {
                wrapper.appendChild(image)
            }
            wrapper.appendChild(artInformation)

            document.querySelector(`#sectionMore${i}`).addEventListener("click", function(){
                moreInfo(i);
            })

            function moreInfo(iterator) {
                // console.log("this is a string")
                // console.log(document.querySelector(`#sectionDescription${iterator}`).style.height)
                if(document.querySelector(`#sectionDescription${iterator}`).style.height == "43.2px" || document.querySelector(`#sectionDescription${iterator}`).style.height == ""){
                    document.querySelector(`#sectionDescription${iterator}`).style.height = "auto";
                    document.querySelector(`#sectionDescription${iterator} > .description`).innerHTML = `${artPiece.info}`
                    document.querySelector(`#sectionMore${iterator}`).innerHTML = "<div>less</div>"
                }
                else {
                    document.querySelector(`#sectionDescription${iterator}`).style.height = "43.2px";
                    document.querySelector(`#sectionDescription${iterator} > .description`).innerHTML = `${artPiece.info.slice(0, 55)}`
                    document.querySelector(`#sectionMore${iterator}`).textContent = "...more"
                    
                }
            }

        }
        catch(err){
            console.log(err)
        }

    }))


    allImagesOnClick = function(e){ 
        let position = e.target.getAttribute('data-position')
        window.location = '/galleryOne?position=' + position
       //console.log(globalObj.artPieces[position])
    }

let date = new Date();

document.getElementById("year").innerHTML = date.getFullYear();

function mobileNavigation() {
    if(document.querySelector(".nav_mobile").style.display == "flex"){
        document.querySelector(".nav_mobile").style.display = "none";
    }
    else {
        document.querySelector(".nav_mobile").style.display = "flex";
    }
    
}



document.querySelector(".hamburger").addEventListener("click", mobileNavigation)

