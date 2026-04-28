/**
 * Google Apps Script — Bitacora de Visitas de Parcelas
 *
 * INSTRUCCIONES:
 * 1. Crear un Google Sheet nuevo en driveconsdeagave@gmail.com
 * 2. Ir a Extensiones > Apps Script
 * 3. Pegar TODO este codigo (reemplazar Code.gs)
 * 4. Ejecutar la funcion "setup" UNA SOLA VEZ (crea pestanas + llena catalogos)
 * 5. Implementar > Nueva implementacion > App web
 *    - Ejecutar como: Yo
 *    - Quien tiene acceso: Cualquier persona
 * 6. Copiar la URL y pegarla en bitacora-parcelas.html (const SCRIPT_URL)
 */

/* ================================================================
   SETUP — Ejecutar UNA VEZ para crear pestanas y llenar catalogos
   ================================================================ */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── 1. Bitacora de Visitas ──
  var shB = ss.getSheetByName('Bitacora de Visitas') || ss.insertSheet('Bitacora de Visitas');
  var headers = [
    'Fecha','Hora','Nombre','Rol','Parcela','Rancho','Contrato',
    'Superficie (ha)','Inventario','Año',
    'Cal. Camino Acceso','Obs. Camino Acceso',
    'Cal. Camino Interno','Obs. Camino Interno',
    'Cal. Falsete','Obs. Falsete',
    'Cal. Lienzo','Obs. Lienzo',
    'Cal. Guarda Raya','Obs. Guarda Raya',
    'Cal. Cartel Ganado','Obs. Cartel Ganado',
    'Cal. Sin Ganado','Obs. Sin Ganado',
    'Cal. Cunetas','Obs. Cunetas',
    'Cal. Labores Culturales','Obs. Labores Culturales',
    'Cal. Desarrollo Planta','Obs. Desarrollo Planta',
    'Cal. Plagas','Obs. Plagas',
    'Cal. Basura/Geo','Obs. Basura/Geo',
    'Cal. Malezas','Obs. Malezas',
    '% Maleza','Tipo Maleza','Altura Maleza',
    'Calificación Global','Semáforo','Acciones Correctivas',
    'Latitud','Longitud','Google Maps'
  ];
  shB.getRange(1, 1, 1, headers.length).setValues([headers]);
  shB.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1A5C2E').setFontColor('#FFFFFF');
  shB.setFrozenRows(1);

  // ── 2. Catalogo Parcelas ──
  var shP = ss.getSheetByName('Catalogo Parcelas') || ss.insertSheet('Catalogo Parcelas');
  shP.clear();
  var pHeaders = ['Rancho','Año','Contrato','HAS','Inventario'];
  var pData = [pHeaders,
    ["2.4",2020,"SAN PEDRO",11,46096],
    ["2.5",2021,"SAN PEDRO",25.6,85960],
    ["52",2020,"RAQUEL CERVANTEZ",5.02,13230],
    ["54",2020,"ALEJANDRO FLORES ACERO (PREDIO 2)",11,34916],
    ["55",2020,"MOISES LOPEZ HERNANDEZ",7.4,26750],
    ["58",2020,"LEONARDO RAYGOZA DELGADO",9.41,31147],
    ["60",2020,"EDUARDO GONZALEZ RUBIO",69,280710],
    ["61",2020,"JONAS LOPEZ FLORES",6.6,18762],
    ["62",2020,"JUAN ZAMBRANO",4,16025],
    ["63",2020,"JOSE SANTOS RUBIO TORRES",4.76,17170],
    ["64",2020,"LORENZA BAÑUELOS",9.5,28477],
    ["65",2020,"ANTONIO RAYGOZA DELGADO",4.5,15892],
    ["66",2020,"JOSE LUIS GONZALEZ GUTIERREZ",8.15,29101],
    ["68",2020,"VICTOR GUERRERO GALLARDO",3.07,9822],
    ["69",2020,"LUIS JORGE RAMOS VIELMAS",18.24,83926],
    ["70",2020,"RIGOBERTO RODRIGUEZ HERRERA",13.17,49484],
    ["72",2020,"RUBEN MANZANO (PREDIO 1)",4.68,18067],
    ["73",2020,"RUBEN MANZANO (PREDIO 2)",2.24,7609],
    ["74",2020,"SALCEDO 2020",4.64,13454],
    ["75",2020,"JUAN GONZALEZ RODRIGUEZ (EL CERRITO)",7.59,24661],
    ["76",2020,"RAMIRO RAMIREZ LOPEZ",10,32310],
    ["77",2021,"MARTINIANO VALLARTA LOPEZ",5.28,17901],
    ["78",2021,"ENEDINO GALLEGOS MOYA (PREDIO 1)",14.24,52383],
    ["79",2021,"ENEDINO GALLEGOS MOYA (PREDIO 2)",8.72,29493],
    ["82",2021,"PRIMITIVO BAÑUELOS ALVAREZ",5.54,17534],
    ["83",2021,"BENITO BAÑUELOS ALVAREZ",3.07,10119],
    ["84",2021,"SUSANA ARELLANO VILLAGRANA",18,63622],
    ["85",2021,"JULIAN SALAS ALTAMIRANO",20.47,66594],
    ["86",2021,"JOSE GUADALUPE MIRAMONTES HERNANDEZ",13.51,46436],
    ["87",2021,"J ISAAC PERALES CERVANTES",7.89,25161],
    ["88",2021,"ALFREDO GUZMAN CERVANTES",4.04,13978],
    ["89",2021,"J JESUS RODRIGUEZ CORTES",3,10549],
    ["90",2021,"AUSENCIO ROJAS PIZ",4.24,17429],
    ["91",2021,"JUAN CARLOS HARO SOLIS",4.09,16148],
    ["92",2021,"QUIRINO HAROS ZUÑIGA",7.79,30536],
    ["93",2021,"FIDEL GONZALEZ VARELA",3.64,11115],
    ["94",2021,"FRANCISCO JAVIER MONRROY MARTINEZ",12,39645],
    ["95",2021,"PATRICIA GARCIA BUENO",17.34,57602],
    ["96",2021,"ADELAIDA CERVANTES MIRAMONTES",12,41231],
    ["97",2021,"OSCAR CERVANTES MIRAMONTES",7.41,26816],
    ["98",2021,"LETICIA CERVANTES MIRAMONTES",2.37,8040],
    ["99",2021,"NORMA ALICIA HAROS SOLIS",7.2,28098],
    ["100",2021,"MARCELINO SOLIS HIDALGO",2.88,10981],
    ["102",2021,"FRANCISCO JAVIER CARRILLO LOPEZ",12,34315],
    ["103",2021,"FRANCISCO HIDALGO ROMERO",3.77,8468],
    ["104",2021,"MARIA DEL CARMEN ROMERO IBARRA (LAS CALABAZAS)",10,45791],
    ["105",2021,"MARTIN SALINAS CASTAÑEDA",4.24,13774],
    ["106",2022,"JOSEFINA SALAZAR RIVAS",7.3,25771],
    ["107",2022,"J. ABEL MARTINEZ RODRIGUEZ",55,171879],
    ["108",2022,"HÉCTOR MANUEL OROZCO DÍAZ",24.19,76005],
    ["109",2022,"JOSE LEOPOLDO LINARES CALDERA (1)",13.5,62251],
    ["110",2022,"JOSE LEOPOLDO LINARES CALDERA (2)",2.8,11287],
    ["112",2022,"JOSE SABINO ESCOBEDO ROJAS",4,17057],
    ["113",2022,"PABLO CARRILLO PEÑA",12,51318],
    ["114",2022,"JOSE CARRILLO CARO",10,49311],
    ["115",2022,"JOSE ENRIQUE ESPARZA MARTINEZ (2)",5,19290],
    ["116",2022,"JOSE ENRIQUE ESPARZA MARTINEZ (1)",4,16260],
    ["117",2022,"MARIA FELICITAS NAVARRO LOPEZ",10.5,29542],
    ["118",2022,"CATALINA BRAVO NUÑEZ",14,68813],
    ["122",2022,"FRANCISCO BAUTISTA CABRALES",20,51464],
    ["124",2023,"ROGELIO RODRIGUEZ PALACIOS",7,20990],
    ["125",2022,"RAFAEL LLAMAS LLAMAS",22,94747],
    ["127",2022,"JUAN MARQUEZ ALVAREZ",5,21689],
    ["128",2022,"DARIO MESTAS CARO",7,26743],
    ["129",2022,"ROSENDO LOPEZ CARRILLO",12.8,46077],
    ["131",2023,"J. ABEL MARTINEZ RODRIGUEZ 2023",25,98039],
    ["133",2023,"SANTIAGO MERCADO RODRIGUEZ 2023",7.64,25668],
    ["133.1",2023,"SANTIAGO MERCADO RODRIGUEZ 2023",7.1,23970],
    ["134",2023,"EMILIA FLORES RAYGOZA 2023",7.88,28712],
    ["135",2023,"ALEJANDRO PEÑA CARRILLO 2023",4.46,15278],
    ["136",2023,"ALFREDO GUZMAN CERVANTES PREDIO II 2023",4.03,15458],
    ["137",2023,"ELIAS OROZCO DIAZ 2023 (EL MIRADOR)",20.9,73040],
    ["138",2023,"EMILIANO ROJAS PIZ 2023",11.3,39252],
    ["139",2023,"EZEQUIEL AMAYA DIAZ 2023",8,36478],
    ["140",2023,"FRANCISCA PIZ SALAZAR 2023",28.5,25000],
    ["141",2023,"RAUDEL MORENO PIZ 2023",2.38,8887],
    ["142",2023,"HERNA LICIA TOPETE 2023",6,21466],
    ["143",2023,"J CARMEN PIZ SALAZAR 2023",10.37,39269],
    ["144",2023,"JOSE AMEZQUITA TORRES 2023",12.14,41380],
    ["145",2023,"JOSE CARMEN PIZ RODRIGUEZ 2023",6,19730],
    ["147",2023,"LEANDRO AMAYA DIAZ I 2023",3.75,12315],
    ["148",2023,"LEANDRO AMAYA DIAZ II 2023",8.6,30101],
    ["149",2023,"LEANDRO PEÑA CARRILLO 2023",8.5,30219],
    ["150",2023,"MARIA SANTOS NUÑEZ 2023",6.8,23439],
    ["151",2023,"MIGUEL PEÑA TAMAYO 2023",6.1,17752],
    ["152",2023,"RAYMUNDO PEREZ I 2023",12.5,43226],
    ["153",2023,"RAYMUNDO PEREZ II 2023",7.4,21159],
    ["154",2023,"RUBEN MORENO PIZ 2023",12,40488],
    ["155",2023,"SUSANA ARELLANO VILLAGRANA 2023",7.3,24981],
    ["156",2023,"OSCAR PEÑA CARRILLO",8,31288],
    ["157",2023,"JOSEFINA VARELA LÓPEZ",3.5,13031],
    ["158",2025,"SALVADOR BARAJAS",7.75,22876],
    ["159",2025,"JUAN MARQUEZ ALVAREZ",5.24,15291],
    ["160",2025,"PARCELA COMUNAL MAGDALENA (MONIGOTES)",42,132381],
    ["161",2025,"MA GUADALUPE CARRILLO (NATALIA CARRILLO)",8.41,28090],
    ["162",2025,"LILIA GUERRERO GALLARDO",7.5,20523],
    ["163",2025,"VICENTE CERVANTES VARGAS",9.6,29398],
    ["164",2025,"ESTEBAN VALLARTA MARQUEZ",3.43,11864],
    ["165",2025,"ANTONIO RUBIO PIZ",2,6442],
    ["166",2025,"DANIEL RUBIO",2,6294],
    ["167",2025,"BERNARDO GARCIA",2.5,8910]
  ];
  shP.getRange(1, 1, pData.length, 5).setValues(pData);
  shP.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#1565C0').setFontColor('#FFFFFF');
  shP.setFrozenRows(1);
  shP.autoResizeColumns(1, 5);

  // ── 3. Catalogo Colaboradores ──
  var shC = ss.getSheetByName('Catalogo Colaboradores') || ss.insertSheet('Catalogo Colaboradores');
  shC.clear();
  var cData = [
    ['Nombre','Puesto'],
    ['MARCOS SANCHEZ','SUPERVISOR'],
    ['JUAN CARLOS CORREA','SUPERVISOR'],
    ['MARIO ZUÑIGA A.','SUPERVISOR'],
    ['MANUEL TAMAYO','SUPERVISOR'],
    ['JESUCRISTIAN GUZMAN','SUPERVISOR'],
    ['EMANUEL RUBIO','SUPERVISOR'],
    ['REYES VEGA','FITOSANITARIO'],
    ['DAVIEL GONZALEZ','JIMAS'],
    ['ALBERTO PARTIDA','JEFE DE AREA'],
    ['ALEJANDRO RAMIREZ','JEFE DE AREA'],
    ['TOMAS CASTAÑEDA','COORDINADOR CULTIVO'],
    ['JORGE LOPEZ','JEFE ADMIN'],
    ['FRANCISCO VANEGAS','GERENTE AGAVE'],
    ['BERNARDO GARCIA','DIRECTOR GENERAL']
  ];
  shC.getRange(1, 1, cData.length, 2).setValues(cData);
  shC.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#2E7D32').setFontColor('#FFFFFF');
  shC.setFrozenRows(1);
  shC.autoResizeColumns(1, 2);

  // Eliminar hoja por defecto si existe
  var def = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 1) {
    try { ss.deleteSheet(def); } catch(e) {}
  }

  SpreadsheetApp.getUi().alert('Setup completado: 3 pestañas creadas con ' + (pData.length - 1) + ' parcelas y ' + (cData.length - 1) + ' colaboradores.');
}

