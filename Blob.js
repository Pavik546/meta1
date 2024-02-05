// Example using Express.js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
const axios = require('axios');

const { BlobServiceClient } = require('@azure/storage-blob');

// Microsoft Graph API
const accessToken='eyJ0eXAiOiJKV1QiLCJub25jZSI6InNZX2lDVzdaQ0dJeUQyX1BtSEdRN2lWZ0t4azk5aE1UaEtyTHdQV2VjaU0iLCJhbGciOiJSUzI1NiIsIng1dCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSIsImtpZCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kN2EzZmY4Zi1lYTUxLTQ4ZjUtYjM1Ni0wZjFhZmQyOWQyMzMvIiwiaWF0IjoxNzA2NzExNjI3LCJuYmYiOjE3MDY3MTE2MjcsImV4cCI6MTcwNjcxNTU2NiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhWQUFBQUhSRHFJY1daNmRvS3NJQ3lxeUw0NUxVVTVjdno3SFA3NVlKZnpxZ0hxVlFkckdoWk5TNk1GU1VQVGdYT2s0MktpQ0wyKy9BeU1DaWl1djQ5T2h6S2NMNGtHZmdDM1Y5ZlNJVGNQQkFja3Z3PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiV2VhbHRoc215dGgtU1NPIiwiYXBwaWQiOiJmYWEwZWMxMi1kZDVkLTRjYWYtYTQ2Yi0wMTM0NDBlNWVjZjQiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6Ik11cHBpZGF0aGkiLCJnaXZlbl9uYW1lIjoiUGF2aXRocmEiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyNDAxOjQ5MDA6NGRlYjo5NTJhOjcxMTk6NTY6MTQ4NzpiMjRlIiwibmFtZSI6IlBhdml0aHJhIE11cHBpZGF0aGkgKERldmVsb3BlcikiLCJvaWQiOiI3M2I0ZGFlOC0zZmFjLTQxOWItOTJmZi1lOGIwOTU5YTc0ZDEiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDM0NEE5MjlBQSIsInJoIjoiMC5BYjBBal8tajExSHE5VWl6Vmc4YV9TblNNd01BQUFBQUFBQUF3QUFBQUFBQUFBRExBTVUuIiwic2NwIjoiZW1haWwgRmlsZXMuUmVhZFdyaXRlIG9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiI1YTFWenQ0Mm1LZ0tvNmJTd0E2ZlhZa2V0ek5PVGhqYlYzSDNmRmRVY3pRIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiZDdhM2ZmOGYtZWE1MS00OGY1LWIzNTYtMGYxYWZkMjlkMjMzIiwidW5pcXVlX25hbWUiOiJQYXZpdGhyYUB3ZWFsdGhzbXl0aC5jb20iLCJ1cG4iOiJQYXZpdGhyYUB3ZWFsdGhzbXl0aC5jb20iLCJ1dGkiOiI2OWd0UHp2Z2RVYXhwLW4wZFFkLUFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6IjRXaXUxcDlGaHNKclJfSlBKNEJyRWhoMkx2eFlMaF84cXVpSnBDckhZTW8ifSwieG1zX3RjZHQiOjE2OTM0MDgwOTF9.iSNlXO2_bOTaMfR19lIwe_5n_yiS212iFavCv4DJlpC24em9BCbeKNdTvFTvPq_adzrbczGgzqbyLkSfNtDkpQt1RU8KjKtEXD-BZmxc_V857-na2h8eAM0tm7D0EOdrVZcwiMOSGFdSmfcAcyW2rpUhKIRWlhzbMsh43eK2i0TN46PYnEwfOsPn0M1p5C108L_gM1yfyfoYEoxlEw3P0mKRuI9r_x8rX9BI2enc3_kC_t71LiEzmbuOOEtXp5ryZDyczYI9HboUtDE00It6OxfBCb_bxLd1PVaCbZnZs9yThbBvCce37eTd_NpdMB-KDZR6Q6urKj6WkKVVZFIy1w'
   const graphApiUrl = 'https://graph.microsoft.com/v1.0/me/photo/$value';

// Azure Storage
const connectionString = 'DefaultEndpointsProtocol=https;AccountName=wealthsmythdata;AccountKey=uKvD5QMiYEhvqFW8J/8DIxBuBOpcqDgsb3LVJgvA4cU0mVuCxskxa+VwTl4omIaFz26hq5rvT0rp+AStge2urQ==;EndpointSuffix=core.windows.net'; // Replace with your actual connection string
const containerName = 'userprofilepic'; // Replace with your container name
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);
const blobClient = containerClient.getBlockBlobClient('user_photo1.jpg');

function downloadUserPhoto() {
    return axios.get(graphApiUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'arraybuffer',
    });
}


function uploadToAzureStorage(bufferData) {
    return blobClient.upload(bufferData, bufferData.length, { blobHTTPHeaders: { blobContentType: 'image/jpeg' } });
}


async function main() {
    try {
        // Download user photo
        const response = await downloadUserPhoto();

        // Check for errors in the response
        if (response.data instanceof Buffer) {
            await uploadToAzureStorage(response.data);
            console.log('Image uploaded to Azure Storage successfully.');
            const imageUrl = blobClient.url;
            console.log('Image URL:', imageUrl);
        } else {
            console.error('Error:', 'Unexpected response format');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ...


// Run the main function
main();


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
