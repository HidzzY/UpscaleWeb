const axios = require('axios');
const formData = require('form-data');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar = new CookieJar();
const client = wrapper(axios.create({ 
    jar, 
    withCredentials: true 
}));

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { imageBase64, filename } = req.body;
        if (!imageBase64) return res.status(400).json({ message: 'No image data' });

        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const baseUrl = 'https://www.photiu.ai';
        
        const headers = {
            'Origin': baseUrl,
            'Referer': `${baseUrl}/id/image-upscaler`,
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        };

        await client.get(`${baseUrl}/id/image-upscaler`, { headers });

        const form = new formData();
        form.append('upfile', imageBuffer, { 
            filename: filename || 'image.jpg', 
            contentType: 'image/jpeg' 
        });
        form.append('factor', '2'); 

        const upscaleRes = await client.post(`${baseUrl}/api/upscale`, form, {
            headers: { 
                ...headers, 
                ...form.getHeaders() 
            },
            responseType: 'arraybuffer'
        });

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        return res.send(upscaleRes.data);

    } catch (e) {
        console.error('API Error:', e.message);
        return res.status(500).json({ status: false, message: "Server API sedang sibuk." });
    }
}
