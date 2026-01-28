const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const knex = require('knex')(require('../knexfile').development);

async function generateQR() {
  try {
    const donateData = await knex('website_donate').first();
    if (!donateData) {
      console.error('No donate data found');
      process.exit(1);
    }

    const localDetails = typeof donateData.local_bank_details === 'string' 
      ? JSON.parse(donateData.local_bank_details) 
      : donateData.local_bank_details;

    const qrText = `Account Name: ${localDetails.accountName}\nAccount No: ${localDetails.accountNumber}\nIFSC: ${localDetails.ifscCode}\nBank: ${localDetails.bankName}`;

    const uploadDir = path.join(__dirname, '../uploads/donate');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const qrPath = path.join(uploadDir, 'local_qr.png');
    await QRCode.toFile(qrPath, qrText, {
      width: 512,
      margin: 2,
      color: {
        dark: '#0f172a', // hst-dark
        light: '#ffffff'
      }
    });

    const relativePath = 'uploads/donate/local_qr.png';
    await knex('website_donate').where('id', donateData.id).update({
      local_qr_code_url: relativePath,
      updated_at: knex.fn.now()
    });

    console.log(`QR Code generated and saved to ${qrPath}`);
    console.log(`Database updated with local_qr_code_url: ${relativePath}`);
    process.exit(0);
  } catch (err) {
    console.error('Error generating QR code:', err);
    process.exit(1);
  }
}

generateQR();
