// Function to save vote to API
async function saveVoteToAPI(voteDetails) {
    try {
        const response = await axios.post("https://crudcrud.com/api/f2e0f22f1b554f35b7bc1eb3b2650f28/vote", voteDetails);
        return response.data; // Return the new vote details
    } catch (error) {
        console.error("Error saving vote to API:", error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

// Function to delete vote from API
async function deleteVoteFromAPI(voteId) {
    try {
        await axios.delete(`https://crudcrud.com/api/f2e0f22f1b554f35b7bc1eb3b2650f28/vote/${voteId}`);
    } catch (error) {
        console.error("Error deleting vote from API:", error);
        throw error;
    }
}

// Function to display vote on screen with delete button
function displayVoteOnScreen(voteDetails) {
    const monitor = voteDetails.monitor.toLowerCase();

    const voteItem = document.createElement("li");
    voteItem.textContent = voteDetails.studentName; 

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async function() {
        try {
            await deleteVoteFromAPI(voteDetails._id);
            voteItem.remove(); 
            updateVoteCounts(monitor, -1); 
            await updateTotalVotesCount(); 
        } catch (error) {
            console.error("Error deleting vote:", error);
        }
    });

    voteItem.appendChild(deleteButton);

    const voteList = document.getElementById(`${monitor}Votes`); // Get the vote list for the monitor
    voteList.appendChild(voteItem);

    // Update vote count
    updateVoteCounts(monitor, 1);
}

// Function to update vote counts for each monitor
function updateVoteCounts(monitor, change) {
    const voteCountElement = document.getElementById(`${monitor}VoteCount`);
    if (voteCountElement) {
        let currentCount = parseInt(voteCountElement.textContent);
        currentCount += change;
        voteCountElement.textContent = currentCount;
    }
}

// Function to update total votes count
async function updateTotalVotesCount() {
    try {
        const response = await axios.get("https://crudcrud.com/api/f2e0f22f1b554f35b7bc1eb3b2650f28/vote");
        const totalVotes = response.data.length;
        const totalVotesElement = document.getElementById("totalVotesCount");
        totalVotesElement.textContent = totalVotes;
    } catch (error) {
        console.error("Error updating total votes count:", error);
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
    
    try {
        // Save vote to API
        const newVote = await saveVoteToAPI(voteDetails);

        // Update UI
        displayVoteOnScreen(newVote);
        await updateTotalVotesCount(); // Update total votes count
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
        const response = await axios.get("https://crudcrud.com/api/f2e0f22f1b554f35b7bc1eb3b2650f28/vote");
        const votes = response.data || [];
        votes.forEach((voteDetails) => {
            displayVoteOnScreen(voteDetails);
        });
        await updateTotalVotesCount(); // Update total votes count on page load
    } catch (error) {
        console.error("Error fetching votes:", error);
    }
});
