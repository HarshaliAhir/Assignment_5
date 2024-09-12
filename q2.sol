// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Proposal {
        string name;
        uint voteCount;
        bool exists;
    }

    mapping(uint => Proposal) public proposals;
    mapping(address => mapping(uint => bool)) public hasVoted;
    uint public proposalCount;

    function addProposal(string memory _name) external {
        proposalCount++;
        proposals[proposalCount] = Proposal({name: _name, voteCount: 0, exists: true});
    }

    function vote(uint _proposalId) external {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(!hasVoted[msg.sender][_proposalId], "You have already voted for this proposal");

        proposals[_proposalId].voteCount++;
        hasVoted[msg.sender][_proposalId] = true;
    }

    function getProposal(uint _proposalId) external view returns (string memory name, uint voteCount) {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.exists, "Proposal does not exist");
        return (proposal.name, proposal.voteCount);
    }

    function winningProposal() external view returns (string memory winnerName, uint highestVotes) {
        uint winningVoteCount = 0;
        string memory winnerProposal;

        for (uint i = 1; i <= proposalCount; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winnerProposal = proposals[i].name;
            }
        }

        return (winnerProposal, winningVoteCount);
    }
}
