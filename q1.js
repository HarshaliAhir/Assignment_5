// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Campaign {
        address payable creator;
        uint goal;
        uint deadline;
        uint totalContributed;
        bool completed;
        mapping(address => uint) contributions;
    }

    Campaign[] public campaigns;

    function createCampaign(uint _goal, uint _duration) external {
        Campaign storage newCampaign = campaigns.push();
        newCampaign.creator = payable(msg.sender);
        newCampaign.goal = _goal;
        newCampaign.deadline = block.timestamp + _duration;
        newCampaign.completed = false;
    }

    function contribute(uint _campaignId) external payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(!campaign.completed, "Campaign completed");

        campaign.totalContributed += msg.value;
        campaign.contributions[msg.sender] += msg.value;
    }

    function finalizeCampaign(uint _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign still ongoing");
        require(!campaign.completed, "Campaign already finalized");

        if (campaign.totalContributed >= campaign.goal) {
            campaign.creator.transfer(campaign.totalContributed);
        } else {
            for (uint i = 0; i < campaigns.length; i++) {
                uint contribution = campaign.contributions[campaigns[i].creator];
                if (contribution > 0) {
                    payable(campaigns[i].creator).transfer(contribution);
                    campaign.contributions[campaigns[i].creator] = 0;
                }
            }
        }

        campaign.completed = true;
    }

    function getCampaign(uint _campaignId) external view returns (
        address creator, uint goal, uint deadline, uint totalContributed, bool completed
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (campaign.creator, campaign.goal, campaign.deadline, campaign.totalContributed, campaign.completed);
    }
}
