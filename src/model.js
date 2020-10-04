function Model (koop) {}

// each model should have a getData() function to fetch the geo data
// and format it into a geojson
Model.prototype.getData = function (req, callback) {

    const parse = require('datex2-linker-api');

    let source = "http://infocar.dgt.es/datex2/dgt/CCTVSiteTablePublication/all/content.xml"
    let baseuri ="dgtCamera"
    let sourceOptions = {};

    parse(source, baseuri, sourceOptions).then(res=>{
        res = res["@graph"]
        .d2LogicalModel
        .payloadPublication
        .genericPublicationExtension
        .cctvSiteTablePublication
        .cctvCameraList
        .cctvCameraMetadataRecord;

        const geojson = {
            type: 'FeatureCollection',
            features: []
        }

        let i = 1;
        geojson.features = res.map(el => {
            return {
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [
                    parseFloat(el.cctvCameraLocation.locationForDisplay.longitude),
                    parseFloat(el.cctvCameraLocation.locationForDisplay.latitude)
                ]
              },
              "properties": {
                "OBJECTID": parseInt(el.cctvCameraSerialNumber),
                "CameraIdentification": el.cctvCameraIdentification,
                "cameraRecordVersionTime": (new Date(el.cctvCameraRecordVersionTime)).getTime(),
                "cameraSerialNumber": parseInt(el.cctvCameraSerialNumber),
                "cameraType": el.cctvCameraType,
                "stillImageFormat": el.cctvStillImageService.cctvStillImageFormat,
                "stillImageServiceLevel": parseInt(el.cctvStillImageService.cctvStillImageServiceLevel),
                "urlLinkAddress": el.cctvStillImageService.stillImageUrl.urlLinkAddress,
                "version": parseInt(el.version)
              }
            }
        });

        geojson.metadata = {
            title: 'DGT Camera Provider',
            name: 'Camera layer',
            idField: 'OBJECTID',
            description: `Generated from ${source}`,
            fields: [
                { name: 'OBJECTID', type: 'Integer'},
                { name: 'CameraIdentification', type: 'String', alias: 'Camera Identifcation', length: 255},
                { name: 'cameraRecordVersionTime', type: 'Date', alias: 'Camera Record Version Time'},
                { name: 'cameraSerialNumber', type: 'Integer', alias: 'Camera Serial Number'},
                { name: 'cameraType', type: 'String', alias: 'Camera Type', length: 255},
                { name: 'stillImageFormat', type: 'String', alias: 'Image Format', length: 255},
                { name: 'stillImageServiceLevel', type: 'Integer', alias: 'Image Service Level'},
                { name: 'urlLinkAddress', type: 'String', alias: 'Image URL', length: 255},
                { name: 'version', type: 'Integer', alias: 'Version'}
            ]
        }

        // the callback function expects a geojson for its second parameter
        callback(null, geojson)
    }).catch(err=>{
        console.error(err); // 'error while parsing xml. ...'
    });
}

module.exports = Model
