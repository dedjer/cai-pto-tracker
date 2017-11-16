$(function(){

    // Recalculate if dropdown value changes
    $('#ptoDaysSelection').change(function() {
        calculatePTO()
    });

    calculatePTO();
});

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




