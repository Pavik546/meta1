const { sequalize, client_table } = require('./sequalize');
const { client, redisGetAsync, redisSetAsync,redisDelAsync } = require('../middleware/redis');

const client_functions = {
    create_Client: async (req, res) => {
        try {
            const {
                client_name,
                client_email,
                contact_number,
                client_description,
                client_location,
                Created_by
            } = req.body;

            // Create a new client using the Sequelize model
            const newClient = await client_table.create({
                client_name,
                client_email,
                contact_number,
                client_description,
                client_location,
                Created_by
            });
            await redisDelAsync('allClients');

            const response = {
                success: true,
                message: 'Client created successfully',
                data: {
                    client_name,
                    client_email,
                    contact_number,
                    client_description,
                    client_location,
                    Created_by
                }
            };
            res.status(201).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while creating the client' });
        }
    },

    find_all_client: async (req, res) => {
        try {
            const cachedClients = await redisGetAsync('allClients');
            if (cachedClients) {
                const parsedClients = JSON.parse(cachedClients);
                res.json(parsedClients);
            } else {
                // If not cached, fetch clients from the database
                const allClients = await client_table.findAll();
                await redisSetAsync('allClients', JSON.stringify(allClients), 'EX', 3600);
                res.json(allClients);
            }
        } catch (error) {
            console.error('Error finding or caching clients:', error);
            res.status(500).json({ success: false, message: 'An error occurred while finding or caching clients' });
        }
    },

    update_existing_client: async (req, res) => {
        try {
            const clientId = req.params.id;
            const {
                client_name,
                client_email,
                contact_number,
                client_description,
                client_location,
                Modified_by
            } = req.body;

            // Find the client by ID
            const existingClient = await client_table.findByPk(clientId);

            if (!existingClient) {
                return res.status(404).json({ success: false, message: 'Client not found' });
            }

            // Update the client's information
            await existingClient.update({
                client_name,
                client_email,
                contact_number,
                client_description,
                client_location,
                Modified_by
            });
            await redisDelAsync(`client:${clientId}`);
            await redisDelAsync('allClients');
            // Customize the response format
            const response = {
                success: true,
                message: 'Client updated successfully',
                data: existingClient
            };
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'An error occurred while updating the client' });
        }
    },

    client_deactive: async (req, res) => {
        try {
            const id =req.params.id;
            console.log(id)
            const [rowsUpdated] = await client_table.update(
                { is_active: 0 },
                { where: { id } }
            );
            await redisDelAsync(`client:${id}`);
            await redisDelAsync('allClients');

            const responseMessage =
                rowsUpdated === 1 ? 'Client status updated' : 'Client not found';
            res.status(rowsUpdated === 1 ? 200 : 404).json({ message: responseMessage });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update client' });
        }
    },

    client_delete: async (req, res) => {
        try {
            const  id  =req.params.id;;
            const [rowsUpdated] = await client_table.update(
                { is_deleted: 1 },
                { where: { id } }
            );
            await redisDelAsync('allClients');
            await redisDelAsync(`client:${id}`);
            const responseMessage =
                rowsUpdated === 1 ? 'Client deleted' : 'Client not found';
            res.status(rowsUpdated === 1 ? 200 : 404).json({ message: responseMessage });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete client' });
        }
    },
    getClientById :async (req, res) => {
        try {
            const clientId = req.params.id; 
            console.log(clientId)
            const cachedClient = await redisGetAsync(`client:${clientId}`);
    
            if (cachedClient) {
                const parsedClient = JSON.parse(cachedClient);
                res.json(parsedClient);
            } else {
                const client = await client_table.findByPk(clientId);
    
                if (!client) {
                    return res.status(404).json({ success: false, message: 'Client not found' });
                }
                await redisSetAsync(`client:${clientId}`, JSON.stringify(client), 'EX', 3600);
                res.json(client);
            }
        } catch (error) {
            console.error('Error finding or caching client by ID:', error);
            res.status(500).json({ success: false, message: 'An error occurred while finding or caching client by ID' });
        }
    }

};

module.exports = client_functions;
