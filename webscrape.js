const rp = require('request-promise');
const _ = require('lodash');
const url = 'http://api.ultralingua.com/api/conjugations/por/';

function getConjugation(verb) {
  return rp(url + verb)
    .then(function(conjugations){
     const tenseSet = new Set();
     const languageMap = _.reduce(JSON.parse(conjugations), function(map, val) {
      const partOfSpeech = val.partofspeech;
      const number = partOfSpeech.number; // singular | plural
      const tense = partOfSpeech.tense;   // 
      const person = partOfSpeech.person; // first, second, third
      
      if (!map[tense]) {
        map[tense] = {};
        tenseSet.add(tense);
      }
      
      if (map[tense][number]) {
        const mapNumber = map[tense][number];
        mapNumber[person] = val.surfaceform;
      } else {
        map[tense][number || 'default'] = {
          [person || 'default']: val.surfaceform
        };
      }
            
      return map;
     }, {})

     return {
       tenses: Array.from(tenseSet),
       data: languageMap
     }
    })
    .catch(function(err){
      console.log('An error ocurred while conjugating the verb: ',verb,  err);
      return {
        tenses: [],
        data: {}
      }
    });
}

module.exports = getConjugation;