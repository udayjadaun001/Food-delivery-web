//  list of orders
var ordersList = [];

// function to generate a random id
function makeId() {
    return 'ORD-' + Math.floor(Math.random() * 9000 + 1000);
}

// add order
function addOrder(resName, count, paidStatus, dist) {

    // Create the order object
    var newOrder = {
        orderId: makeId(),
        restaurantName: resName,
        itemCount: Number(count),
        isPaid: paidStatus,
        deliveryDistance: Number(dist)
    };

    // Save to list
    ordersList.push(newOrder);

    // clear the form after input..
    document.getElementById('rName').value = "";
    document.getElementById('iCount').value = "";
    document.getElementById('dDist').value = "";
    document.getElementById('isPaid').checked = false;

    // update the table to show the new order
    renderOrders(ordersList);
}




// view ORDERS 

function renderOrders(list) {
    var tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = "";

    // loop  given list
    for (var i = 0; i < list.length; i++) {
        var order = list[i];

        //  new row
        var row = document.createElement("tr");

        // Determine  Paid/Unpaid
        var statusText = "Unpaid";
        if (order.isPaid == true) {
            statusText = "Paid";
        }

        // row HTML
        row.innerHTML = "<td>" + order.orderId + "</td>" +
            "<td>" + order.restaurantName + "</td>" +
            "<td>" + order.itemCount + "</td>" +
            "<td>" + statusText + "</td>" +
            "<td>" + order.deliveryDistance + " km</td>";

        // Add to table
        tableBody.appendChild(row);
    }

    // Check if empty
    if (list.length == 0) {
        tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center'>No orders found</td></tr>";
    }
}

// filter order
function filterOrders() {
    //  values  inputs
    var statusOpt = document.getElementById('filterStatus').value; // 'all', 'paid', 'unpaid'

    //  distance input
    var distOpt = document.getElementById('commonDist').value;

    // temporary list results
    var results = [];

    for (var i = 0; i < ordersList.length; i++) {
        var order = ordersList[i];

        // Status
        var statusMatch = true;
        if (statusOpt == "paid" && order.isPaid == false) statusMatch = false;
        if (statusOpt == "unpaid" && order.isPaid == true) statusMatch = false;

        // check Distanc
        var distMatch = true;
        if (distOpt != "") {
            if (order.deliveryDistance > Number(distOpt)) {
                distMatch = false;
            }
        }

        // conditions match add to results
        if (statusMatch && distMatch) {
            results.push(order);
        }
    }


    renderOrders(results);
}

// assign delivery
function AssignDelivery(maxDistance) {
    var msg = document.getElementById('resultMsg');

    //  unpaid and within range?
    var validOrders = [];

    for (var i = 0; i < ordersList.length; i++) {
        var order = ordersList[i];

        if (order.isPaid == false && order.deliveryDistance <= maxDistance) {
            validOrders.push(order);
        }
    }

    //  Check if we found 
    if (validOrders.length == 0) {
        msg.innerHTML = "No order available";
        msg.style.color = "red";
        return;
    }


    var nearestOrder = validOrders[0];

    for (var j = 1; j < validOrders.length; j++) {
        var current = validOrders[j];
        if (current.deliveryDistance < nearestOrder.deliveryDistance) {
            nearestOrder = current;
        }
    }

    // Display the result
    msg.innerHTML = nearestOrder.restaurantName + " (" + nearestOrder.deliveryDistance + " km)";
    msg.style.color = "green";
}


// --- bUtton ---



function handleAdd() {
    var name = document.getElementById('rName').value;
    var count = document.getElementById('iCount').value;
    var dist = document.getElementById('dDist').value;
    var paid = document.getElementById('isPaid').checked;

    if (name == "" || count == "" || dist == "") {
        alert("Please fill in all fields.");
        return;
    }

    addOrder(name, count, paid, dist);
}

function handleProcess() {

    filterOrders();


    var maxDist = document.getElementById('commonDist').value;


    if (maxDist == "") {
        var msg = document.getElementById('resultMsg');
        msg.innerHTML = "Enter distance to assign.";
        msg.style.color = "black";
    } else {
        AssignDelivery(Number(maxDist));
    }


    document.getElementById('filterStatus').value = "all";
    document.getElementById('commonDist').value = "";
}
