// const cache = require('@koopjs/cache-redis')
// koop.register(cache)

function Model (koop) {}

// each model should have a getData() function to fetch the geo data
// and format it into a geojson
Model.prototype.getData = function (req, callback) {

    const parse = require('datex2-linker-api'),
        { params: { host, id } } = req;

    let parserFnc,
        source,
        baseuri = "dgtCamera",
        sourceOptions = {};
    // console.log("Host: ",host)
    // console.log("ID: ",id)
    if(host === "cameras"){
        source = "http://infocar.dgt.es/datex2/dgt/CCTVSiteTablePublication/all/content.xml"
        parserFnc = camerasParser;
    }else if(host === "cabin_radars"){
        source = "http://infocar.dgt.es/datex2/dgt/PredefinedLocationsPublication/radares/content.xml";
        parserFnc = cabinRadarsParser;
    }else if(host === "segment_radars"){
        source = "http://infocar.dgt.es/datex2/dgt/PredefinedLocationsPublication/radares/content.xml";
        parserFnc = segmentRadarsParser;
    }else{
        console.log(`Error: parameter '${host}' no recognized (valid: cameras, cabin_radars, segment_radars)`);
        return -1;
    }

    parse(source, baseuri, sourceOptions).then(res=>{
        const geojson = parserFnc(res, source);
        callback(null, geojson)
    }).catch(err=>{
        console.error(err); // 'error while parsing xml. ...'
    });

}

function cabinRadarsParser(res, source){
    // cache.retrieve('radares', {}, (err, geojson) => {
    //     if(!err){
    //         return geojson;
    //     }else{
            let i = 1;
            const geojson = {
                type: 'FeatureCollection',
                features: []
            };

            //"dgtCamera#GUID_Inventario_CabinasCinemometro"
            const CabinasCinemometro = res["@graph"]
                .d2LogicalModel
                .payloadPublication
                .predefinedLocationSet[0];

            geojson.features = CabinasCinemometro.predefinedLocation.map(el => {
                return {
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                          parseFloat(el.predefinedLocation.tpegpointLocation.point.pointCoordinates.longitude),
                          parseFloat(el.predefinedLocation.tpegpointLocation.point.pointCoordinates.latitude)
                      ]
                    },
                    "properties": {
                        "OBJECTID": i++,
                        "administrativeArea": el.predefinedLocation.referencePoint.administrativeArea.value,
                        "roadNumber": el.predefinedLocation.referencePoint.roadNumber,
                        "directionRelative": el.predefinedLocation.referencePoint.directionRelative,
                        "referencePointDistance": parseFloat(el.predefinedLocation.referencePoint.referencePointDistance),
                        "directionNamed": el.predefinedLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.directionNamed,
                        "provinceINEIdentifier": parseInt(el.predefinedLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.provinceINEIdentifier),
                        "roadIdentifier": parseInt(el.predefinedLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.roadIdentifier),
        				"segmentIdentifier": parseInt(el.predefinedLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.segmentIdentifier),
        				"singularity": el.predefinedLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.singularity,
                    }
                };
            });

            geojson.metadata = {
                title: 'DGT Cabin Radars Provider',
                name: 'Camera layer',
                idField: 'OBJECTID',
                description: `Generated from ${source}`
            };

            // const options = {
            //   ttl: 600000
            // };
            //
            // cache.insert('radares', geojson, options, err => {
            //   // This function will call back with an error if there is already data in the cache using the same key
            //   console.log("Error adding data to cache");
            // })

            return geojson;
    //     }
    // });
}


