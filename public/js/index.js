$(() => {
    getPersonnel();

    //reset everything back to normal after the personnelModal is closed
    let personnelModal = document.getElementById("personnelModal")
    personnelModal.addEventListener('hidden.bs.modal', (event) => {
        $("#personnelModal").find(".modal-title").html("Nieuw Personeelslid")
        $("#personnelModal").find(".form-control")[0].value = "";
        $("#personnelModal").find(".form-control")[1].value = "";
        $("#personnelModal").find(".form-control")[2].value = "";
        $("#personnelModal").find(".form-control")[3].value = "";
        $("#personnelModal").find(".form-control")[4].value = "";
        $("#personnelModal").find(".form-control")[5].value = "";
        $("#personnelModal").find(".form-select").val("notChosen").prop("selected", true);
    })
})

//use this base url
let url = "http://localhost:8050";
//set this to true when editing
let editing = false;

let openModal = (modalName) => {
    let modal = new bootstrap.Modal(document.getElementById(modalName));
    modal.show();
}

//add new personnel member or edit an old one to the db
let postOrPutPersonnel = () => {

}

//edit personnel member
let editPersonnel = () => {
    editing = true;
    $("#personnelModal").find(".modal-title").html("Editeer Personeelslid")
    openModal("personnelModal")
}

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
                            <button onclick="editPersonnel()" class="btn btn-success" data-toggle="tooltip" title="Bewerk ${personnelMember.firstName} ${personnelMember.lastName}"><i class="far fa-edit"></i></button>
                            <button onclick="deletePersonnel('${personnelMember.personnelId}')" class="btn btn-danger" data-toggle="tooltip" title="Verwijder ${personnelMember.firstName} ${personnelMember.lastName}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>`
                });
            }
            $("#personnelTable").children().eq(1).html(tableContent);
        },
        error: () => {
            alert("Er is iet fout gelopen, probeer later opnieuw.")
        }
    });
}

//delete a personnel member
let deletePersonnel = (personnelId) => {
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
