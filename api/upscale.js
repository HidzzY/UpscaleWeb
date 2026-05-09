const axios = require('axios');
const formData = require('form-data');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar = new CookieJar();
const client = wrapper(axios.create({ 
    jar, 
    withCredentials: true 
}));

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { imageBase64, filename } = req.body;
        const imageBuffer = Buffer.from(imageBase64, 'base64');

        const baseUrl = 'https://www.photiu.ai';
        const upscaleUrl = `${baseUrl}/api/upscale`;
        
        const headers = {
            'Origin': baseUrl,
            'Referer': `${baseUrl}/id/image-upscaler`,
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        };

        // Get cookies first
        await client.get(`${baseUrl}/id/image-upscaler`, { headers });

        const form = new formData();
        form.append('upfile', imageBuffer, { 
            filename: filename || 'input.jpg', 
            contentType: 'image/jpeg' 
        });
        form.append('factor', '2'); 

        const upscaleRes = await client.post(upscaleUrl, form, {
            headers: { 
                ...headers, 
                ...form.getHeaders() 
            },
            responseType: 'arraybuffer'
        });

        // Kirim hasil binari gambar kembali ke frontend
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(upscaleRes.data);

    } catch (e) {
        return res.status(500).json({ status: false, message: e.message });
    }
}