/* ================================================================
   WEB APP — doGet handler
   ================================================================ */
function doGet(e) {
  var action = (e.parameter.action || '').toLowerCase();

  if (action === 'catalogos') {
    return getCatalogos();
  }
  if (action === 'savebitacora') {
    return saveBitacora(e.parameter.payload);
  }

  return jsonResponse({ error: 'Accion no reconocida. Usa ?action=catalogos o ?action=saveBitacora&payload=...' });
}

/* ── GET Catalogos ── */
function getCatalogos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Parcelas
  var shP = ss.getSheetByName('Catalogo Parcelas');
  var dataP = shP.getDataRange().getValues();
  var parcelas = [];
  for (var i = 1; i < dataP.length; i++) {
    var row = dataP[i];
    if (!row[0] && !row[2]) continue;
    parcelas.push({
      r: String(row[0]),
      a: Number(row[1]) || 0,
      c: String(row[2]),
      h: Number(row[3]) || 0,
      i: Number(row[4]) || 0
    });
  }

  // Colaboradores
  var shC = ss.getSheetByName('Catalogo Colaboradores');
  var dataC = shC.getDataRange().getValues();
  var colaboradores = [];
  for (var j = 1; j < dataC.length; j++) {
    var rowC = dataC[j];
    if (!rowC[0]) continue;
    colaboradores.push({
      n: String(rowC[0]),
      r: String(rowC[1])
    });
  }

  return jsonResponse({ parcelas: parcelas, colaboradores: colaboradores });
}

