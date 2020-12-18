$(() => {
    getPersonnel();
})

//use this base url
let url = "http://localhost:8050"


//get all personnel members
let getPersonnel = () => {
    $.ajax({
        url: url + "/personeel",
        success: (data) => {
            let tableContent;

            if (data.length == 0)
                tableContent = "Er zijn geen personeelsleden gevonden."
            else {
                data.forEach(personnelMember => {
                    var dob = new Date(personnelMember.dateOfBirth)

                    tableContent += `<tr>\
                    <td>${personnelMember.personnelId}</td>\
                    <td>${personnelMember.firstName}</td>\
                    <td>${personnelMember.lastName}</td>\
                    <td>${dob.getDate()}/${dob.getMonth()}/${dob.getFullYear()}</td>\
                    <td>${personnelMember.address}</td>\
                    <td>${personnelMember.postalCode}</td>\
                    <td>${personnelMember.privatePhoneNumber}</td>\
                    <td>${personnelMember.personelCategory}</td>\
                    <td>
                        <div class="btn-group">
                            <button onclick="editPersoneel" class="btn btn-success" data-toggle="tooltip" title="Bewerk ${personnelMember.firstName} ${personnelMember.lastName}"><i class="far fa-edit"></i></button>
                            <button onclick="deletePersoneel('${personnelMember.personnelId}')" class="btn btn-danger" data-toggle="tooltip" title="Verwijder ${personnelMember.firstName} ${personnelMember.lastName}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>`
                });
            }
            $("#personnelTable").children().eq(1).append(tableContent);
        },
        error: () => {
            alert("Er is iet fout gelopen, probeer later opnieuw.")
        }
    });
}

//delete a personnel member
let deletePersoneel = (personnelId) => {
    $.ajax({
        url: url + "/personeel/" + personnelId,
        method: "DELETE",
        success: () => {
            window.location.reload();
        },
        error: () => {
            alert("Er is iet mis gelopen.");
        }
    })
}
