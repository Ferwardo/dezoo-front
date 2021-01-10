$(() => {
    getPersonnel();
    getAnimals();

    //reset everything back to normal after the personnelModal is closed
    let personnelModal = document.getElementById("personnelModal")
    personnelModal.addEventListener('hidden.bs.modal', (event) => {
        $("#personnelModal").find(".modal-title").html("Nieuw Personeelslid")
        $("#personnelModal").find("#firstName").val("");
        $("#personnelModal").find("#lastName").val("");
        $("#personnelModal").find("#dateOfBirth").val("");
        $("#personnelModal").find("#address").val("");
        $("#personnelModal").find("#postalCode").val("");
        $("#personnelModal").find("#telephoneNumber").val("");
        $("#personnelModal").find("#personnelCategory").val("notChosen").prop("selected", true);
    })

    let animalModal = document.getElementById("animalModal");
    animalModal.addEventListener("hidden.bs.modal", (event) => {
        $("#animalModal").find(".modal-title").html("Nieuw Dier");
        $("#animalModal").find("#name").val("");
        $("#animalModal").find("#species").val("");
        //months and day need an extra 0 in front of them to work, also somehow months are 1 month to early so it adds one to get the right month and date.
        $("#animalModal").find("#dateOfBirth").val("");
        $("#animalModal").find("#class").val("");
        $("#animalModal").find("#vertebrate").prop("checked", false);
    })

})

//use this base url
let url = "http://localhost:8050";
//set this to true when editing
let editing = false;
let editingAnimal;

let openModal = (modalName) => {
    //make a new js bootstrap modal from the modalName given and show it.
    let modal = new bootstrap.Modal(document.getElementById(modalName));
    modal.show();
}

//animal functions
//get all animals
let getAnimals = () => {
    $.ajax({
        url: url + "/dieren",
        success: (data) => {
            let tableContent;
            if (data.length == 0)
                tableContent = "Er zijn geen dieren gevonden."
            else {
                data.forEach(dier => {
                    var dob = new Date(dier.dateOfBirth)

                    tableContent += `<tr>\
                    <td>${dier.animalId}</td>\
                    <td>${dier.name}</td>\
                    <td>${dier.kind}</td>\
                    <td>${dob.getDate()}/${dob.getMonth()}/${dob.getFullYear()}</td>\
                    <td>${dier.vertebrate ? "Ja" : "Nee"}</td>\
                    <td>${dier.classification}</td>\
                    <td>
                        <div class="btn-group">
                            <button onclick="editAnimal(this)" class="btn btn-success" data-toggle="tooltip" title="Bewerk ${dier.name}"><i class="far fa-edit"></i></button>
                            <button onclick="deleteAnimal('${dier.animalId}')" class="btn btn-danger" data-toggle="tooltip" title="Verwijder ${dier.name}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>`
                });
            }
            $("#animalTable").children().eq(1).html(tableContent);
        },
        error: () => {
            alert("Er is iet fout gelopen, probeer later opnieuw.")
        }
    });
}

//edit animal
let editAnimal = (obj) => {
    editing = true
    editAnimal = obj
    $("#animalModal").find(".modal-title").html("Bewerk Dier");
    //set the field to the values fo the selected personnelMember
    var dob = new Date($(obj).parent().parent().parent().children().eq(3).html().split("/").reverse().join("-"))

    $("#animalModal").find("#name").val($(obj).parent().parent().parent().children().eq(1).html());
    $("#animalModal").find("#species").val($(obj).parent().parent().parent().children().eq(2).html());
    //months and day need an extra 0 in front of them to work, also somehow months are 1 month to early so it adds one to get the right month and date.
    $("#animalModal").find("#dateOfBirth").val(dob.getFullYear() + "-" + (dob.getMonth() >= 9 ? (dob.getMonth() + 1) : "0" + (dob.getMonth() + 1)) + "-" + (dob.getDate() >= 10 ? dob.getDate() : "0" + dob.getDate()));
    $("#animalModal").find("#class").val($(obj).parent().parent().parent().children().eq(5).html());
    $("#animalModal").find("#vertebrate").prop("checked", $(obj).parent().parent().parent().children().eq(4).html() == "Ja" ? true : false);


    openModal("animalModal");
}

