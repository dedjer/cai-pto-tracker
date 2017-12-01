$(function(){

    // Recalculate if dropdown value changes
    $('#ptoDaysSelection').change(function() {
        calculatePTO();
        getPTODaysBadge();
    });

    getAnniversaryDate();
    calculatePTO();
    getPTODaysBadge();
});


function getAnniversaryDate() {
    chrome.storage.sync.get('anniversaryDate', function(items) {
        if(items.anniversaryDate) {
            var currentDate = new Date();
            var anniversaryDate = new Date(items.anniversaryDate);
            var yearsOfService = parseInt(currentDate.getFullYear() - anniversaryDate.getFullYear());

            //Default dropdown using anniversary date
            switch(true) {
                case (yearsOfService >= 0 && yearsOfService <= 5):
                    $('#ptoDaysSelection').val("24").change();
                    break;
                case (yearsOfService >= 6 && yearsOfService <= 9):
                    $('#ptoDaysSelection').val("27").change();
                    break;
                case (yearsOfService >= 10 && yearsOfService <= 19):
                    $('#ptoDaysSelection').val("30").change();
                    break;
                case (yearsOfService >= 20):
                    $('#ptoDaysSelection').val("33").change();
                    break;
            }
        }
    });
}

function calculatePTO() {

    // Get remaining hours from chrome storage
    chrome.storage.sync.get('rh', function(items) {

        if(items.rh) {
            $('#lblPTORemainingHours').text(items.rh);
            var ptoRemainingHours = items.rh;

            var ptoDaysPerYear = parseFloat($('#ptoDaysSelection').find(":selected").val());
            var ptoDaysEarnedPerMonth = ptoDaysPerYear / 12;

            var date = new Date();
            var currentMonth = date.getMonth()+1; //Month is zero based

            var ptoDaysEarnedToDate = parseFloat(currentMonth * ptoDaysEarnedPerMonth);
            var ptoHoursEarnedToDate = parseFloat(ptoDaysEarnedToDate * 8);

            var ptoHoursTakenToDate = parseFloat(ptoHoursEarnedToDate - ptoRemainingHours);

            var ptoDaysTakenToDate = parseFloat(ptoHoursTakenToDate / 8);
            var ptoRemainingDays = parseFloat(ptoDaysPerYear - ptoDaysTakenToDate);

            //noinspection JSJQueryEfficiency
            if(ptoRemainingDays>0){
                $('#lblPTORemainingDays').css({"color":"green", "font-weight":"bold", "font-size":"medium"});
            }
            else if (ptoRemainingDays<0)
            {
                $('#lblPTORemainingDays').css({"color":"red", "font-weight":"bold", "font-size":"medium"});
            }
            else
            {
                $('#lblPTORemainingDays').css("color", "black");
            }

            //noinspection JSJQueryEfficiency
            $('#lblPTORemainingDays').text(ptoRemainingDays);

            chrome.storage.sync.set({'ptoRemainingDays': ptoRemainingDays});

            /* Logging
            console.log('ptoDaysPerYear: ' + ptoDaysPerYear);
            console.log('ptoDaysEarnedPerMonth: ' + ptoDaysEarnedPerMonth);

            console.log('date: ' + date);
            console.log('currentMonth: ' + currentMonth);

            console.log('ptoDaysEarnedToDate: ' + ptoDaysEarnedToDate);
            console.log('ptoHoursEarnedToDate: ' + ptoHoursEarnedToDate);

            console.log('ptoRemainingHours: ' + ptoRemainingHours);
            console.log('ptoHoursTakenToDate: ' + ptoHoursTakenToDate);

            console.log('ptoDaysTakenToDate: ' + ptoDaysTakenToDate);
            console.log('ptoRemainingDays: ' + ptoRemainingDays);

            console.log($('#lblPTORemainingHours').text())
            console.log($('#lblPTORemainingDays').text())
            */
        }
        else{
            $('#lblPTORemainingHours').text("Log into PeopleSoft Time Tracking to get your Remaining Hours");
        }

        //chrome.storage.sync.clear();
    });

}

function getPTODaysBadge(){
    chrome.storage.sync.get('badge', function(items) {
        if(items.badge){
            chrome.browserAction.setBadgeText({"text" : $('#lblPTORemainingDays').text()});
        }
    });

}


