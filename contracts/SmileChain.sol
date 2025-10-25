// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SmileChain
 * @dev A decentralized smile-to-earn application on Celo
 * Users earn tokens for high smile scores and can donate to a reward pool
 */
contract SmileChain {
    // Minimum score required to claim rewards
    uint256 public constant MIN_SCORE_FOR_REWARD = 80;
    
    // Reward amount in wei (0.1 CELO = 100000000000000000 wei)
    uint256 public constant REWARD_AMOUNT = 100000000000000000;
    
    // Maximum number of entries in the leaderboard
    uint256 public constant MAX_LEADERBOARD_SIZE = 10;
    
    // Donation pool balance
    uint256 public donationPool;
    
    // Last redistribution timestamp
    uint256 public lastRedistribution;
    
    // Redistribution interval (7 days in seconds)
    uint256 public constant REDISTRIBUTION_INTERVAL = 7 days;
    
    // User data structure
    struct User {
        uint256 bestScore;
        uint256 totalRewards;
        uint256 lastClaimTime;
        bool hasScore;
    }
    
    // Leaderboard entry
    struct LeaderboardEntry {
        address user;
        uint256 score;
    }
    
    // Mappings
    mapping(address => User) public users;
    LeaderboardEntry[] public leaderboard;
    
    // Events
    event SmileScored(address indexed user, uint256 score, uint256 timestamp);
    event RewardClaimed(address indexed user, uint256 amount, uint256 score);
    event DonationReceived(address indexed from, uint256 amount);
    event PoolRedistributed(uint256 totalAmount, uint256 timestamp);
    
    // Owner address (for emergency functions)
    address public owner;
    
    constructor() {
        owner = msg.sender;
        lastRedistribution = block.timestamp;
    }
    
    /**
     * @dev Submit a smile score and claim reward if eligible
     * @param score The smile score (0-100)
     */
    function submitScore(uint256 score) external {
        require(score <= 100, "Score must be between 0 and 100");
        require(score > 0, "Score must be greater than 0");
        
        User storage user = users[msg.sender];
        
        // Update best score if this is higher
        if (score > user.bestScore) {
            user.bestScore = score;
            updateLeaderboard(msg.sender, score);
        }
        
        user.hasScore = true;
        
        emit SmileScored(msg.sender, score, block.timestamp);
        
        // Auto-claim reward if score is high enough
        if (score >= MIN_SCORE_FOR_REWARD) {
            _claimReward(score);
        }
    }
    
    /**
     * @dev Internal function to claim reward
     * @param score The smile score that earned the reward
     */
    function _claimReward(uint256 score) internal {
        User storage user = users[msg.sender];
        
        // Simple rate limiting: 1 reward per day
        require(
            block.timestamp >= user.lastClaimTime + 1 days,
            "Can only claim once per day"
        );
        
        require(
            address(this).balance >= REWARD_AMOUNT,
            "Insufficient contract balance"
        );
        
        user.lastClaimTime = block.timestamp;
        user.totalRewards += REWARD_AMOUNT;
        
        (bool success, ) = msg.sender.call{value: REWARD_AMOUNT}("");
        require(success, "Reward transfer failed");
        
        emit RewardClaimed(msg.sender, REWARD_AMOUNT, score);
    }
    
    /**
     * @dev Update the leaderboard with a new score
     * @param user Address of the user
     * @param score The user's score
     */
    function updateLeaderboard(address user, uint256 score) internal {
        // Find if user already exists in leaderboard
        int256 existingIndex = -1;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].user == user) {
                existingIndex = int256(i);
                break;
            }
        }
        
        // Remove existing entry if found
        if (existingIndex >= 0) {
            uint256 index = uint256(existingIndex);
            for (uint256 i = index; i < leaderboard.length - 1; i++) {
                leaderboard[i] = leaderboard[i + 1];
            }
            leaderboard.pop();
        }
        
        // Find insertion position
        uint256 insertIndex = leaderboard.length;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (score > leaderboard[i].score) {
                insertIndex = i;
                break;
            }
        }
        
        // Insert new entry
        if (insertIndex < MAX_LEADERBOARD_SIZE) {
            leaderboard.push(LeaderboardEntry(address(0), 0));
            
            // Shift elements
            for (uint256 i = leaderboard.length - 1; i > insertIndex; i--) {
                leaderboard[i] = leaderboard[i - 1];
            }
            
            leaderboard[insertIndex] = LeaderboardEntry(user, score);
            
            // Trim to max size
            while (leaderboard.length > MAX_LEADERBOARD_SIZE) {
                leaderboard.pop();
            }
        }
    }
    
    /**
     * @dev Donate to the pool
     */
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        donationPool += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }
    
    /**
     * @dev Redistribute donation pool to top scorers
     * Can be called by anyone once the interval has passed
     */
    function redistributePool() external {
        require(
            block.timestamp >= lastRedistribution + REDISTRIBUTION_INTERVAL,
            "Redistribution interval not reached"
        );
        require(donationPool > 0, "No funds to redistribute");
        require(leaderboard.length > 0, "No entries in leaderboard");
        
        uint256 totalPool = donationPool;
        donationPool = 0;
        lastRedistribution = block.timestamp;
        
        // Distribution: 40% to #1, 30% to #2, 20% to #3, 10% split among rest
        uint256[] memory percentages = new uint256[](leaderboard.length);
        
        if (leaderboard.length == 1) {
            percentages[0] = 100;
        } else if (leaderboard.length == 2) {
            percentages[0] = 60;
            percentages[1] = 40;
        } else if (leaderboard.length == 3) {
            percentages[0] = 40;
            percentages[1] = 30;
            percentages[2] = 30;
        } else {
            percentages[0] = 40;
            percentages[1] = 30;
            percentages[2] = 20;
            uint256 remainingPercentage = 10;
            uint256 remainingWinners = leaderboard.length - 3;
            uint256 perWinner = remainingPercentage / remainingWinners;
            
            for (uint256 i = 3; i < leaderboard.length; i++) {
                percentages[i] = perWinner;
            }
        }
        
        // Distribute rewards
        for (uint256 i = 0; i < leaderboard.length; i++) {
            uint256 amount = (totalPool * percentages[i]) / 100;
            if (amount > 0) {
                address payable recipient = payable(leaderboard[i].user);
                (bool success, ) = recipient.call{value: amount}("");
                require(success, "Transfer failed");
                
                users[leaderboard[i].user].totalRewards += amount;
            }
        }
        
        emit PoolRedistributed(totalPool, block.timestamp);
    }
    
    /**
     * @dev Get leaderboard entries
     * @return addresses Array of user addresses
     * @return scores Array of scores
     */
    function getLeaderboard() external view returns (address[] memory addresses, uint256[] memory scores) {
        addresses = new address[](leaderboard.length);
        scores = new uint256[](leaderboard.length);
        
        for (uint256 i = 0; i < leaderboard.length; i++) {
            addresses[i] = leaderboard[i].user;
            scores[i] = leaderboard[i].score;
        }
        
        return (addresses, scores);
    }
    
    /**
     * @dev Get user information
     * @param userAddress Address of the user
     * @return bestScore User's best score
     * @return totalRewards Total rewards earned
     * @return lastClaimTime Last claim timestamp
     */
    function getUserInfo(address userAddress) external view returns (
        uint256 bestScore,
        uint256 totalRewards,
        uint256 lastClaimTime
    ) {
        User storage user = users[userAddress];
        return (user.bestScore, user.totalRewards, user.lastClaimTime);
    }
    
    /**
     * @dev Get time until next redistribution
     * @return seconds until next redistribution
     */
    function getTimeUntilRedistribution() external view returns (uint256) {
        uint256 nextRedistribution = lastRedistribution + REDISTRIBUTION_INTERVAL;
        if (block.timestamp >= nextRedistribution) {
            return 0;
        }
        return nextRedistribution - block.timestamp;
    }
    
    /**
     * @dev Fund the contract (for rewards)
     */
    receive() external payable {}
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
