# LiveArt schemas

LiveArt provides a number of [JSON Schema](https://json-schema.org/) files describing config files structure and services request and response payloads.

## Config schemas

1. [config.json](schema/model/config/Config.schema.json)
1. [colorsList.json](schema/model/config/ColorsList.schema.json)
1. [fontsList.json](schema/model/config/FontsList.schema.json)
1. [graphicsCatalog.json](schema/model/config/GraphicsCatalog.schema.json)
1. [productsCatalog.json](schema/model/config/ProductsCatalog.schema.json)
1. [textEffectsList.json](schema/model/config/TextEffectsList.schema.json)

## Services schemas

>Note: Request schemas are only provided for the services that require a POST request.

1. Save Design service: [request](schema/model/service/design/SaveDesignRequest.schema.json), [response](Release/schema/model/service/design/SaveDesignResponse.schema.json).
1. Load Design service: [response](Release/schema/model/service/design/DesignDataObject.schema.json).
1. Get Quote service: [request](schema/model/service/quote/GetQuoteRequest.schema.json), [response](schema/model/service/quote/GetQuoteResponse.schema.json).
1. Get Templates service:  [response](schema/model/config/TemplatesList.schema.json).
1. Save Template service: [request](schema/model/service/design/SaveDesignRequest.schema.json), [response](schema/model/service/design/SaveTemplateResponse.schema.json).
1. Generate Visuals service: [response](schema/model/service/design/GenerateVisualsResponse.schema.json).