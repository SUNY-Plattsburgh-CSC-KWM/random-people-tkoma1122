async function getPeople() {
	try {
		const response = await fetch("https://randomuser.me/api/?results=25&nat=us");
		if (!response.ok) {
			throw new Error(`HTTP Error: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(`Could not get names: ${error}`);
	}
}

function parsePeopleData(data) {
	// Extract and format the data from the API response
	const people = data.results.map(person => {
		return {
			firstName: person.name.first,
			lastName: person.name.last,
			title: person.name.title,
			address: `${person.location.street.number} ${person.location.street.name}`,
			city: person.location.city,
			state: person.location.state,
			zip: person.location.postcode,
			latitude: person.location.coordinates.latitude,
			longitude: person.location.coordinates.longitude,
			phone: person.phone
		};
	});
	
	// Sort by last name
	people.sort((a, b) => a.lastName.localeCompare(b.lastName));
	
	return people;
}

function buildTableRows(people) {
	// Get the table body (or table element)
	const table = $('#people');
	
	// Build a row for each person
	people.forEach(person => {
		const fullName = `${person.title} ${person.firstName} ${person.lastName}`;
		
		// Create table row with data-phone attribute for tooltip
		const row = $('<tr></tr>').attr('title', person.phone);
		
		// Add cells to the row
		row.append($('<td></td>').text(fullName));
		row.append($('<td></td>').text(person.address));
		row.append($('<td></td>').text(person.city));
		row.append($('<td></td>').text(person.state));
		row.append($('<td></td>').text(person.zip));
		row.append($('<td></td>').text(person.latitude));
		row.append($('<td></td>').text(person.longitude));
		
		// Append row to table
		table.append(row);
	});
}

async function buildTable() {
	try {
		const data = await getPeople();
		const people = parsePeopleData(data);
		buildTableRows(people);
	} catch (e) {
		console.log("Error: " + e);
	}
}

// Wait for document to be ready before building table
$(document).ready(function() {
	buildTable();
});
