// Get remainging hours from PeopleSoft
if(document.getElementById("DERIVED_TL_COMP_END_BAL$0")) {
    chrome.storage.sync.set({'rh': document.getElementById("DERIVED_TL_COMP_END_BAL$0").innerHTML});
    console.log("DERIVED_TL_COMP_END_BAL$0 = " + document.getElementById("DERIVED_TL_COMP_END_BAL$0").innerHTML);
}
