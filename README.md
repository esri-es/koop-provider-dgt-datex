# koop-provider-dgt-datex

This is a [KoopJS provider](https://koopjs.github.io/docs/available-plugins/providers) to extract, transform and load cameras from [the service] of the [General Direction of Traffic of Spain](http://www.dgt.es/es/) as an ArcGIS Feature Service.

![Screenshot](https://user-images.githubusercontent.com/826965/95004997-09878400-05f3-11eb-9379-595dba91369c.png)

## Run standalone provider

Just clone this repository, install the dependecies and run `koop serve`

```
$ git clone git@github.com:esri-es/koop-provider-dgt-datex.git
$ npm install
$ koop serve
```

Then you are ready to go: `http://localhost:8080/koop-provider-dgt-datex/rest/services/FeatureServer/0/query`

You can test it using the [FeatureLayer sample code](https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=layers-featurelayer) replacing the `url` (without the `/query`) property at line 11.

> To be able to run it on the ArcGIS Map Viewer you will need to serve it over HTTPs. For development environments you can use [ngrok](https://ngrok.com/). Once installed, run: `ngrok http 127.0.0.1:8080` and open the domain it provides + `/koop-provider-dgt-datex/rest/services/FeatureServer/0/query`.

## Install this provider in a new Koop hasOwnProperty

You can follow the same steps as describe in [this tutorial](https://gist.github.com/hhkaos/d842a8a30626e0cf48e3834017879f42#demo-2-install-and-secure-a-pass-through-provider). Just replace de plugin name:

```
koop new app demo-app
cd demo-app

koop add provider koop-provider-dgt-datex
koop serve
```

## Any questions?

Feel free to ask using the [issues](https://github.com/esri-es/koop-provider-dgt-datex/issues).
