import axios from 'axios';

export const pdfService = async (pdfJson, snapshotModel, gearSelected ) => {

  await axios.post('', {
    'pdfJson': JSON.stringify(pdfJson),
    snapshotModel,
    gearSelected
  })
    .then((res) => {
      return  true;
    }).catch((error) => {
      return false;
    });
};