/* ── GET Save Bitacora ── */
function saveBitacora(payloadStr) {
  try {
    var d = JSON.parse(decodeURIComponent(payloadStr));
  } catch (err) {
    return jsonResponse({ ok: false, error: 'JSON invalido: ' + err.message });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Bitacora de Visitas');

  // Fecha y hora
  var fecha = d.fecha ? new Date(d.fecha) : new Date();
  var fechaStr = Utilities.formatDate(fecha, 'America/Mexico_City', 'dd/MM/yyyy');
  var horaStr = Utilities.formatDate(fecha, 'America/Mexico_City', 'HH:mm');

  // 13 puntos (cal + obs = 26 columnas)
  var pts = d.pts || [];
  var puntosArr = [];
  for (var k = 0; k < 13; k++) {
    var p = pts[k] || {};
    puntosArr.push(p.cal || '');
    puntosArr.push(p.obs || '');
  }

  // Maleza extra
  var mal = d.mal || {};

  // Semaforo
  var gc = parseFloat(d.gc);
  var semaforo = isNaN(gc) ? '' : (gc >= 8 ? 'BUENO' : (gc >= 5 ? 'REGULAR' : 'DEFICIENTE'));

  // Geo
  var lat = d.geo ? d.geo.lat : '';
  var lng = d.geo ? d.geo.lng : '';
  var mapsLink = (lat && lng) ? 'https://www.google.com/maps?q=' + lat + ',' + lng : '';

  var row = [
    fechaStr,
    horaStr,
    d.nombre || '',
    d.rol || '',
    d.rancho || '',
    d.contrato || '',
    d.contrato || '',
    d.ha || '',
    d.inv || '',
    d.anio || ''
  ];

  // 26 columnas de puntos
  row = row.concat(puntosArr);

  // Maleza, calificacion, semaforo, acciones, geo
  row = row.concat([
    mal.pct || '',
    mal.tipo || '',
    mal.alt || '',
    d.gc || '',
    semaforo,
    d.acciones || '',
    lat,
    lng,
    mapsLink
  ]);

  sh.appendRow(row);

  return jsonResponse({ ok: true, msg: 'Registro guardado exitosamente' });
}

/* ── Helper ── */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
