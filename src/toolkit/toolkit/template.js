import player from './player';
import enum_inputs from '../../config/enum'
export const prepTemplate = async (selectedSubcategory) => {
  if (!window.threekitApi) return [];
  let attributes = await player.compileAttributesData();
  const visibleAttributes = player.getVisibleAttributes();
  let sections = [];
  const metadata = await player.getMetadata();
  const catalogName = await player.getCatalogName();
  let newMetadata = {};
  let subCatalogMetadata = {};
  let inputs = {};
  let firstLevels = [];
  let mainAttributes = [];
  let exist = false;
  let template = [
    {
      label: catalogName,
      sections: [
        {
          label: '',
          sections: [
          ],
        },
      ]
    }
  ];

  firstLevels = JSON.parse(localStorage.getItem('catalog-first-levels')) === null ? [] : JSON.parse(localStorage.getItem('catalog-first-levels'));
  mainAttributes = JSON.parse(localStorage.getItem('catalog-main-attribute')) === null ? new Object() : JSON.parse(localStorage.getItem('catalog-main-attribute'));

  if (firstLevels.length === 0) {
    var levels = Object.keys(attributes);
    for (var level in levels) {
      firstLevels.push({ firstLevel: levels[level], values: [levels[level]] })
      mainAttributes[levels[level]]='';
    }
    for (var attribute in attributes) {
      for (var level in firstLevels) {
        if (firstLevels[level].firstLevel === attributes[attribute].label) {
          attributes[attribute].values.map((value, index) => {
            firstLevels[level].values.push(value.value)
          });
        }
      }
    }
    localStorage.setItem('catalog-first-levels', JSON.stringify(firstLevels));
    localStorage.setItem('catalog-main-attribute', JSON.stringify(mainAttributes));
  }

  const prepInput = (input) => {
    if (typeof input.data === 'object') return input;
    if (input.data === 'tk-platform') {
      if (!attributes[input.attribute]) return null;
      return {
        ...input,
        data: { options: attributes[input.attribute].values },
      };
    }
  };
  const prepSections = (sections) =>
    sections.reduce((output, section) => {
      let updatedSection = { ...section };
      if (section.inputs && section.inputs.length > 0) {
        updatedSection.inputs = section.inputs
          .map((inputId) => prepInput({ id: inputId, ...inputs[inputId] }))
          .filter((input) => !(input === null));
      }
      if (section.sections && section.sections.length > 0) {
        updatedSection.sections = prepSections(section.sections, inputs);
      }
      output.push(updatedSection);
      return output;
    }, []);

  if (selectedSubcategory) {
    const firstLevelAttributes = attributes;

    attributes = JSON.parse(localStorage.getItem('catalog-attributes'));
    sections = JSON.parse(localStorage.getItem('catalog-sections'));
    inputs = JSON.parse(localStorage.getItem('catalog-inputs'));

    var keys = Object.keys(firstLevelAttributes);
    // Removing Disabled Attributes
    for (var key in attributes) {
      if (!keys.includes(key) && attributes[key].level === 0) {
        delete attributes[key];
      }
    }

    // Adding Enabled Attributes
    keys = Object.keys(attributes);
    for (var key in firstLevelAttributes) {
      if (!keys.includes(key)) {
        attributes[key] = firstLevelAttributes[key];
      }
    }

    //Adding First Level 
    const getFirstLevel = (attribute, subCatalogAttributes) => {
      for (var level in firstLevels) {
        let existAttribute = firstLevels[level].values.find(value => value === attribute)
        if (existAttribute !== undefined) {
          subCatalogAttributes[attribute].values.map((value, index) => {
            firstLevels[level].values.push(value.value)
          });
          localStorage.setItem('catalog-first-levels', JSON.stringify(firstLevels));
          return firstLevels[level].firstLevel
        }
      }
    };

    return await window.threekitApi.api.scene.fetch(selectedSubcategory.assetId).then(async () => {
      const subCatalog = window.threekitApi.api.scene.get({ id: selectedSubcategory.assetId });
      return await player.compileAttributesData({}, subCatalog.configurator.attributes).then(async (result) => {
        const subCatalogAttributes = result;
        attributes[selectedSubcategory.value] = subCatalogAttributes[selectedSubcategory.value];
        subCatalogMetadata = await player.getMetadata(selectedSubcategory.assetId);
        subCatalogMetadata = subCatalogMetadata.find(metadataItem => metadataItem.name === "_UI_displayAttributesAs") ? JSON.parse(subCatalogMetadata.find(metadataItem => metadataItem.name === "_UI_displayAttributesAs")['defaultValue']) : null;
        if (subCatalogAttributes && Object.keys(subCatalogAttributes).length !== 0) {
          inputs[selectedSubcategory.value] = {
            label: selectedSubcategory.value,
            attribute: selectedSubcategory.value,
            type: subCatalogMetadata !== null && subCatalogMetadata[selectedSubcategory.value]?.type !== undefined ? enum_inputs[subCatalogMetadata[selectedSubcategory.value].type] : enum_inputs['default'],
            data: 'tk-platform',
            cssClass: 'active',
            parent: selectedSubcategory.parent,
            options: subCatalogMetadata !== null && subCatalogMetadata[selectedSubcategory.value]?.options !== undefined ? subCatalogMetadata[selectedSubcategory.value].options : {},
            firsrLevel: getFirstLevel(selectedSubcategory.value, subCatalogAttributes)
          }

          let subCategoryAdded = false;
          sections.map((section, index) => {
            if (section.inputs.find(input => input === selectedSubcategory.parent) && !subCategoryAdded) {
              const parentIndex = section.inputs.indexOf(selectedSubcategory.parent);
              if (parentIndex !== -1 && section.inputs.length > 1 && parentIndex !== (section.inputs.length - 1)) {
                section.inputs.length = parentIndex + 1;
              }
              section.inputs.push(selectedSubcategory.value);
              subCategoryAdded = true;
            }
          });
        }
        template[0].sections[0].sections = sections;

        localStorage.setItem('catalog-sections', JSON.stringify(template[0].sections[0].sections));
        localStorage.setItem('catalog-inputs', JSON.stringify(inputs));
        localStorage.setItem('catalog-attributes', JSON.stringify(attributes));
        return prepSections(template);
      });
    });
  } else {
    newMetadata = metadata.find(metadataItem => metadataItem.name === "_UI_displayAttributesAs") ? JSON.parse(metadata.find(metadataItem => metadataItem.name === "_UI_displayAttributesAs")['defaultValue']) : null;
    for (var keyNameAttributes in attributes) {
      exist = false;
      for (var keyNameMetadata in newMetadata) {
        if (keyNameAttributes === keyNameMetadata) {
          exist = true;
        }
      }
      if (inputs[keyNameAttributes] === undefined) {
        inputs[keyNameAttributes] = {
          label: keyNameAttributes,
          attribute: keyNameAttributes,
          type: exist ? enum_inputs[newMetadata[keyNameAttributes].type] : attributes[keyNameAttributes].values.length > 2 ? enum_inputs.default : enum_inputs.button,
          data: 'tk-platform',
          cssClass: 'active',
          options: exist ? newMetadata[keyNameAttributes].options : {},
          parent: '',
          firsrLevel: ''
        }
      }
    }

    for (var keyInputs in inputs) {
      template[0].sections[0].sections.push({
        label: inputs[keyInputs].label,
        inputs: [inputs[keyInputs].attribute],
      })
    }
    localStorage.setItem('catalog-sections', JSON.stringify(template[0].sections[0].sections));
    localStorage.setItem('catalog-inputs', JSON.stringify(inputs));
    localStorage.setItem('catalog-attributes', JSON.stringify(attributes));
    return prepSections(template);
  }
};
export default { prepTemplate };