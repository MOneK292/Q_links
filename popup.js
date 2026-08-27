document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs || !tabs[0] || !tabs[0].url) return;
    let sourceUrl = tabs[0].url;

    let lat = 55.7558;
    let lon = 37.6173;

    // 1. Extract Mercator coordinates if source is NSPD
    let matchX = sourceUrl.match(/coordinate_x=([-+]?\d+\.?\d*)/);
    let matchY = sourceUrl.match(/coordinate_y=([-+]?\d+\.?\d*)/);

    if (matchX && matchY) {
      let x1_src = parseFloat(matchX[1]);
      let y1_src = parseFloat(matchY[1]);
      const R = 6378137;
      lon = (x1_src / R) * (180 / Math.PI);
      lat = (Math.atan(Math.exp(y1_src / R)) - Math.PI / 4) * 2 * (180 / Math.PI);
    } else {
      // 2. Extract standard geographic coordinates (Lat/Lon)
      let matches = sourceUrl.match(/[-+]?\d{1,3}\.\d+/g);
      if (matches && matches.length >= 2) {
        let val0 = parseFloat(matches[0]);
        let val1 = parseFloat(matches[1]);

        // Yandex, 2GIS, and ll= parameter put Longitude first (lon, lat)
        if (sourceUrl.includes('yandex') || sourceUrl.includes('2gis') || sourceUrl.includes('ll=')) {
          lon = val0;
          lat = val1;
        } else {
          // Google Maps (@lat,lon), OSM (#map=z/lat/lon), etc. put Latitude first
          lat = val0;
          lon = val1;
        }
      }
    }

    // Ensure lat is latitude (-90..90) and lon is longitude (-180..180)
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      if (Math.abs(lat) <= 180 && Math.abs(lon) <= 90) {
        let temp = lat;
        lat = lon;
        lon = temp;
      }
    }

    // Calculate Web Mercator (EPSG:3857) for NSPD
    const R = 6378137;
    let x1 = R * lon * Math.PI / 180;
    let y1 = R * Math.log(Math.tan((Math.PI / 4) + (lat * Math.PI / 360)));

    let z = 100 * (Math.pow(2, 19 - 17));

    const urls = {
      nspd: "https://nspd.gov.ru/map?theme_id=1&is_copy_url=true&active_layers=36329%2C36049%2C37299%2C37294%2C36048" + "&coordinate_x=" + x1 + "&coordinate_y=" + y1 + "&zoom=18&baseLayerId=36344",
      egrp: 'https://кадастр.сайт/кадастровая_карта#zoom=18&ct=' + lat + '&cg=' + lon,
      belcad: 'https://map.nca.by/search',
      twogis: 'https://2gis.ru/spb?m=' + lon + '%2C' + lat + '%2F18.89',
      'twogis-uz': 'https://2gis.uz?m=' + lon + '%2C' + lat + '%2F18.89',
      'twogis-kz': 'https://2gis.kz?m=' + lon + '%2C' + lat + '%2F18.89',
      'twogis-tj': 'https://2gis.tj?m=' + lon + '%2C' + lat + '%2F18.89',
      'twogis-by': 'https://2gis.by?m=' + lon + '%2C' + lat + '%2F18.89',
      'twogis-az': 'https://2gis.az?m=' + lon + '%2C' + lat + '%2F18.89',
      'twogis-am': 'https://2gis.am?m=' + lon + '%2C' + lat + '%2F18.89',
      google: 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + z + 'm/data=!3m1!1e3',
      'google-earth': 'https://earth.google.com/web/search/' + lat + ',+' + lon,
      osm: 'https://www.openstreetmap.org/#map=17/' + lat + '/' + lon,
      bing: 'https://www.bing.com/maps?&cp=' + lat + '~' + lon + '&lvl=17&style=h',
      here: 'https://wego.here.com/?map=' + lat + ',' + lon + ',17,satellite&x=ep',
      esri: 'http://osmz.ru/imagery/#17/' + lat + '/' + lon + '/esri',
      wikimapia: 'http://wikimapia.org/#lang=ru&lat=' + lat + '&lon=' + lon + '&z=17&m=w',
      mapillary: 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=17',
      speedcam: 'http://speedcamonline.ru/view/Rus/' + lat + '/' + lon + '/17',
      radarbase: 'https://radarbase.info/map/actual/' + lat + '/' + lon + '/17',
      mapcam: 'https://mapcam.info/speedcam/?lng=' + lon + '&lat=' + lat + '&z=17&t=YSAT',
      nakarte: 'https://nakarte.me/#m=17/' + lat + '/' + lon + '&l=E',
      retromap: 'http://www.retromap.ru/m.html#l=1420013&z=17&y=' + lat + '&x=' + lon,
      waze: 'https://www.waze.com/ru/live-map/directions?to=ll.' + lat + '%2C' + lon,
      pastvu: 'http://pastvu.com/?g=' + lat + ',' + lon + '&z=17&s=yandex&t=scheme&type=1'
    };

    document.querySelectorAll('.map-link').forEach(link => {
      link.href = "#";

      link.addEventListener('click', function (e) {
        e.preventDefault();
        const url = urls[this.id];
        if (url) {
          chrome.tabs.create({ url: url });
        }
      });

      link.addEventListener('auxclick', function (e) {
        if (e.button === 1) {
          e.preventDefault();
          const url = urls[this.id];
          if (url) {
            chrome.tabs.create({ url: url, active: false });
          }
        }
      });
    });

  });
});