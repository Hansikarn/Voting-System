// Function to save vote to local storage
async function saveVoteToLocal(voteDetails) {
    try {
        let votes = JSON.parse(localStorage.getItem("votes")) || [];
        votes.push(voteDetails);
        localStorage.setItem("votes", JSON.stringify(votes));
    } catch (error) {
        console.error("Error saving vote to local storage:", error);
    }
}

// Function to display vote on screen
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

// Function to delete vote from local storage
async function deleteVote(voteId, monitor) {
    try {
        // Delete vote from API
        const response = await axios.delete(`https://crudcrud.com/api/2c554a69d3af4c36b83ffcd793e80819/vote/${voteId}`);
        console.log(response);
        // Update UI
        updateVoteCountsAfterDelete(monitor);
    } catch (error) {
        console.error("Error deleting vote:", error);
    }

    try {
        // Delete vote from local storage
        let votes = JSON.parse(localStorage.getItem("votes")) || [];
        votes = votes.filter(vote => !(vote._id === voteId && vote.monitor === monitor));
        localStorage.setItem("votes", JSON.stringify(votes));
    } catch (error) {
        console.error("Error deleting vote from local storage:", error);
    }
}

// Function to update vote counts
function updateVoteCounts(voteDetails) {
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

// Function to update vote counts after deletion
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

// Event listener for voting form submission
document.getElementById("votingForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const studentName = document.getElementById("Student_name").value;
    const monitor = document.getElementById("monitor").value;
    
    const voteDetails = {
        studentName: studentName,
        monitor: monitor
    };
    
    // Save vote to local storage
    await saveVoteToLocal(voteDetails);

    try {
        // Post vote to API
        const response = await axios.post("https://crudcrud.com/api/2c554a69d3af4c36b83ffcd793e80819/vote", voteDetails);
        console.log(response);
        // Update UI
        updateVoteCounts(voteDetails);
        displayVote(voteDetails);
    } catch (error) {
        console.error("Error submitting vote:", error);
    }

    // Clearing the input fields
    document.getElementById("Student_name").value = "";
    document.getElementById("monitor").selectedIndex = 0; // Reset dropdown to default option
});

// Load votes from API and update UI on page load
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await axios.get("https://crudcrud.com/api/2c554a69d3af4c36b83ffcd793e80819/vote");
        console.log(response);
        const votes = response.data || [];
        votes.forEach((voteDetails) => {
            updateVoteCounts(voteDetails);
            displayVote(voteDetails);
        });
    } catch (error) {
        console.error("Error fetching votes:", error);
    }
});
