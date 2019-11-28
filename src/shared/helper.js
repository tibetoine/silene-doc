const accentMap = {
  'à': 'a', 'á': 'a', 'ê': 'e', 'ë': 'e', 'é': 'e', 'è': 'e', 'î': 'i', 'ï': 'i', 'í': 'i', 'ó': 'o', 'ú': 'u'
}

function removeAccent (s) {
  if (!s) { return '' }
  var ret = ''
  for (var i = 0; i < s.length; i++) {
    ret += accentMap[s.charAt(i)] || s.charAt(i)
  }
  return ret
}

/**
 * Permet de filtrer dans un select de résidences.
 * @param {*} item 
 * @param {*} queryText 
 */
function filterResidence(item, queryText) {
  let filtered = false
  
  /* Si ça correspond à l'ID de résidence */
  if (
    removeAccent(item.residenceId.toLowerCase()).indexOf(
      removeAccent(queryText.toLowerCase()) 
    )  > -1
  ) {
    filtered = true
  }

  /* Si ça correspond au nom de résidence*/
  if (
    removeAccent(item.residenceName.toLowerCase()).indexOf(
      removeAccent(queryText.toLowerCase())
    ) > -1
  ) {
    filtered = true
  }
  return filtered;
}

export {removeAccent, filterResidence}
