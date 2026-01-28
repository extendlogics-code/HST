# Deploying HST Website: The "Split" Method (Recommended)

Since your Hostinger plan does not support Node.js, we will use the **Split Method**. This is the most professional and reliable way to host your application:
1.  **Frontend**: Hosted on **Hostinger** (Fast, reliable static hosting).
2.  **Backend**: Hosted on **Render** or **Railway** (Supports Node.js & Puppeteer for PDF generation).
3.  **Database**: Hosted on **Hostinger MySQL** (Keep your data where you already have it).

---

## **Step 1: Deploy Backend to Render.com**
*Render has a free tier and supports the libraries needed for your PDF certificates.*

1.  **Prepare your code**:
    - Push your entire project to a **GitHub** repository.
2.  **Create a New Web Service**:
    - Log in to [Render.com](https://render.com).
    - Click **New +** > **Web Service**.
    - Connect your GitHub repository.
3.  **Configure Service**:
    - **Name**: `hst-backend`
    - **Root Directory**: `backend`
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
4.  **Add Environment Variables**:
    - Click **Advanced** > **Add Environment Variable**:
        - `NODE_ENV`: `production`
        - `DB_HOST`: *Your Hostinger MySQL Hostname (e.g., `mysql.hostinger.com`)*
        - `DB_USER`: *Your Hostinger DB User*
        - `DB_PASSWORD`: *Your Hostinger DB Password*
        - `DB_NAME`: *Your Hostinger DB Name*
        - `JWT_SECRET`: *A random long string*
5.  **Enable Remote MySQL on Hostinger**:
    - In Hostinger hPanel, go to **Databases** > **Remote MySQL**.
    - Add the IP address `0.0.0.0` (or contact Render support for their IP range) to allow the backend to talk to the database.

---

## **Step 2: Deploy Frontend to Hostinger**
*Hostinger will serve your React app as static files.*

1.  **Build Locally**:
    - Open your terminal in the root folder.
    - Run:
      ```bash
      npm run build
      ```
    - This creates a `dist` folder.
2.  **Upload to Hostinger**:
    - Go to **Hostinger hPanel** > **File Manager**.
    - Navigate to `public_html`.
    - Upload all files from your local `dist` folder into `public_html`.
3.  **Fix React Routing (.htaccess)**:
    - In `public_html`, create a file named `.htaccess` and paste this:
      ```apache
      <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-y
        RewriteRule . /index.html [L]
      </IfModule>
      ```

---

## **Step 3: Connect Frontend to Backend**
1.  Once your Render backend is live, you will get a URL (e.g., `https://hst-backend.onrender.com`).
2.  Before you run `npm run build` locally, ensure your `.env` file (or environment variables) points to this URL:
    - `VITE_API_URL=https://hst-backend.onrender.com`
3.  Re-build and re-upload the `dist` folder to Hostinger.

---

## **Step 4: Troubleshooting Puppeteer (PDFs)**
If PDF generation fails on Render:
1.  Go to your Render Dashboard > **Settings**.
2.  Find **Build Filter** or **Environment**.
3.  Ensure you are using a **Docker** environment if the native Node environment lacks Chrome, OR simply use the native Node environment as Render usually includes the necessary libraries for Puppeteer.

---

## **Summary of URLs**
- **Website URL**: `https://yourdomain.com` (Hosted on Hostinger)
- **API URL**: `https://hst-backend.onrender.com` (Hosted on Render)
