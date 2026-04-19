document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let sourceUrl = tabs[0].url;
    let lon = sourceUrl.match(/[-+]?\d{1,3}\.\d+/g)[1];
    let lat = sourceUrl.match(/[-+]?\d{1,3}\.\d+/g)[0];
    let z = 100 *(Math.pow(2, 19 - 17));

    let y = sourceUrl.match(/[-0-9]{0,3}[0-9]{1,2}\.\d+(?=\&)/);
    let x = sourceUrl.match(/[-0-9]{0,3}[0-9]{1,2}[\.]{1}[0-9]{2,7}/);
    const R = 6378137;
    let x1 = R * x * Math.PI / 180;
    let y1 = R * Math.log(Math.tan((Math.PI / 4) + (y * Math.PI / 360)));

    const urls = {
      nspd: "https://nspd.gov.ru/map?zoom=20" + "&coordinate_x=" + x1 + "&coordinate_y=" + y1 + "&theme_id=1&is_copy_url=true&active_layers=36329%2C36049%2C37299%2C37294%2C36048",
      egrp: 'https://кадастр.сайт/кадастровая_карта#zoom=18&ct=' + lon + '&cg=' + lat,
      belcad: 'https://map.nca.by/search',
      twogis: 'https://2gis.ru/spb?' + 'm=' + lat + '%2' + 'C' + lon + '%2F' + '18' + '.89',
      'twogis-uz': 'https://2gis.uz?' + 'm=' + lat + '%2' + 'C' + lon + '%2F' + '18' + '.89',
      'twogis-kz': 'https://2gis.kz?' + 'm=' + lat + '%2' + 'C' + lon + '%2F' + '18' + '.89',
      'twogis-am': 'https://2gis.am?' + 'm=' + lat + '%2' + 'C' + lon + '%2F' + '18' + '.89',
      'twogis-by': 'https://2gis.by?' + 'm=' + lat + '%2' + 'C' + lon + '%2F' + '18' + '.89',
      'twogis-az': 'https://2gis.az?' + 'm=' + lat + '%2' + 'C' + lon + '%2F' + '18' + '.89',
      'twogis-ge': 'https://2gis.ge/ru?' + 'm=' + lat + '%2' + 'C' + lon + '%2F' + '18' + '.89',
      google: 'https://www.google.com/maps/@' + lon + ',' + lat + ',' + z + 'm/data=!3m1!1e3',
      osm: 'https://www.openstreetmap.org/#map=17' + '/' + lon + '/' + lat,
      bing: 'https://www.bing.com/maps?&cp=' + lon + '~' + lat + '&lvl=' + '17&style=h',
      here: 'https://wego.here.com/?map=' + lon + ',' + lat + ','+ '17' + ',satellite&x=ep',
      esri: 'http://osmz.ru/imagery/#17/'+ lon + '/' + lat + '/esri',
      wikimapia: 'http://wikimapia.org/#lang=ru&lat=' + lon + '&lon=' + lat + '&z=' + '17' + '&m=w',
      mapillary: 'https://www.mapillary.com/app/?lat=' + lon + '&lng=' + lat + '&z=' + '17',
      speedcam: 'http://speedcamonline.ru/view/Rus/' + lon + '/' + lat + '/17',
      radarbase: 'https://radarbase.info/map/actual/' + lon + '/' + lat + '/17',
      mapcam: 'https://mapcam.info/speedcam/?lng=' + lat + '&lat=' + lon + '&z=17&t=YSAT',
      nakarte: 'https://nakarte.me/#m=' + '17' + '/' + lon + '/' + lat + '&l=E',
      retromap: 'http://www.retromap.ru/m.html#l=1420013&z=17&y=' + lon + '&x=' + lat,
      waze: "https://www.waze.com/ru/live-map/directions?to=ll." + lon + "%2C" + lat,
      pastvu: 'http://pastvu.com/?g=' + lon + ',' + lat + '&z=17&s=yandex&t=scheme&type=1'
    };

    document.querySelectorAll('.map-link').forEach(link => {
      link.href = "#";
      
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const url = urls[this.id];
        if (url) {
          chrome.tabs.create({url: url});
        }
      });
      
      link.addEventListener('auxclick', function(e) {
        if (e.button === 1) {
          e.preventDefault();
          const url = urls[this.id];
          if (url) {
            chrome.tabs.create({url: url, active: false});
          }
        }
      });
    });

  });
});