let requestURL ="https://www.7timer.info/bin/civillight.php?lon=97.855&lat=22.21&unit=metric&output=json";


if("geolocaton" in navigator){
      navigator.geolocation.getCurrentPosition(function(position) {
            requestPronosticoTiempo(position.coords.latitude, position.coords.longitude)       
      });
      
}else{
      console.log("no");
}

function requestPronosticoTiempo(Lat, Lon){
      requestURL =`https://www.7timer.info/bin/civillight.php?lon=${Lon}&lat=${Lat}&unit=metric&output=json`;
      let tablapronostico = document.querySelector("#pronostico");
      tablapronostico.innerHTML="";
      $.ajax({
            url: requestURL,
            success: function(result){
                 let resultJSON= JSON.parse(result);
                let tablapronostico = document.querySelector("#pronostico");
                for(let valor of resultJSON.dataseries){
                    let contenedor = document.createElement("div");
                    contenedor.classList.add("prediccion");
                    contenedor.innerHTML=`
                    <span><i class="bi bi-calendar"></i>${formatofecha(""+valor.date)}</span>
                    <span><i class="bi bi-thermometer-high"></i>${valor.temp2m.max}</span>
                    <span><i class="bi bi-thermometer"></i>${valor.temp2m.min}</span>
                    <span class="clima">${formatoclima(valor.weather)}</span>
                    <span>${formatoviento(valor.wind10m_max)}</span>
                    `;
                    tablapronostico.appendChild(contenedor);
                }
            }
      });
}

function formatofecha(fecha){
    let año = fecha.substring(0,4);
    let mes = fecha.substring(4,6);
    let dia = fecha.substring(6,8);
    return `${dia}/${mes}/${año}`;
}
function formatoclima(clima)
{
      
  switch (clima) {
      case 'clear':
          return `<i class="bi bi-sun"></i> Despejado     `
      case 'ts':
          return `<i class="bi bi-cloud-lightning"></i> Tormenta Electrica    `
      case 'pcloudy':
          return `<i class="bi bi-cloud-sun"></i> Parcialmente Nublado  `    
      case 'mcloudy':
          return `<i class="bi bi-cloudy"></i> medianamente Nublado   ` 
      case 'humid':
          return `<i class="bi bi-droplet"></i> Humedo    `  
      case 'lightrain':
          return `<i class="bi bi-cloud-drizzle"></i> LLuvia Legera    `                            
      case 'cloudy':
          return `<i class="bi bi-clouds"></i> Nublado    `                            
      
      default:
          return `<i class="bi bi-question-circle"></i> Desconocido   `
  }
}
function formatoviento(viento)
{
   
  switch (viento) {
    case 1:
          return `<i class="bi bi-wind"></i> Calmado`
    case 2:
          return `<i class="bi bi-wind"></i> Ligero`
    case 3:
          return `<i class="bi bi-wind"></i> Moderado`    
    case 4:
          return `<<i class="bi bi-wind"></i> Fresco` 
    case 5:
          return `<i class="bi bi-wind"></i> Fuerte`
    case 6:
          return `<i class="bi bi-wind"></i> Vendaval`         
    case 7:
          return `<i class="bi bi-wind"></i> Tormenta`
    case 8:
          return `<i class="bi bi-wind"></i> Huracan`                              
      default:
          return `Desconocido<i class="bi bi-wind"></i>`
  }
}



document.querySelector("#btnconsulta").addEventListener("click",function(){
     let Lat = document.querySelector("#Lat").value;
     let Lon = document.querySelector("#Lon").value;
     requestPronosticoTiempo(Lat,Lon);
});

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoid2FsbGhhbW1lciIsImEiOiJja25ka3o1cXUyOHUwMnZsZ2JhdWlxdTVvIn0.Ynv5a_bAJr_v8_QsX4BGRg'
}).addTo(mymap);

let marker;

function onMapClick(e){
      if(marker){
            marker.remove()
      }
      marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
      requestPronosticoTiempo(e.latlng.lat, e.latlng.lng)
}
mymap.on('click', onMapClick);