//add or update animal in db
let postOrPutAnimal = () => {
    event.preventDefault()

    let animal = {
        animalId: "",
        name: $("#animalModal").find("#name").val(),
        kind: $("#animalModal").find("#species").val(),
        dateOfBirth: $("#animalModal").find("#dateOfBirth").val(),
        classification: $("#animalModal").find("#class").val(),
        vertebrate: $("#animalModal").find("#vertebrate").is(":checked")
    }

    if (!editing) {
        animal.animalId = `${$("#animalModal").find("#species").val().toLowerCase()}${Math.floor(100 + Math.random() * 900)}`;
        $.ajax({
            url: url + "/dieren",
            data: JSON.stringify(animal),
            contentType: 'application/json; charset=utf-8',
            method: "POST",
            success: () => {
                window.location.reload();
            },
            error: () => {
                alert("Er is iet mis gelopen.");
            }
        })
    }
    else {
        animal.animalId = $(editAnimal).parent().parent().parent().children().eq(0).html();
        $.ajax({
            url: url + "/dieren/" + animal.animalId,
            data: JSON.stringify(animal),
            contentType: 'application/json; charset=utf-8',
            method: "PUT",
            success: () => {
                window.location.reload();
            },
            error: () => {
                alert("Er is iet mis gelopen.");
            }
        })
    }
}

//delete animal
let deleteAnimal = (animalID) => {
    $.ajax({
        url: url + "/dieren/" + animalID,
        method: "DELETE",
        success: () => {
            window.location.reload();
        },
        error: () => {
            alert("Er is iet mis gelopen.");
        }
    })
}

//residence functions
//get all residences
let getResidences = () => {
    $.ajax({
        url: url + "/verblijven/personeel/" + $("#personnelMemberResidence").val(),
        success: (data) => {
            let tableContent;

            if (data.length == 0)
                tableContent = "Er zijn geen verblijven gevonden."
            else {
                data.forEach(residence => {

                    tableContent += `<tr>\
                        <td>${residence.verblijfID}</td>\
                        <td>${residence.name}</td>\
                        <td>${residence.dierID}</td>\
                        <td>${residence.maxDieren}</td>\
                        <td>${residence.bouwJaar}</td>\
                        <td>${residence.noctunral ? "Ja" : "Nee"}</td>\
                        <td>
                            <div class="btn-group">
                                <button onclick="editResidence(this)" class="btn btn-success" data-toggle="tooltip" title="Bewerk ${residence.name}"><i class="far fa-edit"></i></button>
                                <button onclick="deleteResidence('${residence.verblijfID}')" class="btn btn-danger" data-toggle="tooltip" title="Verwijder ${residence.name}"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>`
                });
            }
            $("#residencesTable").children().eq(1).html(tableContent);
        },
        error: () => {
            alert("Er is iet fout gelopen, probeer later opnieuw.")
        }
    });
}

//edit a residence
let editResidence = (obj) => {
    editing = true
    editAnimal = obj
    $("#residenceModal").find(".modal-title").html("Bewerk Verblijf");

    $("#residenceModal").find("#residenceID").val($(obj).parent().parent().parent().children().eq(0).html());
    $("#residenceModal").find("#name").val($(obj).parent().parent().parent().children().eq(1).html());
    $("#residenceModal").find("#animalID").val($(obj).parent().parent().parent().children().eq(2).html());
    $("#residenceModal").find("#maxAnimals").val($(obj).parent().parent().parent().children().eq(3).html());
    $("#residenceModal").find("#buildYear").val($(obj).parent().parent().parent().children().eq(4).html());
    $("#residenceModal").find("#nocturnal").prop("checked", $(obj).parent().parent().parent().children().eq(5).html() == "Ja" ? true : false);


    openModal("residenceModal");
}

//add or update a residence
let postOrPutResidence = () => {
    event.preventDefault()

    if ($("#personnelMemberResidence").val() != "notChosen") {
        let residence = {
            personeelID: $("#personnelMemberResidence").val(),
            verblijfID: $("#residenceModal").find("#residenceID").val(),
            name: $("#residenceModal").find("#name").val(),
            dierID: $("#residenceModal").find("#animalID").val(),
            maxDieren: $("#residenceModal").find("#maxAnimals").val(),
            bouwJaar: $("#residenceModal").find("#buildYear").val(),
            nocturnal: $("#residenceModal").find("#nocturnal").is(":checked")
        }

        if (!editing) {
            $.ajax({
                url: url + "/verblijven",
                data: JSON.stringify(residence),
                contentType: 'application/json; charset=utf-8',
                method: "POST",
                success: () => {
                    window.location.reload();
                },
                error: () => {
                    alert("Er is iet mis gelopen.");
                }
            })
        }
        else {
            $.ajax({
                url: url + "/verblijven/",
                data: JSON.stringify(residence),
                contentType: 'application/json; charset=utf-8',
                method: "PUT",
                success: () => {
                    window.location.reload();
                },
                error: () => {
                    alert("Er is iet mis gelopen.");
                }
            })
        }
    }
    else
        alert("Kies eerst een personeelslid")
}

