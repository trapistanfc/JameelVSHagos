// Set the game date - December 20th, 2024 at 7:00 PM
const gameDate = new Date('December 20, 2024 19:00:00').getTime();

// Initialize voting data (using localStorage for persistence)
let votes = {
    jameel: parseInt(localStorage.getItem('jameel_votes') || '0', 10),
    hagos: parseInt(localStorage.getItem('hagos_votes') || '0', 10)
};

// Check if user has already voted
let hasVoted = localStorage.getItem('has_voted') === 'true';

// Update countdown every second
const countdownTimer = setInterval(function () {
    const now = new Date().getTime();
    const distance = gameDate - now;

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance >= 0) {
        // Display the countdown with leading zeros
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    } else {
        // When countdown is finished
        clearInterval(countdownTimer);
        const section = document.querySelector('.countdown-section');
        if (section) {
            section.innerHTML = `
                <h2 style="
                    color: #f97373;
                    font-size: 2.8rem;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    text-align: center;
                    animation: pulse-red 1.2s infinite;
                ">
                    🔴 Live Now 🔴
                </h2>
            `;
        }
    }
}, 1000);

// Betting / Voting functionality
function placeBet(fighter) {
    if (hasVoted) {
        showNotification('You have already placed your bet');
        return;
    }

    if (!votes[fighter] && votes[fighter] !== 0) return;

    // Increment vote
    votes[fighter]++;

    // Save to localStorage
    localStorage.setItem(`${fighter}_votes`, votes[fighter]);
    localStorage.setItem('has_voted', 'true');
    hasVoted = true;

    // Update display
    updateVoteDisplay();

    // Show confirmation
    const prettyName = fighter === 'jameel' ? 'JAMEEL' : 'HAGOS';
    showNotification(`Your bet on ${prettyName} has been placed`);

    // Visually lock in vote
    document.querySelectorAll('.bet-option').forEach(option => {
        option.style.opacity = '0.7';
        option.style.pointerEvents = 'none';
    });

    document.querySelectorAll('.bet-button').forEach(button => {
        button.textContent = 'VOTE PLACED';
        button.style.background = '#111827';
        button.style.color = '#e5e7eb';
    });
}

// Update vote display
function updateVoteDisplay() {
    const totalVotes = votes.jameel + votes.hagos;

    const jameelPercentEl = document.getElementById('jameel-percent');
    const hagosPercentEl = document.getElementById('hagos-percent');
    const jameelBar = document.getElementById('jameel-bar');
    const hagosBar = document.getElementById('hagos-bar');
    const totalVotesEl = document.getElementById('total-votes');

    if (!jameelPercentEl || !hagosPercentEl || !jameelBar || !hagosBar || !totalVotesEl) return;

    if (totalVotes === 0) {
        // Default 50-50 if no votes
        jameelPercentEl.textContent = '50%';
        hagosPercentEl.textContent = '50%';
        jameelBar.style.width = '50%';
        hagosBar.style.width = '50%';
        totalVotesEl.textContent = '0';
    } else {
        const jameelPercent = Math.round((votes.jameel / totalVotes) * 100);
        const hagosPercent = 100 - jameelPercent; // ensure 100 total

        jameelPercentEl.textContent = jameelPercent + '%';
        hagosPercentEl.textContent = hagosPercent + '%';
        jameelBar.style.width = jameelPercent + '%';
        hagosBar.style.width = hagosPercent + '%';
        totalVotesEl.textContent = totalVotes;
    }
}

// Show notification (cleaner styling to match new theme)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15,23,42,0.98);
        color: #f9fafb;
        padding: 12px 24px;
        border-radius: 999px;
        font-size: 0.85rem;
        z-index: 1000;
        border: 1px solid rgba(249,115,129,0.9);
        box-shadow: 0 14px 30px rgba(15,23,42,0.9);
        letter-spacing: 2px;
        text-transform: uppercase;
        animation: fadeInOut 2.4s ease;
        text-align: center;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2400);
}

// Add fadeInOut + slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
        15% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        85% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-6px);
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(40px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize display on page load
document.addEventListener('DOMContentLoaded', function () {
    updateVoteDisplay();

    // If user has already voted, disable voting UI
    if (hasVoted) {
        document.querySelectorAll('.bet-option').forEach(option => {
            option.style.opacity = '0.7';
            option.style.pointerEvents = 'none';
        });

        document.querySelectorAll('.bet-button').forEach(button => {
            button.textContent = 'VOTE PLACED';
            button.style.background = '#111827';
            button.style.color = '#e5e7eb';
        });
    }

    // Entrance animations
    setTimeout(() => {
        document.querySelectorAll('.fighter-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animation = `slideIn ${0.7 + index * 0.15}s ease forwards`;
        });

        document.querySelectorAll('.undercard-match').forEach((match, index) => {
            match.style.opacity = '0';
            match.style.animation = `slideInLeft ${0.8 + index * 0.1}s ease forwards`;
        });
    }, 120);

    // Optional: hide training section if videos not shipped yet
    // const trainingSection = document.getElementById('training-section');
    // if (trainingSection) {
    //     trainingSection.style.display = 'none';
    // }
});

// ---- OPTIONAL DEMO STUFF (keep commented unless you want it) ----

// Simulate live vote updates (for demo purposes)
// function simulateVotes() {
//     if (Math.random() > 0.5) {
//         votes.jameel += Math.floor(Math.random() * 3) + 1;
    //         localStorage.setItem('jameel_votes', votes.jameel);
//     } else {
//         votes.hagos += Math.floor(Math.random() * 3) + 1;
//         localStorage.setItem('hagos_votes', votes.hagos);
//     }
//     updateVoteDisplay();
// }
// setInterval(simulateVotes, Math.random() * 5000 + 5000);

// Parallax effect – removed because it conflicts with hover / 3D transforms
// If you really want it back, we can re-add it in a way that doesn’t override
// existing transforms.
/*
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;

    document.querySelectorAll('.fighter-card').forEach((card, index) => {
        const direction = index === 0 ? 1 : -1;
        card.style.transform = \`translateX(\${x * direction}px) translateY(\${y * 0.4}px)\`;
    });
});
*/
