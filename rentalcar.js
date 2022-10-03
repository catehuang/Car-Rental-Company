window.onload = init;

var jsonobj;
//var objectarray=[];
var index=0;

function init() {
    var today = new Date();
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var y = today.getFullYear();
    var h = today.getHours();
    var mm = today.getMinutes();

    if (m < 10) {
        m = '0' + m.toString();
    }

    if (d < 10) {
        d = '0' + d.toString();
    }

    if (h < 10) {
        h = '0' + h.toString();
    }

    if (mm < 10) {
        d = '0' + mm.toString();
    }
    document.getElementById("dateField").innerHTML = today;
    loaddata();
}

function loaddata() {
    var xhr=new XMLHttpRequest();

    xhr.onreadystatechange=function()
    {
        if (xhr.readyState==4 && xhr.status== 200) 
        {
            jsonobj=JSON.parse(xhr.responseText);
         }
    }
    xhr.open("GET", "rentalclients.json", true);
    xhr.send();
}

function checknumber(v) {
    var id=v.id;
    var inputvalue = document.getElementById(id).value;
    var min = document.getElementById(id).min;
    var max = document.getElementById(id).max;
    if (inputvalue.value != "") {
        if (parseInt(inputvalue) < parseInt(min)) {
            document.getElementById(id).value = min;
        }
        if (parseInt(inputvalue) > parseInt(max)) {
            document.getElementById(id).value = max;
        }
    }
}

function searchLastName(lastname) {
    var output="" ;
    // clear all fields
    document.getElementById('lastname').value="";
    document.getElementById('firstname').value="";   
    document.getElementById('address').value="";
    document.getElementById('state_prov').value="";   
    document.getElementById('email').value="";   
    document.getElementById('phone').value="";   

    for (var i=0; i<jsonobj.length; i++)
    {
        var obj=jsonobj[i];
        if(obj.last_name.toUpperCase().startsWith(lastname.toUpperCase()))
        {
            output+= "<a class='namebtn' name='" + i + "' onclick='displayClientInformation(this);'>" + obj.last_name + " " + obj.first_name + "</a><br>";
        }
    }
    if (output == "") {
        document.getElementById("displayName").innerHTML="<a class='namebtn' name='none' onclick='displayClientInformation(this);'>No matched result</a><br>";
        document.getElementById("displayClientInformation").style.display='none';
        document.getElementById("displayRentalChoices").style.display='none';
        document.getElementById("displayRentalInformation").style.display='none';
    } else {
        document.getElementById("displayName").innerHTML=output;
    }
}

function displayClientInformation(obj) {
    index=obj.name;

    //document.getElementById('searchkey').value=jsonobj[index].last_name; //fill searched lastname
    //document.getElementById("displayName").innerHTML='';    //clear searching list
    if (index != "none") {
        // fill form
        document.getElementById('lastname').value=jsonobj[index].last_name;    
        document.getElementById('firstname').value=jsonobj[index].first_name;    
        document.getElementById('address').value=jsonobj[index].address;
        document.getElementById('state_prov').value=jsonobj[index].state_prov;
        document.getElementById('email').value=jsonobj[index].email;
        document.getElementById('phone').value=jsonobj[index].phone;    
        
        //document.getElementById("displayClientInformation").style.visibility='visible';
        document.getElementById("displayClientInformation").style.display='block';
        document.getElementById("displayRentalChoices").style.display='block';
        document.getElementById("displayRentalInformation").style.display='none';

        // clear all fields
        var vehicle = document.getElementsByName("vehicle");
        for(var i=0;i<vehicle.length;i++) {
            vehicle[i].checked = false;
        }
        document.getElementById("rack").checked=false;
        document.getElementById("gps").checked=false;
        document.getElementById("childseat").checked=false;
        document.getElementById("days").value='';
        document.getElementById("rentalInformation").innerHTML = "";
    }        
}



function displayRentalInformation() {
    var total=0;
    var days=parseInt(document.getElementById("days").value);
    var output="<tr colspan='2'><th>Client Information<th></tr>" + 
                    "<tr><td>Last Name</td><td>" + document.getElementById('lastname').value + "</td></tr>" +
                     "<tr><td>First Name</td><td>" + document.getElementById('firstname').value + "</td></tr>" +
                     "<tr><td>Address</td><td>" + document.getElementById('address').value + "</td></tr>" +
                     "<tr><td>State/Prov</td><td>" + document.getElementById('state_prov').value + "</td></tr>" +
                     "<tr><td>Email</td><td>" + document.getElementById('email').value + "</td></tr>" +
                     "<tr><td>Phone</td><td>" + document.getElementById('phone').value + "</td></tr>" ;

    var vehicle=document.querySelector("input[name=vehicle]:checked").value;
    output+="<tr colspan='2'><th>Rental Information</th></td>";
    if(vehicle == "compact") {
        output+="<tr><td>Compact</td><td>$15/day</td></tr>";
        total+=15 *days;
    } else if (vehicle == "midsize") {
        output+="<tr><td>Mid-size</td><td>$20/day</td></tr>";
        total+=20 *days;
    } else if (vehicle == "luxury") {
        output+="<tr><td>Luxury</td><td>$35/day</td></tr>";
        total+=35 *days;
    } else {
        output+="<tr><td>Van/Truck</td><td>$40/day</td></tr>";
        total+=40 *days;
    }

    if (document.querySelector("input[name=rack]:checked")) {
        output+="<tr><td>Roof Rack or Bicycle Rack</td><td>extra $5/day</td></tr>";
        total+=5 *days;
    } 

    if (document.querySelector("input[name=gps]:checked")) {
        output+="<tr><td>GPS</td><td>extra $10</td></tr>";
        total+=10;
    } 

    if (document.querySelector("input[name=childseat]:checked")) {
        output+="<tr><td>Child Seat</td><td>free</td></tr>";
    } 

    if (days > 1) {
        output+="<tr><td># of Days</td><td>" + days + " Days</td></tr>";
    } else {
        output+="<tr><td># of Days</td><td>" + days + " Day</td></tr>";
    }
    
    output+="<tr class='highlight'><td>Total Cost</td><td>$ " + total + "</td></tr>";

    document.getElementById("displayRentalInformation").style.display='block';               
    document.getElementById("rentalInformation").innerHTML = output;
}