//delete a residence
let deleteResidence = (verblijfID) => {
    $.ajax({
        url: url + "/verblijven/" + verblijfID,
        method: "DELETE",
        success: () => {
            window.location.reload();
        },
        error: () => {
            alert("Er is iet mis gelopen.");
        }
    })
}

//personnel functions
//add new personnel member or edit an old one to the db
let postOrPutPersonnel = () => {
    event.preventDefault()

    let month = parseInt($("#personnelModal").find("#dateOfBirth").val().slice(5, 7)) + 1;
    let personnelID = `${$("#personnelModal").find("#firstName").val().slice(0, 1).toLowerCase()}${$("#personnelModal").find("#lastName").val().slice(0, 1).toLowerCase()}${$("#personnelModal").find("#dateOfBirth").val().slice(-2).toLowerCase()}${month < 10 ? "0" + month : month}${$("#personnelModal").find("#dateOfBirth").val().slice(2, 4).toLowerCase()}`

    let personnelMember = {
        personnelId: personnelID,
        firstName: $("#personnelModal").find("#firstName").val(),
        lastName: $("#personnelModal").find("#lastName").val(),
        dateOfBirth: $("#personnelModal").find("#dateOfBirth").val(),
        address: $("#personnelModal").find("#address").val(),
        postalCode: $("#personnelModal").find("#postalCode").val(),
        privatePhoneNumber: $("#personnelModal").find("#telephoneNumber").val(),
        personelCategory: $("#personnelModal").find("#personnelCategory").val()
    }

    if (!editing) {
        $.ajax({
            url: url + "/personeel",
            data: JSON.stringify(personnelMember),
            contentType: 'application/json; charset=utf-8',
            method: "POST",
            success: () => {
                window.location.reload();
            },
            error: () => {
                alert("Er is iet mis gelopen.");
            }
        })
    }
    else {
        $.ajax({
            url: url + "/personeel",
            data: JSON.stringify(personnelMember),
            contentType: 'application/json; charset=utf-8',
            method: "PUT",
            success: () => {
                window.location.reload();
            },
            error: () => {
                alert("Er is iet mis gelopen.");
            }
        })
    }
}

//edit personnel member
let editPersonnel = (obj) => {
    editing = true;
    $("#personnelModal").find(".modal-title").html("Bewerk Personeelslid");
    //set the field to the values fo the selected personnelMember
    var dob = new Date($(obj).parent().parent().parent().children().eq(3).html().split("/").reverse().join("-"))

    $("#personnelModal").find("#firstName").val($(obj).parent().parent().parent().children().eq(1).html());
    $("#personnelModal").find("#lastName").val($(obj).parent().parent().parent().children().eq(2).html());
    //months and day need an extra 0 in front of them to work, also somehow months are 1 month to early so it adds one to get the right month and date.
    $("#personnelModal").find("#dateOfBirth").val(dob.getFullYear() + "-" + (dob.getMonth() >= 9 ? (dob.getMonth() + 1) : "0" + (dob.getMonth() + 1)) + "-" + (dob.getDate() >= 10 ? dob.getDate() : "0" + dob.getDate()));
    $("#personnelModal").find("#address").val($(obj).parent().parent().parent().children().eq(4).html());
    $("#personnelModal").find("#postalCode").val($(obj).parent().parent().parent().children().eq(5).html());
    $("#personnelModal").find("#telephoneNumber").val($(obj).parent().parent().parent().children().eq(6).html());
    $("#personnelModal").find("#personnelCategory").val($(obj).parent().parent().parent().children().eq(7).html())

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
                            <button onclick="editPersonnel(this)" class="btn btn-success" data-toggle="tooltip" title="Bewerk ${personnelMember.firstName} ${personnelMember.lastName}"><i class="far fa-edit"></i></button>
                            <button onclick="deletePersonnel('${personnelMember.personnelId}')" class="btn btn-danger" data-toggle="tooltip" title="Verwijder ${personnelMember.firstName} ${personnelMember.lastName}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>`
                    $("#personnelMemberResidence").append(`<option value="${personnelMember.personnelId}">${personnelMember.firstName} ${personnelMember.lastName}</option>`);

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
