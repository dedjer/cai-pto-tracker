$(function() {
    $('#save').click( function()
    {
        if($('#datepicker').datepicker("getDate")) {
            var d = $('#datepicker').datepicker("getDate"),
                month = d.getMonth() + 1,
                day = d.getDate(),
                year = d.getFullYear();
            chrome.storage.sync.set({'anniversaryDate': [month,day,year].join('/')});
        }
        else {
            chrome.storage.sync.set({'anniversaryDate': null});
        }
        chrome.storage.sync.set({'badge': $("#badge").is(':checked')});
        getData();
    });

    $('#resetData').click( function()
    {
        $('#datepicker').datepicker("setDate", null);
        $('#badge').prop('checked', false);
        chrome.storage.sync.clear();
        chrome.browserAction.setBadgeText({"text": ""});
    });

    $('#datepicker').datepicker();

    getData();

});

function getData() {
    chrome.storage.sync.get('anniversaryDate', function(items) {
        if(items.anniversaryDate){
            $('#datepicker').datepicker("setDate", new Date(items.anniversaryDate));
        }
    });

    chrome.storage.sync.get('badge', function(items) {
        if(items.badge) {
            $('#badge').prop('checked', items.badge);
            calculatePTO();
        }
        else {
            //clear out the badge if user doesn't want to see it
            $('#badge').prop('checked', items.badge);
            chrome.browserAction.setBadgeText({"text": ""});
        }
    });
}

function calculatePTO() {

    // Get remaining hours from chrome storage
    chrome.storage.sync.get('rh', function(items) {

        if(items.rh) {
            var ptoRemainingHours = items.rh;
            var ptoDaysPerYear = 0;

            var currentDate = new Date();
            var anniversaryDate = $('#datepicker').datepicker("getDate");
            var yearsOfService = parseInt(currentDate.getFullYear() - anniversaryDate.getFullYear());

            //Default dropdown using anniversary date
            switch(true) {
                case (yearsOfService >= 0 && yearsOfService <= 5):
                    ptoDaysPerYear = 24;
                    break;
                case (yearsOfService >= 6 && yearsOfService <= 9):
                    ptoDaysPerYear = 27;
                    break;
                case (yearsOfService >= 10 && yearsOfService <= 19):
                    ptoDaysPerYear = 30;
                    break;
                case (yearsOfService >= 20):
                    ptoDaysPerYear = 33;
                    break;
            }

            var ptoDaysEarnedPerMonth = ptoDaysPerYear / 12;

            var date = new Date();
            var currentMonth = date.getMonth()+1; //Month is zero based

            var ptoDaysEarnedToDate = parseFloat(currentMonth * ptoDaysEarnedPerMonth);
            var ptoHoursEarnedToDate = parseFloat(ptoDaysEarnedToDate * 8);

            var ptoHoursTakenToDate = parseFloat(ptoHoursEarnedToDate - ptoRemainingHours);

            var ptoDaysTakenToDate = parseFloat(ptoHoursTakenToDate / 8);
            var ptoRemainingDays = parseFloat(ptoDaysPerYear - ptoDaysTakenToDate);

            chrome.browserAction.setBadgeText({"text" : ptoRemainingDays.toString()});
            chrome.storage.sync.set({'ptoRemainingDays': ptoRemainingDays});
        }
        else {
            $('#lblPTORemainingHours').text("Log into PeopleSoft Time Tracking to get your Remaining Hours");
        }
    });

}