function segmentRadarsParser(res, source){
    // cache.retrieve('radares', {}, (err, geojson) => {
    //     if(!err){
    //         return geojson;
    //     }else{
            let i = 1;
            const geojson = {
                type: 'FeatureCollection',
                features: []
            };

            //"dgtCamera#GUID_Inventario_CinemometrosVelocidadMedia"
            const CinemometrosVelocidadMedia = res["@graph"]
                .d2LogicalModel
                .payloadPublication
                .predefinedLocationSet[1];

            geojson.features = CinemometrosVelocidadMedia.predefinedLocation.map(el => {
                return {
                    "type": "Feature",
                    "geometry": {
                      "type": "LineString",
                      "coordinates": [
                          [
                              parseFloat(el.predefinedLocation.tpeglinearLocation.from.pointCoordinates.longitude),
                              parseFloat(el.predefinedLocation.tpeglinearLocation.from.pointCoordinates.latitude)
                          ],
                          [
                              parseFloat(el.predefinedLocation.tpeglinearLocation.to.pointCoordinates.longitude),
                              parseFloat(el.predefinedLocation.tpeglinearLocation.to.pointCoordinates.latitude)
                          ]
                      ]
                    },
                    "properties": {
                        "OBJECTID": i++,
                        "primary_administrativeArea": el.predefinedLocation.referencePointLinear.referencePointPrimaryLocation.referencePoint.administrativeArea.value,
                        "primary_roadNumber": el.predefinedLocation.referencePointLinear.referencePointPrimaryLocation.referencePoint.roadNumber,
                        "primary_directionRelative": el.predefinedLocation.referencePointLinear.referencePointPrimaryLocation.referencePoint.directionRelative,
                        "primary_referencePointDistance": parseFloat(el.predefinedLocation.referencePointLinear.referencePointPrimaryLocation.referencePoint.referencePointDistance),
                        "primary_directionNamed": el.predefinedLocation.referencePointLinear.referencePointPrimaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.directionNamed,
                        "primary_provinceINEIdentifier": parseInt(el.predefinedLocation.referencePointLinear.referencePointPrimaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.provinceINEIdentifier),
                        "primary_roadIdentifier": parseInt(el.predefinedLocation.referencePointLinear.referencePointPrimaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.roadIdentifier),
                        "primary_segmentIdentifier": parseInt(el.predefinedLocation.referencePointLinear.referencePointPrimaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.segmentIdentifier),
                        "primary_singularity": el.predefinedLocation.referencePointLinear.referencePointPrimaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.singularity,

                        "secondary_administrativeArea": el.predefinedLocation.referencePointLinear.referencePointSecondaryLocation.referencePoint.administrativeArea.value,
                        "secondary_roadNumber": el.predefinedLocation.referencePointLinear.referencePointSecondaryLocation.referencePoint.roadNumber,
                        "secondary_directionRelative": el.predefinedLocation.referencePointLinear.referencePointSecondaryLocation.referencePoint.directionRelative,
                        "secondary_referencePointDistance": parseFloat(el.predefinedLocation.referencePointLinear.referencePointSecondaryLocation.referencePoint.referencePointDistance),
                        "secondary_directionNamed": el.predefinedLocation.referencePointLinear.referencePointSecondaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.directionNamed,
                        "secondary_provinceINEIdentifier": parseInt(el.predefinedLocation.referencePointLinear.referencePointSecondaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.provinceINEIdentifier),
                        "secondary_roadIdentifier": parseInt(el.predefinedLocation.referencePointLinear.referencePointSecondaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.roadIdentifier),
                        "secondary_segmentIdentifier": parseInt(el.predefinedLocation.referencePointLinear.referencePointSecondaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.segmentIdentifier),
                        "secondary_singularity": el.predefinedLocation.referencePointLinear.referencePointSecondaryLocation.referencePoint.referencePointExtension.ExtendedReferencePoint.singularity,
                    }
                };
            });


            geojson.metadata = {
                title: 'DGT Radars Provider',
                name: 'Camera layer',
                idField: 'OBJECTID',
                description: `Generated from ${source}`
            };

            // const options = {
            //   ttl: 600000
            // };
            //
            // cache.insert('radares', geojson, options, err => {
            //   // This function will call back with an error if there is already data in the cache using the same key
            //   console.log("Error adding data to cache");
            // })

            return geojson;
    //     }
    // });
}

function camerasParser(res, source){
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
    };

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
    return geojson;
}

module.exports = Model
