document.getElementById("votingForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const studentName = document.getElementById("Student_name").value;
    const monitor = document.getElementById("monitor").value;
    
    const voteDetails = {
        studentName: studentName,
        monitor: monitor
    };
    
    axios
        .post(
            "https://crudcrud.com/api/79821b8c35844b20bf4b8689a5217d36/vote", 
            voteDetails
        )
        .then((response) => {
            console.log(response);
            updateVoteCounts(response.data); // Update vote counts
            displayVote(response.data); // Display the vote
        })
        .catch((error) => {
            console.error("Error submitting vote:", error);
        });

    // Clearing the input fields
    document.getElementById("Student_name").value = "";
    document.getElementById("monitor").selectedIndex = 0; // Reset dropdown to default option
});

function updateVoteCounts(voteDetails) {
    // Update individual monitor vote counts
    const monitor = voteDetails.monitor.toLowerCase();
    const voteCountElement = document.getElementById(`${monitor}VoteCount`);
    if (voteCountElement) {
        const currentCount = parseInt(voteCountElement.textContent);
        voteCountElement.textContent = currentCount + 1;
    }

    // Update total vote count
    const totalVotesElement = document.getElementById("votecount");
    if (totalVotesElement) {
        const currentTotal = parseInt(totalVotesElement.textContent);
        totalVotesElement.textContent = currentTotal + 1;
    }
}

function displayVote(voteDetails) {
    const monitor = voteDetails.monitor.toLowerCase();
    const studentName = voteDetails.studentName;

    const voteList = document.getElementById(`${monitor}Votes`);
    const listItem = document.createElement("li");
    listItem.textContent = studentName;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        
        deleteVote(voteDetails._id, monitor); 
        listItem.remove(); 
    });
    listItem.appendChild(deleteButton);
    voteList.appendChild(listItem);
}

function deleteVote(voteId, monitor) {
    axios
        .delete(
            `https://crudcrud.com/api/79821b8c35844b20bf4b8689a5217d36/vote/${voteId}` 
        )
        .then((response) => {
            console.log(response);
            updateVoteCountsAfterDelete(monitor); // Update vote counts after deletion
        })
        .catch((error) => {
            console.error("Error deleting vote:", error);
        });
}

function updateVoteCountsAfterDelete(monitor) {
    // Update individual monitor vote counts after deletion
    const voteCountElement = document.getElementById(`${monitor}VoteCount`);
    if (voteCountElement) {
        const currentCount = parseInt(voteCountElement.textContent);
        voteCountElement.textContent = currentCount - 1;
    }

    // Update total vote count after deletion
    const totalVotesElement = document.getElementById("votecount");
    if (totalVotesElement) {
        const currentTotal = parseInt(totalVotesElement.textContent);
        totalVotesElement.textContent = currentTotal - 1;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    axios
        .get(
            "https://crudcrud.com/api/79821b8c35844b20bf4b8689a5217d36/vote-counts")
        .then((response) => {
            console.log(response);
            const voteCounts = response.data;
            Object.keys(voteCounts).forEach(monitor => {
                const voteCountElement = document.getElementById(`${monitor.toLowerCase()}VoteCount`);
                if (voteCountElement) {
                    voteCountElement.textContent = voteCounts[monitor];
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching vote counts:", error);
        });
});
