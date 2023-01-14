// Fetch cities from API
fetch(
  "https://wavy-media-proxy.wavyapps.com/investors-notebook/data/miasta.json"
)
  .then((response) => response.json())
  .then((data) => {
    // Populate select element with options
    var select = document.getElementById("city");
    var emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.text = "";
    select.add(emptyOption);
    data.forEach((item) => {
      var option = document.createElement("option");
      option.value = item.id;
      option.text = item.name;
      option.dataset.provinceId = item.voivodeship_id;
      select.add(option);
    });

    // Sort options alphabetically
    var options = select.options;
    [].slice
      .call(options)
      .sort(function (a, b) {
        if (a.text > b.text) return 1;
        if (a.text < b.text) return -1;
        return 0;
      })
      .forEach(function (option) {
        select.add(option);
      });
  });

// Filter cities based on selected province
document
  .getElementById("province")
  .addEventListener("change", function (event) {
    var selectedProvince = event.target.value;
    var cityOptions = document.querySelectorAll("#city option");
    cityOptions.forEach((option) => {
      if (option.dataset.provinceId == selectedProvince) {
        option.style.display = "block";
      } else {
        option.style.display = "none";
      }
    });

    // Set city to first alphabetically sorted option
    var firstOption = document.querySelector(
      '#city option[style="display: block;"]'
    );
    if (firstOption) {
      firstOption.selected = true;
    }
  });

// Reset form
function resetForm() {
  document.getElementById("street").value = "";
  document.getElementById("province").value = "";
  document.getElementById("city").value = "";
  document.getElementById("message").value = "";
  //Reset URL
  window.location.assign("/");
}

// Map of province IDs to names
var provinces = {};

// Map of city IDs to names
var cities = {};

// Retrieve list of provinces from API
fetch(
  "https://wavy-media-proxy.wavyapps.com/investors-notebook/data/wojewodztwa.json"
)
  .then((response) => response.json())
  .then((data) => {
    // Map names to IDs
    data.forEach((province) => {
      provinces[province.id] = province.name;
    });

    // Populate province select element
    var provinceSelect = document.getElementById("province");
    for (var id in provinces) {
      var option = document.createElement("option");
      option.value = id;
      option.text =
        provinces[id].charAt(0).toUpperCase() + provinces[id].slice(1);
      provinceSelect.add(option);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Retrieve list of cities from API
fetch(
  "https://wavy-media-proxy.wavyapps.com/investors-notebook/data/miasta.json"
)
  .then((response) => response.json())
  .then((data) => {
    // Map names to IDs
    data.forEach((city) => {
      cities[city.id] = city;
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function updateCities() {
  var provinceId = document.getElementById("province").value;
  var citySelect = document.getElementById("city");
  citySelect.innerHTML = ""; // Clear previous options

  // Add cities for selected province
  for (var id in cities) {
    if (cities[id].voivodeship_id == provinceId) {
      var option = document.createElement("option");
      option.value = id;
      option.text = cities[id].name;
      citySelect.add(option);
    }
  }
}

function saveForm() {
  var street = document.getElementById("street").value;
  var provinceId = document.getElementById("province").value;
  var provinceName =
    provinces[provinceId].charAt(0).toUpperCase() +
    provinces[provinceId].slice(1);
  var cityId = document.getElementById("city").value;
  var cityName =
    cities[cityId].name.charAt(0).toUpperCase() + cities[cityId].name.slice(1);
  var message = document.getElementById("message").value;

  var postData = {
    entry: {
      Notes: message,
      Address: `${provinceName},${cityName},${street}`,
    },
  };

  let responseId;

  // send POST request with information from the form, and save ID in let responseId
  fetch("https://wavy-media-proxy.wavyapps.com/investors-notebook/", {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      responseId = data[0].Id;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Update the table with information based on the recently received ID
  fetch(
    `${
      "https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entry&entry_id=" +
      responseId
    }`
  )
    .then((response) => response.json())
    .then((data) => {
      // data contains the entries from the API
      data.forEach((entry) => {
        // Add a new row to the table
        var table = document.getElementById("table");
        var row = table.insertRow();

        // Add cells for each piece of data
        var address = row.insertCell();
        var id = row.insertCell();
        var msg = row.insertCell();

        // Set the text of each cell
        address.innerHTML = entry.Address;
        address.setAttribute("data-label", "Location");
        id.innerHTML = entry.Id;
        id.setAttribute("data-label", "Id");
        msg.innerHTML = entry.Notes;
        msg.setAttribute("data-label", "Message");
      });
    });
}

// Table

fetch(
  "https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entries"
)
  .then((response) => response.json())
  .then((data) => {
    // data contains the entries from the API
    data.forEach((entry) => {
      // Add a new row to the table
      var table = document.getElementById("table");
      var row = table.insertRow();

      // Add cells for each piece of data
      var address = row.insertCell();
      var id = row.insertCell();
      var msg = row.insertCell();

      // Set the text of each cell
      address.innerHTML = entry.Address;
      address.setAttribute("data-label", "Location");
      id.innerHTML = entry.Id;
      id.setAttribute("data-label", "Id");
      msg.innerHTML = entry.Notes;
      msg.setAttribute("data-label", "Message");
    });
  });

// Get a reference to the table element
const table = document.getElementById("table");

// Add an event listener to the table that listens for click events
table.addEventListener("click", function (event) {
  // Get the target element that was clicked (should be a table row)
  const target = event.target;
  if (target.tagName !== "TD") return; // only process the click event if the target is a table cell

  // Get the parent row of the target element
  const row = target.parentElement;

  // Get references to the form inputs that you want to fill with data from the table
  const street = document.getElementById("street");
  const province = document.getElementById("province");
  const city = document.getElementById("city");
  const message = document.getElementById("message");

  // Use the cells property of the row element to access the data in the table cells
  const streetInput = row.cells[0].textContent;
  const streetValues = streetInput.split(",");

  street.value = streetValues[0].trim();
  message.value = row.cells[2].textContent;

  // Get the provinceId from the city option that matches the city name from the address cell
  const cityName = streetValues[1].trim();
  const cityOption = Array.from(city.options).find((o) => o.text === cityName);
  cityOption.selected = true;

  // Set the selected option of the province select element to the one with the matching provinceId
  const provinceId = cityOption.dataset.provinceId;
  Array.from(province.options).find(
    (o) => o.value === provinceId
  ).selected = true;

  const id = row.cells[1].textContent;
  window.history.pushState("", "", `${"entryId=" + id}`);
});
