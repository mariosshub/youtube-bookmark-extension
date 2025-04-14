const getCurrentTab = async() => {
  let queryOptions = { active: true, currentWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const isEmpty = (value) => {
  return (value == null || (typeof value === "string" && value.trim().length === 0));
}

const getTime = t => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().split('T')[1].substring(8,0)
}

const logRuntimeConnectionError = (error) => {
  if(error.includes('Could not establish connection')){
    alert('An error occured try to reload the page')
    console.log(error);
    return true;
  }
  else
    return false;
}


export {getCurrentTab, isEmpty, getTime, logRuntimeConnectionError}