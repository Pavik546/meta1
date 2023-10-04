const { user, sequalize, campaign } = require('./sequalize');
// getCampaignById,getCampaigns,createCampaign
const { client, redisGetAsync, redisSetAsync,redisDelAsync } = require('../middleware/redis');


const campaignFunctions = {
    createCampaign: async (req, res) => {
        try {
            const { Campaign_Name, Start_date, Campaign_Description, Created_by,set_status } = req.body;

            // Create a new campaign record
            const newCampaign = await campaign.create({
                Campaign_Name,
                Start_date,
                Campaign_Description,
                Created_by, set_status,
            });
            await redisDelAsync('allCampaigns');

            res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
        } catch (error) {
            console.error('Error creating campaign:', error);
            res.status(500).json({ message: 'An error occurred while creating the campaign' });
        }
    },

    getCampaigns: async (req, res) => {
        try {
            const campaign1= await campaign.findAll();
            await redisSetAsync('allCampaigns', JSON.stringify(campaign1), 'EX', 3600);
            const cachedCampaign = await redisGetAsync('allCampaigns');
            const parsedCampaign = JSON.parse(cachedCampaign);
            res.status(200).json({ campaign: parsedCampaign });
        
        } catch (error) {
            console.error('Error fetching or caching campaigns:', error);
            res.status(500).json({ message: 'An error occurred while fetching or caching campaigns' });
        }
    },

    getCampaignById: async (req, res) => {
        const id = req.params.id;
        try {
            const cachedCampaign = await redisGetAsync(`campaign:${id}`);
            if (cachedCampaign) {
                const parsedCampaign = JSON.parse(cachedCampaign);
                res.status(200).json({ campaign: parsedCampaign });
            } else {
                const campaignRecord = await campaign.findByPk(id);

                if (campaignRecord) {
                    await redisSetAsync(`campaign:${id}`, JSON.stringify(campaignRecord), 'EX', 3600);
                    res.status(200).json({ campaign: campaignRecord });
                } else {
                    res.status(404).json({ message: 'Campaign not found' });
                }
            }
        } catch (error) {
            console.error('Error fetching or caching campaign by ID:', error);
            res.status(500).json({ message: 'An error occurred while fetching or caching the campaign' });
        }
    },

    updateCampaign: async (req, res) => {
        try {
            const id = req.params.id;
            const { Campaign_Name, Start_date, Campaign_Description, Created_by } = req.body;
            const existingCampaign = await campaign.findByPk(id);
            if (!existingCampaign) {
                return res.status(404).json({ success: false, message: 'Campaign not found' });
            }
            else{
                await campaign.update({
                   Campaign_Name,
                   Start_date,
                   Campaign_Description,
                   Created_by
               },
               {
                    where :{id:id}
               }
               );
              
               await redisDelAsync(`campaign:${id}`);

                res.json({ success: true, message: 'Campaign updated successfully' });
        }
        } catch (error) {
            console.error('Error updating campaign:', error);
            res.status(500).json({ success: false, message: 'An error occurred while updating the campaign' });
        }
    },

    deleteCampaign: async (req, res) => {
        try {
            const id = req.params.id;
            camp=await campaign.findByPk(id);
            const deletedCount = await campaign.destroy({
                where: { id }
            });
            if (deletedCount === 0) {
                return res.status(404).json({ success: false, message: 'Campaign not found' });
            }
            await redisDelAsync(`campaign:${id}`);
            await redisDelAsync('allCampaigns');
            res.json({ success: true, message: 'Campaign deleted successfully' });
        } catch (error) {
            console.error('Error deleting campaign:', error);
            res.status(500).json({ success: false, message: 'An error occurred while deleting the campaign' });
        }
    },

    campaign_deactivate: async (req, res) => {
        try {
            const id = req.params.id;
            const currentCampaign = await campaign.findOne({ where: { id } });

            if (!currentCampaign) {
                return res.status(404).json({ message: 'Campaign not found' });
            }

            else if (currentCampaign.set_status === 0) {
                return res.status(200).json({ message: 'Campaign is already deactivated' });
            }
            const [rowsUpdated] = await campaign.update(
                { set_status: 0 },
                { where: { id } }
            );

            if (rowsUpdated === 1) {
                await redisDelAsync(`campaign:${id}`);
                await redisDelAsync('allCampaigns');
                res.status(200).json({ message: 'Campaign deactivated' });
            } else {
                res.status(500).json({ message: 'Failed to deactivate Campaign' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to deactivate Campaign' });
        }
    }

};

module.exports = campaignFunctions;
