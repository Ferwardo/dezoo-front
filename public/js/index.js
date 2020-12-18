$(() => {
    getPersonnel();
})

//get all personnel members
let getPersonnel = () => {
    $.ajax({
        url: "http://localhost:8050",
        success: () => {
            alert("alles is goed gelopen");

        },
        error: (xhr, status, error) => {
            alert("Er is iet fout gelopen, probeer later opnieuw.")
        }
    });
}
