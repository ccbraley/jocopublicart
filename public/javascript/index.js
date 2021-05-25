let globalObj = {
  allMarkers: [],
  currentMarkers: []
}

//HERE api codes
let platform = new H.service.Platform({
    'app_id': 'R0frtEdykkNdZxJT1Ir7',
    'app_code': 'iEI5rEKwcvG7exAz-eXmxA',
    'useHTTPS': true
})

// Obtain the default map types from the platform object:
let defaultLayers = platform.createDefaultLayers()

// Instantiate (and display) a map object:
let map = new H.Map(
  document.getElementById('myCoolMap'),
  defaultLayers.normal.map,
  {
    zoom: 12,
    center: { lat: 38.95, lng: -94.7 }
  })

//enable panning
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

//Enable UI
let ui = H.ui.UI.createDefault(map, defaultLayers)

//Get an instance of geocoding service
let geocoder = platform.getGeocodingService();


//Get all addresses in database then run addressToMarker on them
fetch(`/getAll`)
    .then(response => response.json())
    .then(json => json.forEach( (obj, iterator) => initMarkers(obj, iterator)))
    .then(globalObj.currentMarkers = globalObj.allMarkers)

let initMarkers = function(obj, iterator){

  let geocodingParams = {
    searchText: `${obj.street}, ${obj.city}, ${obj.state}`
  }

  geocoder.geocode(geocodingParams, function(result){
    if(result.Response.View.length === 0){return}

    let locations = result.Response.View[0].Result,
    position,
    marker;

      position = {
        lat: locations[0].Location.DisplayPosition.Latitude,
        lng: locations[0].Location.DisplayPosition.Longitude
      };

      //Create marker
      marker = new H.map.Marker(position);

      //Set the current object as a data attribute of the marker so we can get it later.
      marker.setData(obj)

      

      //add an event listener to the marker
      marker.addEventListener('tap', (e) => console.log(e.target.getData()))

      marker.addEventListener('tap', (e) => {
        document.querySelector('#artWindow').classList.remove('hideDisplay')
        document.querySelector('#artWindow').classList.add('flexDisplay')
        let source = 'https://jocoarts.web.csit.jccc.edu/art2/public/images/' + encodeURI(e.target.getData().image)
        let artist = e.target.getData().firstName + " " + e.target.getData().lastName;
        let title = e.target.getData().title;
        let location = e.target.getData().name;
        let address = e.target.getData().street;
        let city = e.target.getData().city + ", " + e.target.getData().state;
        let description = e.target.getData().info;
        document.querySelector('#artWindow').innerHTML = `
            <img src="${source}" alt="${title}" class="artImage">
            <div id="sectionTitle"><img id="sectionArrow" src="/img/thisarrowleft.svg" alt="Close Arrow"><span id="title">${title}</span></div>
            <div class="sectionHeader" id="artistHeader">Artist</div>
            <div id="sectionArtist"><span id="artist">${artist}</span></div>
            <div class="sectionHeader" id="locationHeader">Location</div>
            <div class="address">
              <div>
                <div id="sectionLocation"><span id="location">${location}</span></div>
                <div id="sectionAddress"><span id="address">${address}</span></div>
                <div id="sectionCity"><span id="city">${city}</span></div>
              </div>
            </div>`
        
      })

      //Add the marker to the map
      map.addObject(marker)
      //Add marker to markers list
      globalObj.allMarkers.push(marker)

  }, (e) => console.log(e)) //Console log errors
}

let artWindow = document.querySelector(`#artWindow`);
artWindow.addEventListener('click', (e) => {
  if(screen.width >= 850){
    if(artWindow.style.width == "20%" || artWindow.style.width == ""){
      artWindow.classList.add('hideDisplay');
      artWindow.classList.remove('flexDisplay');
    }
  }
  if(screen.width < 850){
    console.log(artWindow.style.height);
    if(artWindow.style.height == '10vh' || artWindow.style.height == ""){
      artWindow.style.height = 'calc(100vh - 6.5em)';
      artWindow.style.top = '0';
      document.querySelector(`#sectionTitle`).style.order = `1`;
      document.querySelector(`#sectionArrow`).style.transform = `rotate(270deg)`;
      document.querySelector(`.artImage`).style.display = "inherit";
      document.querySelector(`.artImage`).style.order = "2";
      let sectionHeaderDisplay = document.querySelectorAll(`.sectionHeader`)
      for(i=0;i<sectionHeaderDisplay.length;i++){
        sectionHeaderDisplay[i].style.display = "inherit"
      }
      document.querySelector(`#artistHeader`).style.order = "3"
      document.querySelector(`#sectionArtist`).style.display = "inherit";
      document.querySelector(`#sectionArtist`).style.order = "4"
      document.querySelector(`#locationHeader`).style.order = "5"
      document.querySelector(`.address`).style.display = "inherit";
      document.querySelector(`.address`).style.order = "6"
    }
    else {
      artWindow.style.height = '10vh';
      artWindow.style.top = 'calc(90vh - 6.5em)';
      document.querySelector(`#sectionTitle`).style.order = `1`;
      document.querySelector(`#sectionArrow`).style.transform = `rotate(90deg)`;
      document.querySelector(`.artImage`).style.display = "none";
      let sectionHeaderDisplay = document.querySelectorAll(`.sectionHeader`)
      for(i=0;i<sectionHeaderDisplay.length;i++){
        sectionHeaderDisplay[i].style.display = "none"
      }
      document.querySelector(`#sectionArtist`).style.display = "none";
      document.querySelector(`.address`).style.display = "none";
    }
  }
})

//Handle city filtering
document.querySelectorAll(".cityFilter").forEach(obj => {

  obj.addEventListener('click', (e) => {
    let filterCity = e.target.dataset.city

    document.querySelectorAll(".cityFilter").forEach(object => object.classList.remove('selectedFilter'))

    obj.classList.add('selectedFilter')

    map.removeObjects(globalObj.currentMarkers)

    if(filterCity === 'All'){
      globalObj.allMarkers.map(marker => {
        map.addObject(marker)
      })
      globalObj.currentMarkers = globalObj.allMarkers
      return
    }

    globalObj.currentMarkers = []

    globalObj.allMarkers.map(marker => {
      if(marker.getData().city === filterCity){
        map.addObject(marker)
        globalObj.currentMarkers.push(marker)
      }
    })
  })
})

function mobileNavigation() {
  if(document.querySelector(".nav_mobile").style.display == "flex"){
      document.querySelector(".nav_mobile").style.display = "none";
  }
  else {
      document.querySelector(".nav_mobile").style.display = "flex";
  }
  
}

document.querySelector(".hamburger").addEventListener("click", mobileNavigation)

let date = new Date();

document.getElementById("year").innerHTML = date.getFullYear();
